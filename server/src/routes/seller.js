const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const upload = require('../middleware/upload');

// seller
router.put('/:accountId', upload.single('avatar'), sellerController.createSeller); // add type param: seller for avatar
router.put('/:accountId/createShop', upload.single('avatar'), sellerController.createShop);// add type param: shop for avatar
router.get('/:accountId/getSeller', sellerController.getSeller);
router.get('/getSeller/:sellerId', sellerController.getSellerById);
router.get('/:accountId/getShop', sellerController.getShopByAccountId);
router.put('/updateSeller/:sellerId', upload.single('avatar'), sellerController.updateSeller);
router.put('/updateShop/:shopId', upload.single('avatar'), sellerController.updateShop);
// router.delete('/:sellerId', sellerController.deleteSeller);
// Category
router.post('/:shopId/createCategory', sellerController.createCategory);
router.get('/:shopId/categories', sellerController.getCategories);
router.get('/:shopId/categories/:categoryId', sellerController.getCategoryById);
router.put('/:shopId/categories/:categoryId', sellerController.updateCategory);
router.put('/:shopId/categories/delete/:categoryId', sellerController.deleteCategory);
// product
router.post('/:shopId/product', upload.single('imageUrl'), sellerController.createProduct);
router.get('/:shopId/product/:productId', sellerController.getProductById);
router.get('/:shopId/products', sellerController.getProductsByShopId);
router.get('/:shopId/products/category/:categoryId', sellerController.getProductsByCategory);
router.put('/:shopId/updateProduct/:productId', upload.single('imageUrl'), sellerController.updateProduct);
router.put('/:shopId/product/delete/:productId', sellerController.deleteProduct);
// Order
router.get('/:shopId/orders', sellerController.getOrdersByShopId);
router.get('/:shopId/orders/:orderId', sellerController.getOrderById);
router.put('/:shopId/orders/:orderId', sellerController.updateOrderStatus);


module.exports = router;