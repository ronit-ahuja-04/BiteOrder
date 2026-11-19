// BiteOrder - Menu Controller (MongoDB + Mongoose persistence, Experiment 5)
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

const categories = [
  { id: 'all', name: 'All Dishes', icon: '🍽️' },
  { id: 'starters', name: 'Starters', icon: '🍢' },
  { id: 'mains', name: 'Main Course', icon: '🍛' },
  { id: 'breads', name: 'Breads', icon: '🫓' },
  { id: 'desserts', name: 'Desserts', icon: '🍨' },
  { id: 'beverages', name: 'Beverages', icon: '☕' },
];

// Shared error helper: maps Mongoose errors to proper HTTP responses
const handleError = (res, error, fallbackMessage) => {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: `Validation Error: ${messages.join(' ')}`,
    });
  }
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid value for "${error.path}": ${error.value}`,
    });
  }
  res.status(500).json({ success: false, message: fallbackMessage, error: error.message });
};

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const invalidIdResponse = (res) =>
  res.status(400).json({
    success: false,
    message: 'Invalid ID parameter. ID must be a valid 24-character MongoDB ObjectId.',
  });

// Broadcast a real-time notification to every connected client (Experiment 7)
const notifyClients = (req, type, item, message) => {
  const io = req.app.get('io');
  if (!io) return;
  io.emit('notification', {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type, // 'created' | 'updated' | 'deleted'
    message,
    item: { id: String(item._id), name: item.name, category: item.category, price: item.price },
    by: req.user ? req.user.name : 'Admin',
    timestamp: new Date().toISOString(),
  });
};

const escapeRegex =(s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// 1. GET /api/menu - Retrieve all menu items (optional ?category= and ?q= filters)
exports.getMenu = async (req, res) => {
  try {
    const { category, q } = req.query;
    const filter = {};

    if (category && category !== 'all') filter.category = category.toLowerCase();
    if (q && q.trim()) {
      const regex = new RegExp(escapeRegex(q.trim()), 'i');
      filter.$or = [{ name: regex }, { description: regex }];
    }

    const items = await MenuItem.find(filter).sort({ createdAt: 1, _id: 1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    handleError(res, error, 'Server error retrieving menu items');
  }
};

// 2. GET /api/menu/:id - Retrieve a single menu item by ObjectId
exports.getMenuItemById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return invalidIdResponse(res);
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Menu item with ID ${req.params.id} not found.`,
      });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    handleError(res, error, 'Server error retrieving menu item');
  }
};

// 3. POST /api/menu - Create a new menu item (schema validators enforce required fields)
exports.createMenuItem = async (req, res) => {
  try {
    const body = { ...req.body };
    if (typeof body.price !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: "price" must be a positive number.',
      });
    }
    if (body.halfPrice === undefined && body.price > 0) body.halfPrice = Math.round(body.price * 0.65);

    const item = await MenuItem.create(body);
    notifyClients(req, 'created', item, `New dish added: ${item.name} (₹${item.price})`);
    res.status(201).json({ success: true, message: 'Menu item created successfully.', data: item });
  } catch (error) {
    handleError(res, error, 'Server error creating menu item');
  }
};

// 4. PUT /api/menu/:id - Update an existing menu item
exports.updateMenuItem = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return invalidIdResponse(res);
    if (req.body.price !== undefined && typeof req.body.price !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: "price" must be a positive number.',
      });
    }

    const { _id, id, ...updates } = req.body;
    const item = await MenuItem.findByIdAndUpdate(req.params.id, updates, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Menu item with ID ${req.params.id} not found. Cannot update.`,
      });
    }
    notifyClients(req, 'updated', item, `Dish updated: ${item.name} is now ₹${item.price}`);
    res.status(200).json({
      success: true,
      message: `Menu item with ID ${req.params.id} updated successfully.`,
      data: item,
    });
  } catch (error) {
    handleError(res, error, 'Server error updating menu item');
  }
};

// 5. DELETE /api/menu/:id - Remove a menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return invalidIdResponse(res);
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Menu item with ID ${req.params.id} not found. Cannot delete.`,
      });
    }
    notifyClients(req, 'deleted', item, `Dish removed from the menu: ${item.name}`);
    res.status(200).json({
      success: true,
      message: `Menu item "${item.name}" (ID: ${req.params.id}) deleted successfully.`,
      deletedData: item,
    });
  } catch (error) {
    handleError(res, error, 'Server error deleting menu item');
  }
};

// 6. GET /api/categories - Retrieve all menu categories
exports.getCategories = (req, res) => {
  res.status(200).json({ success: true, count: categories.length, data: categories });
};

// 7. GET /api/orders - Retrieve all orders (newest first)
exports.getAllOrders = async (req, res) => {
  try {
    // populate(): follow the Order.user reference and return the account's name/email with each order
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    handleError(res, error, 'Server error retrieving orders');
  }
};

// 8. POST /api/orders - Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const { tableNumber, orderType, items, subtotal, gst, total, customer } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Order must contain at least one item.',
      });
    }
    const order = await Order.create({ tableNumber, orderType, items, subtotal, gst, total, customer, user: req.user ? req.user._id : undefined });
    res.status(201).json({ success: true, message: 'Order created successfully.', data: order });
  } catch (error) {
    handleError(res, error, 'Server error placing order');
  }
};

// GET /api/orders/my - orders placed by the logged-in user (protected)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean(); // uses the {user, createdAt} index
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    handleError(res, error, 'Server error retrieving your orders');
  }
};

// 9. GET /api/orders/:id - Retrieve order by orderId (e.g. BO-1001-XYZ)
exports.getOrderById = async (req, res) => {
  try {
    // IDOR fix: the owner comes from the verified JWT (req.user), never from the request.
    // Customers can only match their own orders; admins may view any order.
    const filter = { orderId: req.params.id };
    if (req.user.role !== 'admin') filter.user = req.user._id;

    const order = await Order.findOne(filter);
    if (!order) {
      // same 404 whether the order does not exist or belongs to someone else -> nothing is disclosed
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    handleError(res, error, 'Server error retrieving order');
  }
};

// 10. PUT /api/orders/:id - Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, _id, ...updates } = req.body;
    const order = await Order.findOneAndUpdate({ orderId: req.params.id }, updates, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${req.params.id} not found.`,
      });
    }
    res.status(200).json({
      success: true,
      message: `Order ${req.params.id} updated successfully.`,
      data: order,
    });
  } catch (error) {
    handleError(res, error, 'Server error updating order');
  }
};

// 11. DELETE /api/orders/:id - Cancel/remove an order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ orderId: req.params.id });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${req.params.id} not found. Cannot cancel.`,
      });
    }
    res.status(200).json({
      success: true,
      message: `Order ${req.params.id} cancelled and removed successfully.`,
      deletedData: order,
    });
  } catch (error) {
    handleError(res, error, 'Server error cancelling order');
  }
};
