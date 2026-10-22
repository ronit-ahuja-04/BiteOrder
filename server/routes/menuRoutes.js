const express = require('express');
const router = express.Router();
const {
  getMenu,
  getCategories,
  placeOrder,
  getOrderById,
} = require('../controllers/menuController');

// Menu item endpoints
router.get('/menu', getMenu);
router.get('/categories', getCategories);

// Order endpoints
router.post('/orders', placeOrder);
router.get('/orders/:id', getOrderById);

module.exports = router;
