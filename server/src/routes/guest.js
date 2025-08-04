const express = require('express');
const router = express.Router();
const GuestController = require('../controllers/GuestController');
const upload = require('../middleware/upload');

router.get('/products', GuestController.getProducts);
router.get('/shops', GuestController.getShops);
router.get('/products/:id', GuestController.getProductById);
router.get('/shops/:id', GuestController.getShopById);
router.get('/shops/product/:productId', GuestController.getShopByProductId);

// search 
router.get('/search/products', GuestController.searchProduct);
router.get('/search/shops', GuestController.searchShop);
module.exports = router;
