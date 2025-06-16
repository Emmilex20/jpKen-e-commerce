// apps/backend/controllers/paystackController.js
import asyncHandler from '../middleware/asyncHandler.js';
import Paystack from 'paystack-api'; // Still needed for initialize, but not for verify in webhook
import Order from '../models/Order.js'; // Ensure correct path/filename for your Order model (capital O as per the casing error fix)
import crypto from 'crypto';
import axios from 'axios'; // Import axios for direct API call
import { io } from '../server.js'; // Import the Socket.IO instance

// Initialize Paystack with your secret key from environment variables
// Ensure PAYSTACK_SECRET_KEY is set in your .env file (e.g., sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx)
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

// @desc    Initialize a Paystack transaction
// @route   POST /api/orders/:id/paystack/initialize
// @access  Private
const initializePaystackPayment = asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const { amount, email } = req.body; // Getting amount (in kobo) and email from request body

    // Input validation
    if (!orderId) {
        res.status(400);
        throw new Error('Order ID is required as a URL parameter.');
    }
    if (!amount || amount <= 0) { // Amount must be positive and in kobo
        res.status(400);
        throw new Error('Amount is required and must be a positive number.');
    }
    if (!email) {
        res.status(400);
        throw new Error('Email is required.');
    }

    // Find the order to ensure it exists and matches the amount
    const order = await Order.findById(orderId);

    if (!order) {
        res.status(404);
        throw new Error('Order not found.');
    }

    // Double-check if order total matches amount (Paystack expects Kobo/cents)
    // This validates that the amount sent from the frontend matches the actual order total
    // Consider rounding here too if you encounter issues with floating points on comparison
    if (Math.round(order.totalPrice * 100) !== amount) {
        res.status(400);
        throw new Error(`Amount mismatch. Expected ${Math.round(order.totalPrice * 100)} (Kobo), received ${amount} (Kobo).`);
    }

    // Check if order is already paid
    if (order.isPaid) {
        res.status(400);
        throw new Error('Order has already been paid.');
    }

    try {
        const response = await paystack.transaction.initialize({
            amount: amount, // Passed directly in Kobo/cents
            email: email,
            // IMPORTANT: Ensure process.env.FRONTEND_URL is set in your backend's .env file
            // For development with ngrok, this should be your frontend ngrok URL (e.g., https://your-frontend-url.ngrok-free.app)
            callback_url: `${process.env.FRONTEND_URL}/order/${orderId}`,
            metadata: {
                order_id: orderId, // Pass order_id in metadata for webhook verification
            },
        });


        if (response.status) {
            res.status(200).json({
                status: 'success',
                authorization_url: response.data.authorization_url,
                access_code: response.data.access_code,
                reference: response.data.reference,
                message: 'Paystack transaction initialized successfully',
            });
        } else {
            console.error('Paystack API Initialization Error (response status false):', response.message, response.data?.message);
            res.status(400);
            throw new Error(response.message || response.data?.message || 'Paystack initialization failed.');
        }
    } catch (error) {
        console.error('Paystack Initialization Exception (caught error):', error.message || error);
        // --- DEBUG LOGS FOR DETAILED PAYSTACK ERROR ---
        if (error.response) {
            console.error('Raw Paystack API Error Details (from error.response):', error.response.data);
            console.error('Paystack API HTTP Status:', error.response.status);
        }
        // --- END DEBUG LOGS ---

        if (error.response) { // Error originating from Paystack API (e.g., 400, 401, 403)
            res.status(error.response.status || 500);
            throw new Error(error.response.data?.message || 'Error from Paystack API.');
        }
        res.status(500);
        throw new Error('Paystack initialization failed due to server error. Please try again.');
    }
});

