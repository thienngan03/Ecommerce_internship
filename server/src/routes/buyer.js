const express = require('express');
const router = express.Router();
const buyerController = require('../controllers/BuyerController');
const upload = require('../middleware/upload');

// buyer
    router.put('/:accountId/createBuyer', upload.single('avatar'), buyerController.createBuyer);
    router.get('/:accountId/getBuyer', buyerController.getBuyer);
    router.get('/getProfile/:buyerId', buyerController.getBuyerById);
    router.put('/updateProfile/:buyerId', upload.single('avatar'), buyerController.updateBuyer);
    router.put('/delete/:buyerId', buyerController.deleteBuyer);
// cart
    router.get('/:buyerId/carts', buyerController.getCartsByBuyerId);
    router.post('/:buyerId/cart', buyerController.createCart);
    router.put('/:buyerId/cart', buyerController.updateCart);
    router.put('/:buyerId/cart/delete', buyerController.removeProductFromCart);
// order
    router.post('/:buyerId/checkout', buyerController.checkout);
    router.post('/:buyerId/prepareTransaction', buyerController.prepareTransaction);
    router.put("/:buyerId/updateTransaction/:orderId", buyerController.updateTransaction);
    router.post('/:buyerId/checkTransaction/:orderId', buyerController.checkTransaction);
    router.get('/:buyerId/orders', buyerController.getOrdersByBuyerId);
    router.get('/:buyerId/order/:orderId', buyerController.getOrderById);
module.exports = router;
