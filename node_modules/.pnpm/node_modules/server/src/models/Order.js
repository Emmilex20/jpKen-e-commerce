// apps/server/src/models/Order.js
import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User model
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product', // Reference to the Product model
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },   // ⭐ NEW ⭐
      phoneNumber: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      // This object will store details from any payment gateway (PayPal, Paystack, etc.)
      id: { type: String },          // Transaction ID from gateway
      status: { type: String },       // Status from gateway (e.g., 'success', 'failed')
      update_time: { type: String },  // Timestamp of update from gateway
      email_address: { type: String }, // Payer's email

      // --- NEW FIELDS FOR PAYSTACK INTEGRATION ---
      channel: { type: String },   // e.g., 'card', 'bank_transfer', 'ussd'
      currency: { type: String },  // e.g., 'NGN'
      amount: { type: Number },    // Amount paid (in your currency unit, not Kobo, as we convert it)
      reference: { type: String }, // Paystack transaction reference
      // --- END NEW FIELDS ---
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    isCanceled: {
      type: Boolean,
      required: true,
      default: false,
    },
    canceledAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// --- CRUCIAL CHANGE FOR OverwriteModelError ---
// Check if the 'Order' model has already been defined before creating it.
// This prevents the "Cannot overwrite `Order` model once compiled" error,
// especially with Nodemon's hot-reloading.
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;