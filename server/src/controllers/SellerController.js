const { Op} = require('sequelize');
const {models}= require("../models/index.js");
const reuse = require("../reuse/reuse.js");


class UserController {
    // Seller
    createSeller = async (req, res) => {
        try {
            const accountId = req.params.accountId;
            const {name, phone, address} = req.body;
            const avatarUrl = req.file ? reuse.replaceUrl(req.file.path, req) : null;

            const seller = await models.Seller.findOne({where: {accountId}});
            if (!seller) {
                return res.status(404).json({message: "Seller not found"});
            }
            seller.name = name || seller.name;
            seller.phone = phone || seller.phone;
            seller.address = address || seller.address;
            if (avatarUrl) {
                seller.avatarUrl = reuse.replaceUrl(avatarUrl, req);
            }
            await seller.save();
            return res.status(200).json(seller);
        } catch (error) {
            console.error("Error creating seller:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }
    createShop = async (req, res) => {
        try {
            const accountId = req.params.accountId;
            const {name, description, address, phone, email} = req.body;
            const avatarUrl = req.file ? reuse.replaceUrl(req.file.path, req) : null; 
            const shop = await models.Shop.create({
                accountId,
                name,
                description,
                address,
                phone,
                email,
                avatarUrl: avatarUrl ? reuse.replaceUrl(avatarUrl, req) : null
            });
            return res.status(200).json(shop);
        } catch (error) {
            console.error("Error creating shop:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }
    getSeller = async (req, res) => {
        try {
            const accountId = req.params.accountId;
            const seller = await models.Seller.findOne({where: {accountId}});
            if (!seller) {
                return res.status(404).json({message: "Seller not found"});
            }
            return res.status(200).json(seller);
        } catch (error) {
            console.error("Error fetching seller:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    getSellerById = async (req, res) => {
        try {
            const {sellerId} = req.params;
            const seller = await models.Seller.findByPk(sellerId);
            if (!seller) {
                return res.status(404).json({message: "Seller not found"});
            }
            seller.avatarUrl = reuse.replaceUrl(seller.avatarUrl, req);
            return res.status(200).json(seller);
        } catch (error) {
            console.error("Error fetching seller:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
    getShopByAccountId = async (req, res) => {
        try {
            const accountId =req.params.accountId;
            const shop = await models.Shop.findOne({where: {accountId}});
            if (!shop) {
                return res.status(404).json({message: "Shop not found"});
            }
            shop.avatarUrl = reuse.replaceUrl(shop.avatarUrl, req);
            return res.status(200).json(shop);
        }
        catch (error) {
            console.error("Error fetching shop:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
    getShopById = async (req, res) => {
        try {
            const {shopId} = req.params;
            const shop = await models.Shop.findByPk(shopId);
            if (!shop) {
                return res.status(404).json({message: "Shop not found"});
            }
            shop.avatarUrl = reuse.replaceUrl(shop.avatarUrl, req);
            return res.status(200).json(shop);
        } catch (error) {
            console.error("Error fetching shop:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
    updateSeller = async (req, res) => {
        try {
            const sellerId = req.params.sellerId;
            const {name, numberPhone, address}  = req.body;
            const avatarUrl = req.file ? reuse.replaceUrl(req.file.path, req) : null;
            console.log("Avatar URL:", sellerId);
            const seller = await models.Seller.findByPk(sellerId);
            if (!seller) {
                return res.status(404).json({message: "Seller not found"});
            }
            seller.name = name || seller.name;
            seller.phone = numberPhone || seller.phone;
            seller.address = address || seller.address;
            seller.avatarUrl = avatarUrl || seller.avatarUrl;
            await seller.save();
            return res.status(200).json(seller);
        } catch (error) {
            console.error("Error updating seller:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
    updateShop = async (req, res) => {
        try {
            const {shopId} = req.params;
            const {name, description, address, phone, email} = req.body
            const avatarUrl = req.file ? reuse.replaceUrl(req.file.path, req) : null;

            const shop = await models.Shop.findByPk(shopId);
            if (!shop) {
                return res.status(404).json({message: "Shop not found"});
            }
            shop.name = name || shop.name;
            shop.description = description || shop.description;
            shop.address = address || shop.address;
            shop.phone = phone || shop.phone;
            shop.email = email || shop.email;
            shop.avatarUrl = avatarUrl || shop.avatarUrl;
            shop.avatarUrl = reuse.replaceUrl(shop.avatarUrl, req);
            await shop.save();
            return res.status(200).json(shop);
        } catch (error) {
            console.error("Error updating shop:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    // deleteSeller = async (req, res) => {
    //     try {
    //         const {id} = req.params;
    //         const seller = await models.Seller.findByPk(id);
    //         if (!seller) {
    //             return res.status(404).json({message: "Seller not found"});
    //         }
    //         await seller.destroy();
    //         const account = await models.Account.findByPk(seller.accountId);
    //         if (account) {
    //             await account.destroy();
    //         }
    //         const shop = await models.Shop.findOne({where: {accountId: seller.accountId}});
    //         if (shop) {
    //             await shop.destroy();
    //         }
    //         const products = await models.Product.findAll({where: {sellerId: id}});
    //         if (products) {
    //             await Promise.all(products.map(product => {
    //                 product.isActive = false;
    //                 product.save();
    //             }));
    //         }
    //         const orders = await models.Order.findAll({where: {sellerId: id}});
    //         if (orders) {
    //             await Promise.all(orders.map(order => {
    //                 if (order.status === 'pending') {
    //                     order.status = 'cancelled';
    //                     order.save();
    //                 }
    //             }));
    //         }
    //         const categories = await models.Category.findAll({where: {sellerId: id}});
    //         if (categories) {
    //             await Promise.all(categories.map(category => {
    //                 category.isActive = false;
    //                 category.save();
    //             }));
    //         }

    //         return res.status(200).json({message: "Seller deleted successfully"});
    //     } catch (error) {
    //         console.error("Error deleting seller:", error);
    //         return res.status(500).json({message: "Internal Server Error"});
    //     }
    // }

    // Category
    createCategory = async (req, res) => {
        try {
            const {name} = req.body;
            const {shopId} = req.params;
            const newCategory = await models.Category.create({name, shopId});
            return res.status(201).json(newCategory);
        } catch (error) {
            console.error("Error creating category:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
    getCategories = async (req, res) => {
        try {
            const shopId = req.params.shopId;
            const categories = await models.Category.findAll({where: {shopId}});
            if (!categories || categories.length === 0) {
                return res.status(404).json({message: "No categories found for this shop"});
            }
            return res.status(200).json(categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
            
    getCategoryById = async (req, res) => {
        try {
            const {categoryId} = req.params;
            const category = await models.Category.findByPk(categoryId);
            if (!category) {
                return res.status(404).json({message: "Category not found"});
            }
            return res.status(200).json(category);
        } catch (error) {
            console.error("Error fetching category:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
    updateCategory = async (req, res) => {
        try {
            const {categoryId} = req.params;
            const {name, description} = req.body;
            const category = await models.Category.findByPk(categoryId);
            if (!category) {
                return res.status(404).json({message: "Category not found"});
            }
            category.name = name || category.name;
            category.description = description || category.description;
            await category.save();
            return res.status(200).json(category);
        } catch (error) {
            console.error("Error updating category:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
    deleteCategory = async (req, res) => {
        try {
            const categoryId = req.params.categoryId;
            const category = await models.Category.findByPk(categoryId);
            if (!category) {
                return res.status(404).json({message: "Category not found"});
            }
            const productCategories = await models.ProductCategory.findAll({where: {categoryId: categoryId}});
            if (productCategories.length > 0) {
                await Promise.all(productCategories.map(pc => pc.destroy()));
            }
            await category.destroy();
            return res.status(200).json({message: "Category deleted successfully"});
        } catch (error) {
            console.error("Error deleting category:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
    // Product
    createProduct = async (req, res) => {
        try {
            const {name, price, description, stock, categoryId} = req.body;
            let imageUrl = req.file ? reuse.replaceUrl(req.file.path, req) : null;
            const{shopId} = req.params;
            if (!name || !price || !stock || !shopId) {
                return res.status(400).json({message: "Missing required fields"});
            }
            imageUrl = reuse.replaceUrl(imageUrl, req);
                 
            const newProduct = await models.Product.create({name, price, description, stock, imageUrl, shopId});

            if (categoryId && Array.isArray(categoryId) && categoryId.length > 0) {
                categoryId.forEach(async (id) => {
                    const category = await models.Category.findByPk(id);
                    if (!category) {
                        return res.status(404).json({message: "Category not found"});
                    }
                    await models.ProductCategory.create({productId: newProduct.id, categoryId: id});
                });
            } else if (categoryId) {
                const category = await models.Category.findByPk(categoryId);
                if (!category) {
                    return res.status(404).json({message: "Category not found"});
                }
                await models.ProductCategory.create({productId: newProduct.id, categoryId});
            }
            return res.status(201).json(newProduct);
        } catch (error) {
            console.error("Error creating product:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
    getProductById = async (req, res) => {
        try {
            const {productId} = req.params;
            const product = await models.Product.findByPk(productId, 
                {where: {isActive: true}});
            if (!product) {
                return res.status(404).json({message: "Product not found"});
            }
            
            const productCategories = await models.ProductCategory.findAll({where: {productId}});
            const categories = await Promise.all(productCategories.map(async (pc) => {
                const category = await models.Category.findByPk(pc.categoryId);
                if (!category) {
                    throw new Error("Category not found");
                }
                return category;
            }));
            const productData = {
                ...product.get(),
                categories: categories.map(c => ({
                    id: c.id,
                    name: c.name,
                    description: c.description
                }))
            };
            return res.status(200).json(productData);
        } catch (error) {
            console.error("Error fetching product:", error);
            return res.status(500).json({message: "Internal Server Error"});

        }
    }
    getProductsByShopId = async (req, res) => {
    try {
        const { shopId } = req.params;

        const products = await models.Product.findAll({
        where: { shopId, isActive: true },
        });

        if (!products || products.length === 0) {
        return res.status(404).json({ message: "No products found for this shop" });
        }

        const productIds = products.map((p) => p.id);
        const productCategories = await models.ProductCategory.findAll({
        where: { productId: productIds },
        });

        const categoryIds = [...new Set(productCategories.map((pc) => pc.categoryId))];
        const categories = await models.Category.findAll({
        where: { id: categoryIds },
        });

        const categoryMap = new Map();
        categories.forEach((cat) => {
        categoryMap.set(cat.id, cat.name);
        });

        const productCategoryMap = {};
        productCategories.forEach((pc) => {
        if (!productCategoryMap[pc.productId]) {
            productCategoryMap[pc.productId] = [];
        }
        const categoryName = categoryMap.get(pc.categoryId);
        if (categoryName) {
            productCategoryMap[pc.productId].push({ name: categoryName });
        }
        });

        const productsData = products.map((product) => ({
        ...product.get(),
        categories: productCategoryMap[product.id] || [],
        }));

        return res.status(200).json(productsData);
    } catch (error) {
        console.error("Error fetching products by shop:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    };

    getProductsByCategory = async (req, res) => {
        try {
            const {categoryId} = req.params;
            const products = await models.Product.findAll({
                include: [{
                    model: models.Category,
                    as: 'categories',
                    where: {id: categoryId}
                }],
                where: {isActive: true}
            });
            if (!products || products.length === 0) {
                return res.status(404).json({message: "No products found for this category"});
            }
            return res.status(200).json(products);
        } catch (error) {
            console.error("Error fetching products by category:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }   
    }
        
    updateProduct = async (req, res) => {
        try {
            const {productId} = req.params;
            const {name, price, description, stock, categoryIds} = req.body;
            const imageUrl = req.file ? reuse.replaceUrl(req.file.path, req) : null;
            const product = await models.Product.findByPk(productId);
            if (!product || !product.isActive) {
                return res.status(404).json({message: "Product not found"});
            }
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            if (imageUrl) {
                product.imageUrl = imageUrl;
                product.imageUrl = reuse.replaceUrl(product.imageUrl, req);
            }
            product.stock = stock || product.stock;
            await product.save();
            if (categoryIds && categoryIds.length > 0) {
                await models.ProductCategory.destroy({where: {productId}});
                categoryIds.forEach(async (categoryId) => {
                    await models.ProductCategory.create({productId, categoryId});
                });
            }
            return res.status(200).json(product);
        } catch (error) {
            console.error("Error updating product:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
    deleteProduct = async (req, res) => {
        try {
            const {productId} = req.params;
            const product = await models.Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({message: "Product not found"});
            }
            product.isActive = false;
            await product.save();
            const productCategories = await models.ProductCategory.findAll({where: {productId}});
            if (productCategories.length > 0) {
                await Promise.all(productCategories.map(pc => pc.destroy()));
            }
            const orderDetails = await models.OrderDetail.findAll({where: {productId}});
            if(orderDetails.length > 0) {
                orderDetails.forEach(async (detail) => {
                    const order = await models.Order.findByPk(detail.orderId);
                    if(order && (order.status === 'pending' ) && detail.price > 0) {
                        order.totalPrice -= detail.price * detail.quantity;
                        await order.save();
                    }
                    await detail.destroy();
                    const orderDetail = await models.OrderDetail.findByPk(detail.id);
                    if(!orderDetail && order.status === 'pending') {
                       order.status = 'cancelled';
                       await order.save();
                    }
                });
            }
            return res.status(200).json({message: "Product deleted successfully"});
        } catch (error) {
            console.error("Error deleting product:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    // Order
    getOrdersByShopId = async (req, res) => {
        try {
            const {shopId} = req.params;
            const orders = await models.Order.findAll({
                include: [{
                    model: models.OrderDetail,
                    as: 'orderDetails',
                    include: [{
                        model: models.Product,
                        as: 'product',
                        where: {shopId}
                    }]
                }],
                where: {status: {[Op.not]: 'cancelled'}}
            });
            if (!orders || orders.length === 0) {
                return res.status(404).json({message: "No orders found for this shop"});
            }
            return res.status(200).json(orders);
        } catch (error) {
            console.error("Error fetching orders by shop:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
    getOrderById = async (req, res) => {
        try {
            const {orderId} = req.params;
            const order = await models.Order.findByPk(orderId, {
                include: [{
                    model: models.OrderDetail,
                    as: 'orderDetails',
                    include: [{
                        model: models.Product,
                        as: 'product'
                    }]
                }]
            });
            if (!order) {
                return res.status(404).json({message: "Order not found"});
            }
            return res.status(200).json(order);
        } catch (error) {
            console.error("Error fetching order:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
    updateOrderStatus = async (req, res) => {
        try {
            const {orderId} = req.params;
            const {status} = req.body;
            const order = await models.Order.findByPk(orderId);
            if (!order) {
                return res.status(404).json({message: "Order not found"});
            }
            if (['pending', 'shipped', 'delivered', 'canceled'].includes(status)) {
                order.status = status;
                await order.save();
                return res.status(200).json(order);
            } else {
                return res.status(400).json({message: "Invalid status"});
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }



}

module.exports = new UserController();