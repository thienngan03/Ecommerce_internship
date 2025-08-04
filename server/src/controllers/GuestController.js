const {models}= require("../models/index.js");
const reuse = require("../reuse/reuse.js");

class GuestController {
    getProducts = async (req, res) => {
        try {
            const products = await models.Product.findAll({
            });
            const randomProducts = reuse.getRandomElements(products, 100);

            return res.status(200).json(randomProducts);
        } catch (error) {
            return res.status(500).json({message: "Internal server error"});
        }
    }
    getProductById = async (req, res) => {
        const { id } = req.params;
        try {
            const product = await models.Product.findOne({
                where: { id }
            });
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            return res.status(200).json(product);
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    getShops = async (req, res) => {
        try {
            const shops = await models.Shop.findAll({
            });
            return res.status(200).json(shops);
        } catch (error) {
            return res.status(500).json({message: "Internal server error"});
        }
    }
    getShopById = async (req, res) => {
        const { id } = req.params;
        try {
            const shop = await models.Shop.findOne({
                where: { id }
            });
            if (!shop) {
                return res.status(404).json({ message: "Shop not found" });
            }
            return res.status(200).json(shop);
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    getShopByProductId = async (req, res) => {
        const { productId } = req.params;
        try {
            const product = await models.Product.findOne({
                where: { id: productId }
            });
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            const shop = await models.Shop.findOne({
                where: { id: product.shopId }
            });
            if (!shop) {
                return res.status(404).json({ message: "Shop not found" });
            }
            return res.status(200).json(shop);
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    searchProduct = async (req, res) => {
        const { query } = req.query;
        console.log("Search Query:", query);
        try {
            const products = await models.Product.findAll({});
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(query.toLowerCase())
            );
            if (filteredProducts.length === 0) {
                return res.status(404).json({ message: "No products found" });
            }
            return res.status(200).json(filteredProducts);
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    searchShop = async (req, res) => {
        const { query } = req.query;
        console.log("Search Query:", query);
        try {
            const shops = await models.Shop.findAll({});
            const filteredShops = shops.filter(shop => 
                shop.name.toLowerCase().includes(query.toLowerCase())
            );
            if (filteredShops.length === 0) {
                return res.status(404).json({ message: "No shops found" });
            }
            return res.status(200).json(filteredShops);
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
module.exports = new GuestController();
    