// Express application (no network listening here, so it can be tested with supertest).
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const menuRoutes = require('./routes/menuRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const isTest = process.env.NODE_ENV === 'test';

app.set('trust proxy', 1); // correct client IPs behind Render/Vercel proxies

// ---- Security & logging middleware ----
app.use(helmet());                                    // secure HTTP headers
const origins = (process.env.CLIENT_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors({ origin: origins.length ? origins : true })); // set CLIENT_ORIGIN in production
app.use(express.json({ limit: '100kb' }));            // body parsing with size limit
if (!isTest) app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')); // request logging

// Brute-force protection on login/registration
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  message: { success: false, message: 'Too many attempts. Please try again in 15 minutes.' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ---- Health check & API index ----
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', uptime: process.uptime() }));
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'BiteOrder Restaurant REST API is live',
    version: '3.0.0',
    docs: 'See docs/API.md in the repository',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Create a customer account',
        'POST /api/auth/login': 'Login, returns a JWT',
        'GET /api/auth/me': 'Current user (token required)',
        'GET /api/auth/users': 'All users (admin only)',
      },
      menu: {
        'GET /api/menu': 'List menu items (?category=&q=)',
        'GET /api/menu/:id': 'One menu item',
        'POST /api/menu': 'Create (admin only)',
        'PUT /api/menu/:id': 'Update (admin only)',
        'DELETE /api/menu/:id': 'Delete (admin only)',
      },
      orders: {
        'POST /api/orders': 'Place an order (guest or logged in)',
        'GET /api/orders/my': 'My orders (token required)',
        'GET /api/orders/:orderId': 'One order (owner or admin)',
        'GET /api/orders': 'All orders (admin only)',
        'PUT /api/orders/:orderId': 'Update status (admin only)',
        'DELETE /api/orders/:orderId': 'Cancel order (admin only)',
      },
      other: { 'GET /api/categories': 'Menu categories', 'GET /health': 'Health check' },
    },
  });
});

// ---- Routes ----
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api', menuRoutes);

// ---- 404 + central error handler (must be last) ----
app.use(notFound);
app.use(errorHandler);

module.exports = app;
