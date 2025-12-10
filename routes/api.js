const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');
const { ensureAuth } = require('../middlewares/auth');

// Products
router.get('/products/partial', productController.getProductsPartial);

// Cart
router.post('/cart', ensureAuth, cartController.addToCart);
router.delete('/cart/:itemId', ensureAuth, cartController.removeFromCart);

// Checkout
router.post('/checkout', ensureAuth, orderController.postCheckout);

module.exports = router;
