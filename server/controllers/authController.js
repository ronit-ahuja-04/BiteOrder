const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

const sendAuth = (res, status, user, message) =>
  res.status(status).json({ success: true, message, token: signToken(user), user });

// POST /api/auth/register  (role is always "customer"; admins are created via seed script)
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email: String(email || '').toLowerCase() })) {
      return res.status(409).json({ success: false, message: 'Email is already registered.' });
    }
    const user = await User.create({ name, email, password });
    sendAuth(res, 201, user, 'Registration successful.');
  } catch (error) {
    if (error.name === 'ValidationError') {
      const msgs = Object.values(error.errors).map((e) => e.message).join(' ');
      return res.status(400).json({ success: false, message: `Validation Error: ${msgs}` });
    }
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
    // same message for unknown email and wrong password (no user enumeration)
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    sendAuth(res, 200, user, 'Login successful.');
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

// GET /api/auth/me  (protected)
exports.getMe = (req, res) => res.status(200).json({ success: true, user: req.user });

// GET /api/auth/users  (admin only)
exports.getUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: 1 });
  res.status(200).json({ success: true, count: users.length, data: users });
};
