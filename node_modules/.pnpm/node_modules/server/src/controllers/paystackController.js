// apps/backend/controllers/paystackController.js
import asyncHandler from '../middleware/asyncHandler.js';
import Paystack from 'paystack-api';
import Order from '../models/Order.js';
import crypto from 'crypto';
import axios from 'axios';
import { io } from '../server.js';

// Initialize Paystack with your secret key from environment variables
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

// @desc    Initialize a Paystack transaction
// @route   POST /api/orders/:id/paystack/initialize
// @access  Private
const initializePaystackPayment = asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    // We expect email from req.user (authenticated user) or req.body if allowed
    // For amount, we will use the backend's authoritative order.totalPrice
    const { email: requestEmail } = req.body; // Email from frontend is optional, but useful as a fallback/check

    if (!orderId) {
        res.status(400);
        throw new Error('Order ID is required as a URL parameter.');
    }

    const order = await Order.findById(orderId).populate('user', 'email'); // Populate user email to ensure we have it

    if (!order) {
        res.status(404);
        throw new Error('Order not found.');
    }

    if (order.isPaid) {
        res.status(400);
        throw new Error('Order has already been paid.');
    }
    if (order.isCanceled) {
        res.status(400);
        throw new Error('Cannot initialize payment for a cancelled order.');
    }

    // Use the backend's calculated total price for the transaction amount.
    const expectedAmountInKobo = Math.round(order.totalPrice * 100);

    // Prefer user's email from authenticated session, fallback to request body if needed
    const customerEmail = order.user.email || requestEmail;
    if (!customerEmail) {
        res.status(400);
        throw new Error('Customer email is required for Paystack initialization.');
    }

    // ⭐ EXTRACTING NEW FIELDS FOR PAYSTACK ⭐
    const customerFullName = order.shippingAddress.fullName;
    const customerPhoneNumber = order.shippingAddress.phoneNumber;

    // Split full name into first and last for Paystack's fields (optional, but good practice)
    let firstName = '';
    let lastName = '';
    if (customerFullName) {
        const nameParts = customerFullName.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
    }

    try {
        const response = await paystack.transaction.initialize({
            amount: expectedAmountInKobo,
            email: customerEmail,
            reference: order._id.toString(), // Use order ID as the reference for easy lookup
            callback_url: `${process.env.CORS_ORIGIN}/order/${orderId}`,
            // ⭐ ADDING NEW FIELDS TO PAYSTACK INITIALIZATION ⭐
            first_name: firstName,
            last_name: lastName,
            phone: customerPhoneNumber,
            metadata: {
                order_id: orderId.toString(),
                user_id: order.user._id.toString(),
                customer_name: customerFullName,      // Also add to metadata for redundancy/flexibility
                customer_phone: customerPhoneNumber,  // Also add to metadata
                // You can add other useful order details here too, e.g., line items
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
        res.status(error.response?.status || 500);
        throw new Error(error.response?.data?.message || 'Paystack initialization failed due to server error. Please try again.');
    }
});

// @desc    Handle Paystack webhooks (for verification)
// @route   POST /api/orders/paystack/webhook
// @access  Public (Paystack calls this)
const handlePaystackWebhook = asyncHandler(async (req, res) => {
    // --- DEBUG LOGS ---
    console.log('--- Paystack Webhook Received ---');
    console.log('Raw Body (for hashing):', req.rawBody ? req.rawBody.substring(0, 200) + '...' : 'Raw body not found or empty');
    console.log('x-paystack-signature header:', req.headers['x-paystack-signature']);
    // --- END DEBUG LOGS ---

    const secret = process.env.PAYSTACK_SECRET_KEY;

    const hash = crypto.createHmac('sha512', secret)
        .update(req.rawBody)
        .digest('hex');

    // --- DEBUG LOGS ---
    console.log('Calculated hash:', hash);
    // --- END DEBUG LOGS ---

    if (hash !== req.headers['x-paystack-signature']) {
        console.warn('Paystack Webhook: Invalid signature.');
        return res.status(400).send('Invalid signature');
    }

    console.log('Webhook signature verification successful.');

    const event = req.body;
    const eventType = event.event;
    const data = event.data;

    console.log(`Paystack Webhook received event: ${eventType}`);
    console.log('Webhook event data (parsed):', JSON.stringify(event, null, 2));

    if (eventType === 'charge.success' && data.status === 'success') {
        const reference = data.reference;
        const orderId = data.metadata?.order_id;

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

                    const paidAmountInKobo = Math.round(verifiedData.amount);
                    const orderTotalPriceInKobo = Math.round(order.totalPrice * 100);

                    if (paidAmountInKobo !== orderTotalPriceInKobo) {
                        console.warn(`Paystack Webhook: Amount mismatch for order ${orderId}. Expected ${orderTotalPriceInKobo}, received ${paidAmountInKobo}`);
                        return res.status(400).send('Amount mismatch after verification.');
                    }

                    order.isPaid = true;
                    order.paidAt = new Date(verifiedData.paid_at || Date.now());
                    order.paymentResult = {
                        id: verifiedData.id,
                        status: verifiedData.status,
                        update_time: verifiedData.paid_at,
                        email_address: verifiedData.customer.email,
                        reference: verifiedData.reference,
                        channel: verifiedData.channel,
                        currency: verifiedData.currency,
                        amount: verifiedData.amount / 100,
                        // ⭐ Optionally add fullName and phoneNumber to paymentResult here if you want it logged there too ⭐
                        // customer_name: verifiedData.customer.first_name + ' ' + verifiedData.customer.last_name,
                        // customer_phone: verifiedData.customer.phone,
                    };

                    const updatedOrder = await order.save();
                    console.log(`Order ${orderId} marked as paid successfully.`);

                    io.to(orderId.toString()).emit('paymentSuccess', {
                        orderId: orderId.toString(),
                        isPaid: true,
                        paidAt: updatedOrder.paidAt,
                        paymentResult: updatedOrder.paymentResult
                    });

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
        res.status(200).json({ message: 'Payment failed, but webhook received.' });
    } else {
        console.log(`Paystack Webhook: Received event type: ${eventType}, not specifically handled.`);
        res.status(200).json({ message: `Webhook received for unhandled event type: ${eventType}` });
    }
});

export { initializePaystackPayment, handlePaystackWebhook };