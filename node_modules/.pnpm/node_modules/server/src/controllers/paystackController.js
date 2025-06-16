// apps/backend/controllers/paystackController.js
import asyncHandler from '../middleware/asyncHandler.js';
import Paystack from 'paystack-api';
import Order from '../models/Order.js';
import crypto from 'crypto';
import axios from 'axios';
import { io } from '../server.js'; // Ensure correct path if your server.js isn't directly above

// Initialize Paystack with your secret key from environment variables
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

// @desc    Initialize a Paystack transaction
// @route   POST /api/orders/:id/paystack/initialize
// @access  Private
const initializePaystackPayment = asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const { amount, email } = req.body; // Amount should be in kobo/cents from frontend

    if (!orderId) {
        res.status(400);
        throw new Error('Order ID is required as a URL parameter.');
    }
    if (typeof amount !== 'number' || amount <= 0) { // Ensure amount is a number and positive
        res.status(400);
        throw new Error('Amount is required and must be a positive number in Kobo/cents.');
    }
    if (!email) {
        res.status(400);
        throw new Error('Email is required.');
    }

    const order = await Order.findById(orderId);

    if (!order) {
        res.status(404);
        throw new Error('Order not found.');
    }

    // IMPORTANT: Verify that the amount passed from the frontend matches the actual order total
    // It's safer to use the backend's calculated total price for the transaction amount.
    const expectedAmountInKobo = Math.round(order.totalPrice * 100);

    // If you send 'amount' from frontend, ensure it matches the actual order price.
    // However, it's more secure to *always* use the `order.totalPrice` for the Paystack amount,
    // and just use the `email` from the request body or `order.user.email`.
    if (amount !== expectedAmountInKobo) {
        res.status(400);
        throw new Error(`Amount mismatch. Expected ${expectedAmountInKobo} Kobo, received ${amount} Kobo.`);
    }

    if (order.isPaid) {
        res.status(400);
        throw new Error('Order has already been paid.');
    }
    if (order.isCanceled) { // Also check for cancelled orders
        res.status(400);
        throw new Error('Cannot initialize payment for a cancelled order.');
    }


    try {
        const response = await paystack.transaction.initialize({
            amount: expectedAmountInKobo, // Use backend's authoritative amount
            email: email, // Use email from req.body (could be more reliable than order.user.email if guest checkout is allowed)
            reference: order._id.toString(), // Use order ID as the reference for easy lookup
            // Use CORS_ORIGIN for frontend URL consistency
            callback_url: `${process.env.CORS_ORIGIN}/order/${orderId}`, // <-- USING CORS_ORIGIN
            metadata: {
                order_id: orderId, // Pass order_id in metadata for webhook verification
                user_id: order.user.toString(), // Also pass user_id if helpful
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
        if (error.response) {
            console.error('Raw Paystack API Error Details (from error.response):', error.response.data);
            console.error('Paystack API HTTP Status:', error.response.status);
        }
        res.status(error.response?.status || 500); // Use Paystack's status if available
        throw new Error(error.response?.data?.message || 'Paystack initialization failed due to server error. Please try again.');
    }
});

// @desc    Handle Paystack webhooks (for verification)
// @route   POST /api/orders/paystack/webhook
// @access  Public (Paystack calls this)
const handlePaystackWebhook = asyncHandler(async (req, res) => {
    // It's crucial to verify the webhook signature for security
    const secret = process.env.PAYSTACK_SECRET_KEY; // Using PAYSTACK_SECRET_KEY as webhook secret
    // It's more secure to use a separate PAYSTACK_WEBHOOK_SECRET for webhook verification
    // if Paystack supports it, to prevent using your main secret key for hashing.
    // If you configured a separate webhook secret in Paystack dashboard, use that here.

    // IMPORTANT: Use req.rawBody if you configured express.json to pass it
    const hash = crypto.createHmac('sha512', secret)
        .update(req.rawBody || JSON.stringify(req.body)) // Fallback to JSON.stringify if rawBody is not set
        .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
        console.warn('Paystack Webhook: Invalid signature.');
        return res.status(400).send('Invalid signature');
    }

    const event = req.body;
    const eventType = event.event;
    const data = event.data;

    // Log the event type for debugging
    console.log(`Paystack Webhook received event: ${eventType}`);

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
                console.log(`Order ${orderId} already paid.`);
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
                    const verifiedData = verificationResponse.data.data;

                    // Additional check: Ensure amount matches (round both for robust comparison)
                    const paidAmountInKobo = Math.round(verifiedData.amount);
                    const orderTotalPriceInKobo = Math.round(order.totalPrice * 100);

                    if (paidAmountInKobo !== orderTotalPriceInKobo) {
                        console.warn(`Paystack Webhook: Amount mismatch for order ${orderId}. Expected ${orderTotalPriceInKobo}, received ${paidAmountInKobo}`);
                        // You might still update the order but mark it for review, or reject the webhook
                        return res.status(400).send('Amount mismatch after verification.');
                    }

                    order.isPaid = true;
                    order.paidAt = new Date(verifiedData.paid_at || Date.now());
                    order.paymentResult = {
                        id: verifiedData.id,
                        status: verifiedData.status,
                        update_time: verifiedData.paid_at,
                        email_address: verifiedData.customer.email,
                        reference: verifiedData.reference, // Store Paystack reference
                        channel: verifiedData.channel,
                        currency: verifiedData.currency,
                        amount: verifiedData.amount / 100, // Convert Kobo back to original currency unit for storage
                    };

                    const updatedOrder = await order.save();
                    console.log(`Order ${orderId} marked as paid successfully.`);

                    // --- Socket.IO: Emit payment success event ---
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
        // You might want to update the order status to 'payment failed' or notify the user
        // You could also emit a Socket.IO event for failed payments
        res.status(200).json({ message: 'Payment failed, but webhook received.' });
    } else {
        console.log(`Paystack Webhook: Received event type: ${eventType}, not specifically handled.`);
        res.status(200).json({ message: `Webhook received for unhandled event type: ${eventType}` });
    }
});

export { initializePaystackPayment, handlePaystackWebhook };