// @desc    Handle Paystack webhooks (for verification)
// @route   POST /api/orders/paystack/webhook
// @access  Public (Paystack calls this)
const handlePaystackWebhook = asyncHandler(async (req, res) => {
    // It's crucial to verify the webhook signature for security
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto.createHmac('sha512', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
        console.warn('Paystack Webhook: Invalid signature.');
        return res.status(400).send('Invalid signature');
    }

    const event = req.body;
    const eventType = event.event;
    const data = event.data;


    if (eventType === 'charge.success' && data.status === 'success') {
        const reference = data.reference;
        const orderId = data.metadata?.order_id; // Retrieve order_id from metadata

        if (!orderId) {
            console.warn('Paystack Webhook: order_id not found in metadata for reference:', reference);
            return res.status(400).send('Order ID not found in metadata');
        }

        const order = await Order.findById(orderId);

        if (order) {
            if (order.isPaid) {
                return res.status(200).json({ message: 'Order already paid.' });
            }

            // Verify the transaction directly with Paystack API using axios
            try {
                const verificationResponse = await axios.get(
                    `https://api.paystack.co/transaction/verify/${reference}`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                        },
                    }
                );

                if (verificationResponse.data.status && verificationResponse.data.data.status === 'success') {
                    // Additional check: Ensure amount matches (round both for robust comparison)
                    // Paystack amount is in Kobo, convert order.totalPrice to Kobo
                    if (Math.round(verificationResponse.data.data.amount) !== Math.round(order.totalPrice * 100)) {
                        console.warn(`Paystack Webhook: Amount mismatch for order ${orderId}. Expected ${Math.round(order.totalPrice * 100)}, received ${Math.round(verificationResponse.data.data.amount)}`);
                        return res.status(400).send('Amount mismatch after verification.');
                    }

                    order.isPaid = true;
                    order.paidAt = new Date(verificationResponse.data.data.paid_at || Date.now());
                    order.paymentResult = {
                        id: verificationResponse.data.data.id,
                        status: verificationResponse.data.data.status,
                        update_time: verificationResponse.data.data.paid_at,
                        email_address: verificationResponse.data.data.customer.email,
                        channel: verificationResponse.data.data.channel,
                        currency: verificationResponse.data.data.currency,
                        amount: verificationResponse.data.data.amount / 100, // Convert Kobo back to original currency unit for storage
                        reference: verificationResponse.data.data.reference,
                    };

                    const updatedOrder = await order.save();
                    // --- Socket.IO: Emit payment success event ---
                    // Send to clients subscribed to this specific order ID room
                    io.to(orderId.toString()).emit('paymentSuccess', {
                        orderId: orderId.toString(),
                        isPaid: true,
                        paidAt: updatedOrder.paidAt,
                        paymentResult: updatedOrder.paymentResult
                    });
                    // --- END Socket.IO ---

                    res.status(200).json({ message: 'Payment confirmed and order updated.', order: updatedOrder });
                } else {
                    console.error(`Paystack Webhook: Verification failed for reference ${reference}. Response:`, verificationResponse.data);
                    res.status(400).send(`Payment verification failed for reference ${reference}`);
                }
            } catch (verifyError) {
                console.error(`Error verifying Paystack transaction ${reference} via Axios:`, verifyError.message);
                if (verifyError.response) {
                    console.error('Axios error response data:', verifyError.response.data);
                    console.error('Axios error response status:', verifyError.response.status);
                }
                res.status(500).send('Error verifying payment with Paystack');
            }
        } else {
            console.warn(`Paystack Webhook: Order ${orderId} not found for reference ${reference}.`);
            res.status(404).send('Order not found');
        }
    } else if (eventType === 'charge.failed') {
        console.warn(`Paystack Webhook: Payment failed for reference ${data.reference}. Reason: ${data.gateway_response}`);
        res.status(200).json({ message: 'Payment failed, but received webhook.' });
    } else {
        res.status(200).json({ message: `Webhook received for unhandled event type: ${eventType}` });
    }
});

export { initializePaystackPayment, handlePaystackWebhook };