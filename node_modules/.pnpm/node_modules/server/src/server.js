// apps/backend/src/server.js
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser'; // <--- REMOVE THIS IMPORT
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

dotenv.config();
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const port = process.env.PORT || 5000;

connectDB(); // Connect to MongoDB

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO server
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"]
  }
});

// Custom middleware to capture the raw request body for webhooks and other POST requests
const rawBodySaver = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
    console.log('rawBodySaver: Raw body captured globally. Length:', buf.length); // Debug log
  } else {
    console.log('rawBodySaver: Raw body is empty or undefined (globally).'); // Debug log
  }
};


// CORS middleware
app.use(cors({
  origin: [
      process.env.CORS_ORIGIN, // Your deployed Vercel frontend URL
      'http://localhost:5173' // Your local development frontend URL (if needed)
  ],
  // credentials: true, // <--- You can remove this if no other cross-origin cookies are used.
                      //       Keeping it doesn't hurt if other features might need it.
}));

// Body parser middleware - IMPORTANT: Apply express.json with the verify function GLOBALLY
// This ensures rawBody is available for all JSON requests, including webhooks.
// This must come *before* any other route handlers that might consume the body.
app.use(express.json({ verify: rawBodySaver }));
app.use(express.urlencoded({ extended: true }));

// app.use(cookieParser()); // <--- REMOVE THIS LINE


// Application routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
  res.send('API is running...');
});

io.on('connection', (socket) => {
  console.log(`Socket.IO: A user connected with ID: ${socket.id}`);
  socket.on('joinOrderRoom', (orderId) => {
    socket.join(orderId);
    console.log(`Socket.IO: Socket ${socket.id} joined room for Order ID: ${orderId}`);
  });
  socket.on('leaveOrderRoom', (orderId) => {
    socket.leave(orderId);
    console.log(`Socket.IO: Socket ${socket.id} left room for Order ID: ${orderId}`);
  });
  socket.on('disconnect', () => {
    console.log(`Socket.IO: User disconnected with ID: ${socket.id}`);
  });
});

app.use(notFound);
app.use(errorHandler);

server.listen(port, () => console.log(`Server running on port ${port}`));

export { io };