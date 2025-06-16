// apps/backend/server.js
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import http from 'http'; // Import http module
import { Server } from 'socket.io'; // Import Server from socket.io
import cors from 'cors'; // <--- NEW: Import CORS middleware

dotenv.config();
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js'; // This now includes Paystack routes
import uploadRoutes from './routes/uploadRoutes.js';
// import paymentRoutes from './routes/paymentRoutes.js'; // <--- REMOVE THIS LINE
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const port = process.env.PORT || 5000;

connectDB(); // Connect to MongoDB

const app = express();
const server = http.createServer(app); // Create an HTTP server from your Express app

// Initialize Socket.IO server
const io = new Server(server, {
    cors: {
        // Use CORS_ORIGIN for Socket.IO as well for consistency
        origin: process.env.CORS_ORIGIN, // THIS IS THE CHANGE
        methods: ["GET", "POST"]
    }
});

// <--- NEW: CORS middleware for Express routes (before body parsers) --->
// This must be placed before your routes and body parsers for proper functioning.
app.use(cors({
    origin: [
        'https://jp-ken-e-commerce-client.vercel.app', // For your deployed frontend
        'http://localhost:5173' // For local development (if you still use it)
    ],
    credentials: true, // Allow cookies to be sent
}));

// Body parser middleware
app.use(express.json()); // Essential for parsing JSON bodies, including webhooks
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Application routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes); // This now contains all order and Paystack payment routes
app.use('/api/upload', uploadRoutes);

// Your existing PayPal route (kept for now)
app.get('/api/config/paypal', (req, res) => {
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Get the directory name of the current module
const __dirname = path.resolve();
// Serve the 'uploads' folder statically
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Basic route for the root URL
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`Socket.IO: A user connected with ID: ${socket.id}`);

    // Listen for client to join a specific order room
    socket.on('joinOrderRoom', (orderId) => {
        socket.join(orderId);
        console.log(`Socket.IO: Socket ${socket.id} joined room for Order ID: ${orderId}`);
    });

    // Listen for client to leave a specific order room
    socket.on('leaveOrderRoom', (orderId) => {
        socket.leave(orderId);
        console.log(`Socket.IO: Socket ${socket.id} left room for Order ID: ${orderId}`);
    });

    socket.on('disconnect', () => {
        console.log(`Socket.IO: User disconnected with ID: ${socket.id}`);
    });
});


// Error handling middleware (should be last)
app.use(notFound);
app.use(errorHandler);

// Start the HTTP server (which Express is attached to)
server.listen(port, () => console.log(`Server running on port ${port}`));

// Export `io` instance so it can be imported and used in other modules (like controllers)
export { io };