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
// Route to initialize Paystack payment for an order
// The order ID is passed in the request body for this specific endpoint, not as a URL param for simplicity
router.route('/:id/paystack/initialize').post(protect, initializePaystackPayment);

// Route for Paystack webhooks (public, Paystack server will call this)
// This should be outside of the '/:id' route structure, as it's a general webhook listener
// Ensure express.json() is used here to parse the webhook body
router.post('/paystack/webhook', express.json(), handlePaystackWebhook);
// --- END PAYSTACK SPECIFIC ROUTES ---

export default router;