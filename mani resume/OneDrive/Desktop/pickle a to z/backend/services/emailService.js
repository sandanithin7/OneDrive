const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send order confirmation email to user
const sendOrderConfirmationToUser = async (user, order) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@yourdomain.com',
      to: user.email,
      subject: 'Order Confirmation',
      html: `
        <h1>Order Confirmation</h1>
        <p>Dear ${user.name},</p>
        <p>Thank you for your order. Your order has been confirmed.</p>
        <h2>Order Details:</h2>
        <p>Order ID: ${order._id}</p>
        <p>Total Amount: ₹${order.totalAmount}</p>
        <p>Delivery Address: ${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}</p>
        <p>Delivery Date: ${new Date(order.deliveryDate).toLocaleDateString()}</p>
        <p>Delivery Time: ${order.deliveryTime}</p>
        <p>Delivery OTP: ${order.otp}</p>
        <p>Please keep this OTP handy for delivery verification.</p>
        <p>Thank you for choosing our service!</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent to user');
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

// Send order notification to admin
const sendOrderNotificationToAdmin = async (user, order) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@yourdomain.com',
      to: process.env.ADMIN_EMAIL,
      subject: 'New Order Notification',
      html: `
        <h1>New Order Received</h1>
        <p>A new order has been placed by ${user.name} (${user.email}).</p>
        <h2>Order Details:</h2>
        <p>Order ID: ${order._id}</p>
        <p>Total Amount: ₹${order.totalAmount}</p>
        <p>Delivery Address: ${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}</p>
        <p>Delivery Date: ${new Date(order.deliveryDate).toLocaleDateString()}</p>
        <p>Delivery Time: ${order.deliveryTime}</p>
        <p>Please process this order as soon as possible.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Order notification email sent to admin');
  } catch (error) {
    console.error('Error sending order notification email:', error);
    throw error;
  }
};

module.exports = {
  sendOrderConfirmationToUser,
  sendOrderNotificationToAdmin
}; 