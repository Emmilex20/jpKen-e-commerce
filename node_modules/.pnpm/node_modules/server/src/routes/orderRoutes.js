import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateOrderToPaidManually,
  cancelOrder,
} from '../controllers/orderController.js';
import {
  initializePaystackPayment,
  handlePaystackWebhook,
} from '../controllers/paystackController.js';

import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

// ... (your existing order routes)

// --- PAYSTACK SPECIFIC ROUTES ---

// Custom middleware to capture the raw request body for webhooks
const rawBodySaver = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

router.route('/:id/paystack/initialize').post(protect, initializePaystackPayment);

// Route for Paystack webhooks (public, Paystack server will call this)
// Apply express.json() with the verify option to get the raw body
router.post(
  '/paystack/webhook',
  express.json({ verify: rawBodySaver }), // <-- CRITICAL CHANGE FOR WEBHOOK
  handlePaystackWebhook
);
// --- END PAYSTACK SPECIFIC ROUTES ---

export default router;