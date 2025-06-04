// const nodemailer = require('nodemailer');

// // Generate a 6-digit OTP
// exports.generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// // Send OTP via email
// exports.sendOTP = async (email, otp) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT,
//       secure: process.env.SMTP_SECURE === 'true',
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS
//       }
//     });

//     const mailOptions = {
//       from: process.env.SMTP_FROM,
//       to: email,
//       subject: 'Password Reset OTP',
//       html: `
//         <h1>Password Reset OTP</h1>
//         <p>Your OTP for password reset is: <strong>${otp}</strong></p>
//         <p>This OTP will expire in 1 hour.</p>
//         <p>If you didn't request this, please ignore this email.</p>
//       `
//     };

//     await transporter.sendMail(mailOptions);
//     return true;
//   } catch (error) {
//     console.error('Error sending OTP:', error);
//     throw error;
//   }
// }; 