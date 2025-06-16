// apps/server/src/controllers/orderController.js
import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js'; // To update stock

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id, // Map _id from frontend item to product for backend model
        _id: undefined, // Remove _id to avoid Mongoose _id conflict on save
      })),
      user: req.user._id, // Comes from protect middleware
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Update product stock (optional, but good practice)
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock -= item.qty;
        await product.save();
      }
    }

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  ); // Populate user info

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    // Payment result from PayPal, etc.
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid manually (for Cash/Bank Transfer - NEW!)
// @route   PUT /api/orders/:id/pay-manually
// @access  Private/Admin
const updateOrderToPaidManually = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    // Set a generic payment result for manual payment
    order.paymentResult = {
      id: 'MANUAL_PAYMENT', // A clear identifier for manual payments
      status: 'Completed',
      update_time: new Date().toISOString(), // Current timestamp in ISO format
      email_address: req.user.email, // Admin's email who confirmed payment
      confirmedBy: req.user.name, // Admin's name
      paymentMethod: order.paymentMethod, // Keep original payment method
    };

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});


// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
   console.log('--- getMyOrders controller hit ---');
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  console.log('--- getOrders controller hit ---');
  const orders = await Order.find({}).populate('user', 'id name');
   res.status(200).json(orders);
});

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private (User or Admin)
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    // --- Authorization Check ---
    // A user can only cancel their own order. Admin can cancel any order.
    if (req.user.isAdmin) {
      // Admin is allowed to cancel any order
    } else if (order.user._id.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to cancel this order');
    }

    // --- Status Check: Only cancel if not paid, delivered, or already canceled ---
    if (order.isPaid) {
      res.status(400);
      throw new Error('Cannot cancel an order that has already been paid.');
    }
    if (order.isDelivered) {
      res.status(400);
      throw new Error('Cannot cancel an order that has already been delivered.');
    }
    if (order.isCanceled) {
      res.status(400);
      throw new Error('Order is already canceled.');
    }

    // --- Update Order Status ---
    order.isCanceled = true;
    order.canceledAt = Date.now();

    // --- Return Items to Stock ---
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock += item.qty;
        await product.save();
      } else {
        console.warn(`Product with ID ${item.product} not found for stock update during cancellation.`);
      }
    }

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);

  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateOrderToPaidManually,
  cancelOrder,
};