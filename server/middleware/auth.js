const jwt = require('jsonwebtoken');
const User = require('../models/User');

// protect: verifies the Bearer token and attaches the user to req.user
const protect = async (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized: no token provided.' });
  }
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // throws if tampered or expired
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authorized: user no longer exists.' });
    }
    req.user = user;
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Not authorized: token expired.' : 'Not authorized: invalid token.';
    res.status(401).json({ success: false, message });
  }
};

// optionalAuth: attaches req.user when a valid token is sent, otherwise continues as guest
const optionalAuth = async (req, res, next) => {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    } catch (_) { /* ignore invalid token for guests */ }
  }
  next();
};

// adminOnly: must run after protect; allows only role === 'admin'
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ success: false, message: 'Forbidden: admin access required.' });
};

module.exports = { protect, optionalAuth, adminOnly };
