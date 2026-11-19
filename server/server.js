require('dotenv').config({ quiet: true });
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const ensureAdmin = require('./config/ensureAdmin');

// Socket.IO needs the raw HTTP server (Express alone is not enough)
const httpServer = http.createServer(app);
const origins = (process.env.CLIENT_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
const io = new Server(httpServer, {
  cors: { origin: origins.length ? origins : '*', methods: ['GET', 'POST'] },
});

// Make io available inside controllers via req.app.get('io')
app.set('io', io);

// Handle client connections and disconnections
io.on('connection', (socket) => {
  console.log(`🔌 Client connected:    ${socket.id}  (online: ${io.engine.clientsCount})`);
  socket.emit('welcome', { message: 'Connected to BiteOrder live updates', id: socket.id });

  socket.on('disconnect', (reason) => {
    console.log(`❌ Client disconnected: ${socket.id}  (reason: ${reason}, online: ${io.engine.clientsCount})`);
  });
});

const PORT = process.env.PORT || 5001;
connectDB().then(ensureAdmin).then(() => {
  httpServer.listen(PORT, () => {
    console.log('===================================================');
    console.log(`🚀 BiteOrder API Server running at: http://localhost:${PORT}`);
    console.log(`📖 REST Endpoints: http://localhost:${PORT}/api/menu`);
    console.log('===================================================');
  });
});

// Graceful shutdown (Docker / Render send SIGTERM)
process.on('SIGTERM', () => {
  console.log('SIGTERM received – closing server');
  io.close();
  httpServer.close(() => process.exit(0));
});
