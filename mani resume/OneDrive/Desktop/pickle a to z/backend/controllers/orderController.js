const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const crypto = require('crypto');
const { sendOrderConfirmationToUser, sendOrderNotificationToAdmin } = require('../services/emailService');

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
    .populate('user', 'name email phone')
    .populate('items.product')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

// Get a single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('items.product');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Error fetching order' });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      address,
      deliveryDate,
      deliveryTime,
      paymentId,
      orderId
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required and must not be empty' });
    }

    if (!totalAmount || typeof totalAmount !== 'number' || totalAmount <= 0) {
      return res.status(400).json({ error: 'Valid total amount is required' });
    }

    if (!address || !address.street || !address.city || !address.state || !address.pincode) {
      return res.status(400).json({ error: 'Complete address is required' });
    }

    if (!deliveryDate || !deliveryTime) {
      return res.status(400).json({ error: 'Delivery date and time are required' });
    }

    // Validate each item in the order
    for (const item of items) {
      if (!item.product || !item.quantity || !item.price) {
        return res.status(400).json({ error: 'Each item must have product, quantity, and price' });
      }

      // Verify product exists
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ error: `Product with ID ${item.product} not found` });
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }
    }

    // Generate OTP for delivery verification
    const otp = crypto.randomInt(100000, 999999).toString();

    // Create order
    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
      address,
      deliveryDate,
      deliveryTime,
      paymentId,
      orderId,
      otp,
      status: 'confirmed'
    });

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    await order.save();

    // Populate product details
    await order.populate('items.product');

    // Get user details
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send email notifications
    try {
      await Promise.all([
        sendOrderConfirmationToUser(user, order),
        sendOrderNotificationToAdmin(user, order)
      ]);
    } catch (emailError) {
      console.error('Error sending email notifications:', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order: ' + error.message });
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.product')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findOneAndUpdate(
      { _id: id, admin: req.user.id },
      { status },
      { new: true }
    ).populate('items.product');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Error updating order status' });
  }
};

// Verify delivery OTP
exports.verifyDeliveryOTP = async (req, res) => {
  try {
    const { orderId, otp } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Update order status to delivered
    order.status = 'delivered';
    await order.save();

    res.json({ message: 'Delivery verified successfully' });
  } catch (error) {
    console.error('Error verifying delivery OTP:', error);
    res.status(500).json({ error: 'Error verifying delivery OTP' });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,
      user: req.user.id
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ error: 'Order cannot be cancelled' });
    }

    // Update order status
    order.status = 'cancelled';
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Error cancelling order' });
  }
};

// Get order statistics (for admin)
exports.getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      {
        $match: { status: { $ne: 'cancelled' } }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({
      stats,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({ error: 'Error fetching order statistics' });
  }
}; 