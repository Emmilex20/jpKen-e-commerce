// apps/backend/routes/orderRoutes.js
import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid, // This is for other payment methods like PayPal
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateOrderToPaidManually, // This is the controller for manual payment
  cancelOrder,
} from '../controllers/orderController.js';
import {
  initializePaystackPayment, // Paystack initialization controller
  handlePaystackWebhook,     // Paystack webhook handler controller
} from '../controllers/paystackController.js';

import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

// Base routes for orders
router.route('/')
  .post(protect, addOrderItems) // Create a new order
  .get(protect, admin, getOrders); // Get all orders (admin only)

// Get orders for the logged-in user
router.route('/myorders').get(protect, getMyOrders);

// Get a specific order by ID
// Apply checkObjectId middleware to routes that expect an ObjectId in params.id
router.route('/:id').get(protect, checkObjectId, getOrderById);

// Routes for payment updates and delivery
router.route('/:id/pay').put(protect, checkObjectId, updateOrderToPaid); // For PayPal/other client-side payments
router.route('/:id/pay-manually').put(protect, admin, updateOrderToPaidManually); // For admin manual update (uses /pay-manually)
router.route('/:id/deliver').put(protect, checkObjectId, admin, updateOrderToDelivered);
router.route('/:id/cancel').put(protect, cancelOrder); // NEW ROUTE

// --- PAYSTACK SPECIFIC ROUTES ---

// Custom middleware to capture the raw request body for webhooks
// This must be defined before it's used in the webhook route.
const rawBodySaver = (req, res, buf, encoding) => {
  console.log('--- rawBodySaver middleware hit ---'); // Debug log
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
    console.log('rawBodySaver: buf length:', buf.length); // Debug log
  } else {
    console.log('rawBodySaver: buf is empty or undefined'); // Debug log
  }
};

// Route to initialize Paystack payment for an order
router.route('/:id/paystack/initialize').post(protect, initializePaystackPayment);

// Route for Paystack webhooks (public, Paystack server will call this)
// This should be outside of the '/:id' route structure, as it's a general webhook listener
// Ensure express.json() is used here WITH THE VERIFY OPTION
router.post(
  '/paystack/webhook',
  express.json({ verify: rawBodySaver }), // <--- This is the crucial part
  handlePaystackWebhook
);
// --- END PAYSTACK SPECIFIC ROUTES ---

export default router;