const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');
const { ensureAuth } = require('../middlewares/auth');

// Auth
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);
router.get('/logout', authController.logout);

// Public
router.get('/', productController.getIndex);
router.get('/products', productController.getProducts);
router.get('/products/:slug', productController.getProductDetail);

// Protected
router.get('/profile', ensureAuth, authController.getProfile);
router.post('/profile', ensureAuth, authController.postProfile);
router.get('/cart', ensureAuth, cartController.getCart);
router.get('/checkout', ensureAuth, orderController.getCheckout);
router.get('/orders', ensureAuth, orderController.getOrders);
router.get('/orders/:id', ensureAuth, orderController.getOrderDetail);
router.post('/orders/:id/cancel', ensureAuth, orderController.cancelOrder);
router.post('/reviews', ensureAuth, productController.postReview);

module.exports = router;
