const express = require('express');
const app = express();
const menuRoutes = require('./routes/menuRoutes');

// Middleware to parse incoming JSON
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'BiteOrder Restaurant API running',
    version: '1.0.0',
    endpoints: ['/api/menu', '/api/categories', '/api/orders'],
  });
});

// API Routes
app.use('/api', menuRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Port configuration
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 BiteOrder API Server running at http://localhost:${PORT}`);
});
