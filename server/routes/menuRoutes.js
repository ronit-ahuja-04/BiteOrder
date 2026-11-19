const express = require('express');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

const { menuCreateRules, menuUpdateRules, orderRules, orderStatusRules } = require('../middleware/validate');

const router = express.Router();
const {
  getMenu,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories,
  getAllOrders,
  placeOrder,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getMyOrders,
} = require('../controllers/menuController');

// ==========================================
// 1. MENU ITEMS CRUD ENDPOINTS
// ==========================================

// GET /api/menu - Retrieve all menu items (with filtering)
router.get('/menu', getMenu);

// GET /api/menu/:id - Retrieve single menu item by ID
router.get('/menu/:id', getMenuItemById);

// POST /api/menu - Create a new menu item
router.post('/menu', protect, adminOnly, menuCreateRules, createMenuItem);

// PUT /api/menu/:id - Update an existing menu item
router.put('/menu/:id', protect, adminOnly, menuUpdateRules, updateMenuItem);

// DELETE /api/menu/:id - Delete a menu item
router.delete('/menu/:id', protect, adminOnly, deleteMenuItem);

// ==========================================
// 2. CATEGORIES ENDPOINT
// ==========================================
router.get('/categories', getCategories);

// ==========================================
// 3. ORDERS CRUD ENDPOINTS
// ==========================================

// GET /api/orders - Retrieve all orders
router.get('/orders/my', protect, getMyOrders);
router.get('/orders', protect, adminOnly, getAllOrders);

// GET /api/orders/:id - Retrieve a specific order by orderId
router.get('/orders/:id', protect, getOrderById);   // login required + ownership check in the controller

// POST /api/orders - Place a new order
router.post('/orders', optionalAuth, orderRules, placeOrder);

// PUT /api/orders/:id - Update order status
router.put('/orders/:id', protect, adminOnly, orderStatusRules, updateOrderStatus);

// DELETE /api/orders/:id - Cancel/remove an order
router.delete('/orders/:id', protect, adminOnly, deleteOrder);

module.exports = router;
