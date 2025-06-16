import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
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

// --- CRITICAL CHANGE FOR CORS ---
// This middleware must be placed before your routes and body parsers for proper functioning.
// Use an array for 'origin' if you need to support both Vercel and localhost during dev.
app.use(cors({
  origin: [
      process.env.CORS_ORIGIN, // Your deployed Vercel frontend URL
      'http://localhost:5173' // Your local development frontend URL (if needed)
  ],
  credentials: true, // ALLOW COOKIES TO BE SENT CROSS-ORIGIN
}));

// Body parser middleware - IMPORTANT: For webhooks, the specific route's express.json()
// needs the `verify` option, not necessarily this global one unless you want rawBody globally.
// We will handle rawBody specifically in orderRoutes.js for the webhook.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

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