const nodemailer = require('nodemailer');

/**
 * Email Service
 * Handles sending verification emails with OTP codes
 */

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

/**
 * Send verification email with OTP code
 * @param {string} email - Recipient email
 * @param {string} code - OTP verification code
 * @param {string} name - User name
 */
exports.sendVerificationEmail = async (email, code, name) => {
  try {
    // Development Mode: Log code to console instead of sending email
    if (process.env.NODE_ENV === 'development' && 
        (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'YOUR_EMAIL@gmail.com')) {
      console.log('\n' + '='.repeat(60));
      console.log('📧 EMAIL VERIFICATION CODE (Development Mode)');
      console.log('='.repeat(60));
      console.log(`👤 User: ${name} (${email})`);
      console.log(`🔐 Verification Code: ${code}`);
      console.log(`⏰ Expires in: 10 minutes`);
      console.log('='.repeat(60) + '\n');
      
      return { success: true, devMode: true };
    }

    // Production Mode: Send actual email
    const transporter = createTransporter();

    const mailOptions = {
      from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your TaskFlow Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px;">TaskFlow</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Premium Project Management</p>
          </div>
          
          <div style="background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Verify Your Email</h2>
            <p style="color: #6b7280; font-size: 16px;">Hi ${name},</p>
            <p style="color: #6b7280; font-size: 16px;">Thank you for signing up! Please use the verification code below to activate your account:</p>
            
            <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
              <p style="color: #9ca3af; font-size: 14px; margin: 0 0 10px 0;">Your verification code:</p>
              <p style="color: #8b5cf6; font-size: 48px; font-weight: bold; margin: 0; letter-spacing: 8px;">${code}</p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">This code will expire in <strong>10 minutes</strong>.</p>
            <p style="color: #6b7280; font-size: 14px;">If you didn't create a TaskFlow account, please ignore this email.</p>
            
            <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 TaskFlow. All rights reserved.</p>
            </div>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent:', email);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Generate 6-digit OTP code
 */
exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
