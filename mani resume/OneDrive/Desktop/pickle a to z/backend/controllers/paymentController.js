const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const User = require('../models/User');
const emailService = require('../services/emailService');
const { sendOrderNotificationToAdmin } = require('../services/emailService');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
};

// Verify payment and create order
exports.verifyPayment = async (req, res) => {
  try {
    console.log("request body", req.body);
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = req.body;
    console.log("plog 111111111111")

    // First verify the payment with Razorpay
    try {
      const payment = await razorpay.payments.fetch(razorpay_payment_id);
      console.log("plog 22222222222222222")
      
      if (payment.status !== 'captured') {
        return res.status(400).json({ 
          error: 'Payment not captured',
          details: payment
        });
      }
      console.log("plog 333333333333333333")

      // Verify signature
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');
        console.log("plog 44444444444444444444")

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ 
          error: 'Invalid signature',
          details: {
            expected: expectedSignature,
            received: razorpay_signature
          }
        });
      }
      console.log("plog 555555555555555555555")

      // Generate OTP for delivery verification
      const otp = crypto.randomInt(100000, 999999).toString();

      // Create order in database
      const order = new Order({
        user: req.user.id,
        items: orderData.items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: orderData.totalAmount,
        address: orderData.address,
        deliveryDate: orderData.deliveryDate,
        deliveryTime: orderData.deliveryTime,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        otp,
        status: 'confirmed'
      });

      await order.save();
      console.log('plog 6666666666666666')

      // Populate product details
      await order.populate('items.product');

       console.log("plog 77777777777777777")
      // Get user details
      const user = await User.findById(req.user.id);


      // Send email notifications
      try {
        console.log("before sending mail in paymentController")
        await Promise.all([
          emailService.sendOrderConfirmationToUser(user, order),
          // emailService.sendOrderNotificationToAdmin(user, order)
          sendOrderNotificationToAdmin(user, order)
        ]);
      } catch (emailError) {
        console.error('Error sending emails:', emailError);
        // Don't fail the order if email fails
      }

      res.json({
        success: true,
        order
      });
    } catch (razorpayError) {
      console.error('Razorpay verification error:', razorpayError);
      return res.status(400).json({ 
        error: 'Payment verification failed',
        details: razorpayError.message
      });
    }
  } catch (error) {
    console.error('Error in verify payment:', error);
    res.status(500).json({ 
      error: 'Error verifying payment',
      details: error.message 
    });
  }
}; 