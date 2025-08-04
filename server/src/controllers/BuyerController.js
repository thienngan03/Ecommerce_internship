const { where, or } = require("sequelize");
const {models}= require("../models/index.js");
const reuse = require("../reuse/reuse.js");

class BuyerController {
    //buyer
    createBuyer = async (req, res) => {
        try {
            const {name, phone, address} = req.body;
            const avatarUrl = req.file ? reuse.replaceUrl(req.file.path, req) : null;
            const accountId = req.params.accountId;
            const buyer = await models.Buyer.findOne({where: {accountId, isActive: true}});
            if (!buyer) {
                return res.status(404).json({message: "Buyer not found"});
            }
            buyer.name = name || buyer.name;
            buyer.phone = phone || buyer.phone;
            buyer.address = address || buyer.address;
            if (avatarUrl) {
                buyer.avatarUrl = reuse.replaceUrl(avatarUrl, req);
            }
            await buyer.save();
            return res.status(200).json(buyer);
        } catch (error) {
            console.error("Error creating buyer:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }

    getBuyer = async (req, res) => {
        try {
            const accountId = req.params.accountId;
            const buyer = await models.Buyer.findOne({
                where: {accountId, isActive: true},
            });
            if (!buyer) {
                return res.status(404).json({message: "Buyer not found"});
            }
            return res.status(200).json(buyer);
        } catch (error) {
            console.error("Error fetching buyer:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }
    getBuyerById = async (req, res) => {
        try {
            const {buyerId} = req.params;
            const buyer = await models.Buyer.findByPk(buyerId, { where: {isActive: true} });
            if (!buyer) {
                return res.status(404).json({message: "Buyer not found"});
            }
            return res.status(200).json(buyer);
        } catch (error) {
            console.error("Error fetching buyer by ID:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }
    updateBuyer = async (req, res) => {
        try {
            const {buyerId} = req.params;
            const {name, phone, address} = req.body;
            const avatarUrl = req.file ? reuse.replaceUrl(req.file.path, req) : null;

            const buyer = await models.Buyer.findByPk(buyerId, { where: {isActive: true} });
            if (!buyer) {
                return res.status(404).json({message: "Buyer not found"});
            }
            buyer.name = name || buyer.name;
            buyer.phone = phone || buyer.phone;
            buyer.address = address || buyer.address;
            if (avatarUrl) {
                buyer.avatarUrl = reuse.replaceUrl(avatarUrl, req);
            }
            await buyer.save();
            return res.status(200).json(buyer);
        } catch (error) {
            console.error("Error updating buyer:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }
    deleteBuyer = async (req, res) => {
        try {
            const {buyerId} = req.params;
            const buyer = await models.Buyer.findByPk(buyerId, { where: {isActive: true} });
            if (!buyer) {
                return res.status(404).json({message: "Buyer not found"});
            }
            buyer.isActive = false; // Soft delete
            await buyer.save();
            const carts = await models.Cart.findAll({ where: { buyerId: buyer.id, status: "active" } });
            if (carts) {
                await Promise.all(carts.map(cart => {
                    cart.isActive = false; // Soft delete
                    cart.save();
                }));
            }
            return res.status(200).json({message: "Buyer deleted successfully"});
        } catch (error) {
            console.error("Error deleting buyer:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }

    // Cart
    createCart= async (req, res) => {
        try {
            const {productId, quantity} = req.body;
            const buyerId = req.params.buyerId;
            let isExit = false;

            const product = await models.Product.findByPk(productId, { where: {isActive: true} });
            if (!product || !product.isActive) {
                return res.status(404).json({message: "Product not found"});
            }
            if (quantity <= 0 || quantity > product.stock) {
                return res.status(400).json({message: "Insufficient stock"});
            }
            const existingCart = await models.Cart.findOne({
                where: {buyerId, productId,isActive: true}
            });
            if (existingCart) {

                const newQuantity = Number(existingCart.quantity) + Number(quantity);
                if (newQuantity > product.stock) {
                    return res.status(400).json({message: "Insufficient stock"});
                }
                existingCart.quantity = newQuantity;
                await existingCart.save();
                isExit = true;
                return res.status(200).json({existingCart,isExit});
            }
            const cart = await models.Cart.create({
                buyerId,
                productId,
                quantity,
            });
            return res.status(201).json({cart, isExit});
        } catch (error) {
            console.error("Error adding to cart:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }
    getCartsByBuyerId = async (req, res) => {
        try {
            const buyerId = req.params.buyerId;
            const carts = await models.Cart.findAll({
                where: {buyerId, isActive: true},
            });
            if (!carts || carts.length === 0) {
                return [];
            }
            const products = [];
            const shops = [];

            await Promise.all(carts.map(async cart => {
                const product = await models.Product.findByPk(cart.productId, { where: {isActive: true} });
                if (product) {
                    products.push(product);
                }
                const shop = await models.Shop.findByPk(product.shopId, { where: {isActive: true} });
                if (shop) {
                    shops.push(shop);
                }
            }));


            return res.status(200).json({carts, products, shops});
        } catch (error) {
            console.error("Error fetching cart:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }
    updateCart = async (req, res) => {
        try {
            const {quantity, productId} = req.body;
            const buyerId = req.params.buyerId;
            const cart = await models.Cart.findOne({ where: { productId, buyerId, isActive: true } });
            if (!cart || !cart.isActive) {
                return res.status(404).json({message: "Cart item not found"});
            }
            if (quantity < 0) {
                return res.status(400).json({message: "Invalid quantity"});
            }
            if (quantity === 0) {
                cart.isActive = false; // Soft delete
                await cart.save();
                return res.status(200).json({message: "Cart item removed"});
            }
            const product = await models.Product.findByPk(cart.productId);
            if (quantity > product.stock) {
                return res.status(400).json({message: "Insufficient stock"});
            }
            cart.quantity = quantity;
            await cart.save();
            return res.status(200).json(cart);
        } catch (error) {
            console.error("Error updating cart:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }
    removeProductFromCart = async (req, res) => {
        try {
            const {buyerId} = req.params;
            const {productId} = req.body;
            const cart = await models.Cart.findOne({ where: {isActive: true, buyerId, productId } });
            if (!cart) {
                return res.status(404).json({message: "Cart item not found"});
            }
            cart.isActive = false; // Soft delete
            await cart.save();
            return res.status(200).json({message: "Product removed from cart"});
        } catch (error) {
            console.error("Error removing product from cart:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }

    // checkout
    checkout = async (req, res) => {
        try {
            const buyerId = req.params.buyerId;
            const {productIds, paymentMethod} = req.body;
            let totalPrice = 0;
            var status = "unpaid";

            if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
                return res.status(400).json({ message: "Invalid or empty productIds" });
            }              
            if(paymentMethod === "cash"){
                status = "pending";
            }
            const order = await models.Order.create({
                buyerId,
                totalPrice,
                status,
                paymentMethod
            });
            for (const element of productIds) {
                const cart = await models.Cart.findOne({
                    where: { productId: element, buyerId, isActive: true },
                });
                if (!cart) {
                    order.destroy();
                    return res.status(404).json({message: `Cart item not found`, productId: element});

                }
                const product = await models.Product.findByPk(element, { where: {isActive: true} });
                
                totalPrice += Number(product.price) * Number(cart.quantity);

                await models.OrderDetail.create({
                    orderId: order.id,
                    productId: product.id,
                    quantity: cart.quantity,
                    price: Number(product.price) * Number(cart.quantity),
                });
                order.totalPrice = totalPrice;
                await order.save();
                await models.Cart.update(
                    { isActive: false },
                    { where: { buyerId, isActive: true, productId: element } }
                );

            };
            
            return res.status(200).json({order});
        } catch (error) {
            console.error("Error during checkout:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }
   prepareTransaction = async (req, res) => {
        try {
            const {buyerId} = req.params;
            const {bank_type, totalPrice, orderId} = req.body;

            const buyer = await models.Buyer.findByPk(buyerId, { where: {isActive: true} });
            if (!buyer) {
                return res.status(404).json({message: "Buyer not found"});
            }
            let transaction = {
                merchant_code: process.env.MERCHANT_CODE,
                platform: "web",
                payment_channel: "atm",
                bank_type: bank_type || "domestic",
                req_time: Date.now(),
                merchant_order_id: String(orderId),
                amount: Number(totalPrice),
                description: "Payment for order" + `order-${Date.now()}`,
                payment_type: "05",
                currency: "USD",
                redirect_url: `http://localhost:3000/buyer/order`,
                store_label: process.env.STORE,
                store_code: process.env.STORE,
                terminal_label: process.env.STORE,
                terminal_code: process.env.STORE,
                purpose_of_transaction: "ABC",
                signature: null,
                customer_mobile_number: buyer.phone || "",
                customer_name: buyer.name || "",
            };
            const signature = reuse.createSignature(transaction);
            transaction.signature = signature;

            const response = await fetch(process.env.TRANSACTION_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...transaction,
              }),
            });
            const result = await response.json();
            return res.status(200).json({result});
        } catch (error) {
            console.error("Error preparing transaction:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }
    updateTransaction = async (req, res) => {
        try {
            const {orderId} = req.params;
            const result = await models.Order.update(
                { status: 'pending' },
                { where: { id: orderId, status: 'unpaid' } }
            );
            if (!result) {
                return res.status(404).json({message: "Order not found or already processed"});
            }
            return res.status(200).json({message: "Transaction updated successfully"});
        } catch (error) {
            console.error("Error updating transaction:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }
    checkTransaction = async (req, res) => {
        try {
            const {buyerId, orderId} = req.params;
            const {transactionUrl} = req.body;
            const order = await models.Order.findOne({
                where: {buyerId, id: orderId},
            });
            if (!order) {
                return res.status(404).json({message: "Order not found"});
            }
            const paresUrl = new URL(transactionUrl); // Create a URL object from the payment_url
            const fv_payment_transid = paresUrl.searchParams.get('fv_payment_transid');

            let status = "initial"
            let checkTrans = setInterval(async () => {
             const response = await fetch(process.env.TRANSACTION_CHECK_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fv_payment_transid: fv_payment_transid,
                        transaction_type:"payment",
                    }),
                });
                const result = await response.json();
                if (result.data.status === "success") {
                    clearInterval(checkTrans);
                    status = "success";
                    order.status = "pending";
                    await order.save();
                    return res.status(200).json({status});
                }
            }, 1000);
            setTimeout(() => {
                clearInterval(checkTrans);
                if (status === "initial") {
                    status = "failed";
                }
            return res.status(200).json({status});
            },  1800000); // Stop checking after 30 minutes


        } catch (error) {
            console.error("Error checking transaction:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }
    getShopsByShopId = async (req, res) => {
        try {
            const buyerId = req.params.buyerId;
            const carts = await models.Cart.findAll({
                where: {buyerId, isActive: true},
            });
            if (!carts || carts.length === 0) {
                return res.status(404).json({message: "No items in cart"});
            }
            const shopIds = [...new Set(carts.map(cart => cart.shopId))];
            const shops = await models.Shop.findAll({
                where: {id: shopIds, isActive: true},
            });
            return res.status(200).json(shops);
        } catch (error) {
            console.error("Error fetching shops:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }
    // Orders
    getOrdersByBuyerId = async (req, res) => {
        try {
            const buyerId = req.params.buyerId;
            const orders = await models.Order.findAll({
                where: {buyerId},
                include: [
                    {
                        model: models.OrderDetail,
                        as: 'orderDetails',
                        include: [
                            {
                                model: models.Product,
                                as: 'product',
                                attributes: ['id', 'name', 'price', 'imageUrl'],
                                include: [
                                    { model: models.Shop, as: 'shop', attributes: ['name'] }
                                ]
                            }
                        ]
                    }
                ]
            });
            if (!orders || orders.length === 0) {
                return res.status(404).json({message: "No orders found"});
            }
            return res.status(200).json(orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }
    getOrderById = async (req, res) => {
        try {
            const orderId = req.params.orderId;
            const order = await models.Order.findByPk(orderId, {
                include: [
                    {
                        model: models.OrderDetail,
                        as: 'orderDetails',
                        include: [
                            {
                                model: models.Product,
                                as: 'product',
                                attributes: ['id', 'name', 'price', 'imageUrl']
                            }
                        ]
                    }
                ]
            });
            if (!order) {
                return res.status(404).json({message: "Order not found"});
            }
            return res.status(200).json(order);
        } catch (error) {
            console.error("Error fetching order by ID:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }
    



}
module.exports = new BuyerController();