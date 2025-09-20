const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('✅ Email service ready');
  }
});

// Email templates
const emailTemplates = {
  orderConfirmation: (order) => ({
    subject: `Order Confirmation - #${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">EliteShop</h1>
          <p style="color: white; margin: 10px 0 0 0;">Thank you for your order!</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Order Confirmation</h2>
          <p>Hi ${order.shippingName},</p>
          <p>We've received your order and it's being processed. Here are the details:</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order #${order.orderNumber}</h3>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
            <p><strong>Payment Status:</strong> ${order.paymentStatus.toUpperCase()}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Items</h3>
            ${order.items.map(item => `
              <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <p style="margin: 0;"><strong>${item.productName}</strong></p>
                <p style="margin: 5px 0; color: #666;">Quantity: ${item.quantity} × $${item.productPrice}</p>
                <p style="margin: 0; text-align: right;"><strong>$${item.totalPrice}</strong></p>
              </div>
            `).join('')}
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #333;">
              <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span>Subtotal:</span>
                <span>$${order.subtotal}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span>Tax:</span>
                <span>$${order.taxAmount}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span>Shipping:</span>
                <span>$${order.shippingAmount}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 15px 0 0 0; font-size: 18px; font-weight: bold;">
                <span>Total:</span>
                <span>$${order.totalAmount}</span>
              </div>
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Shipping Address</h3>
            <p style="margin: 0;">
              ${order.shippingName}<br>
              ${order.shippingAddressLine1}<br>
              ${order.shippingAddressLine2 ? order.shippingAddressLine2 + '<br>' : ''}
              ${order.shippingCity}, ${order.shippingState} ${order.shippingPostalCode}<br>
              ${order.shippingCountry}
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/orders/${order.id}" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Track Your Order
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            If you have any questions about your order, please contact us at support@eliteshop.com
          </p>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0;">&copy; 2024 EliteShop. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  orderStatusUpdate: (order, newStatus) => ({
    subject: `Order Update - #${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">EliteShop</h1>
          <p style="color: white; margin: 10px 0 0 0;">Order Status Update</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Your Order Has Been Updated</h2>
          <p>Hi ${order.shippingName},</p>
          <p>Your order #${order.orderNumber} status has been updated to: <strong>${newStatus.toUpperCase()}</strong></p>
          
          ${order.trackingNumber ? `
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Tracking Information</h3>
              <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/orders/${order.id}" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Track Your Order
            </a>
          </div>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0;">&copy; 2024 EliteShop. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  passwordReset: (user, resetToken) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">EliteShop</h1>
          <p style="color: white; margin: 10px 0 0 0;">Password Reset</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
          <p>Hi ${user.name},</p>
          <p>You requested to reset your password. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            If you didn't request this password reset, please ignore this email. The link will expire in 1 hour.
          </p>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0;">&copy; 2024 EliteShop. All rights reserved.</p>
        </div>
      </div>
    `
  })
};

// Email service functions
const emailService = {
  async sendOrderConfirmation(order) {
    try {
      const template = emailTemplates.orderConfirmation(order);
      
      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: order.shippingEmail,
        subject: template.subject,
        html: template.html
      });
      
      console.log(`Order confirmation email sent to ${order.shippingEmail}`);
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      throw error;
    }
  },

  async sendOrderStatusUpdate(order, newStatus) {
    try {
      const template = emailTemplates.orderStatusUpdate(order, newStatus);
      
      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: order.shippingEmail,
        subject: template.subject,
        html: template.html
      });
      
      console.log(`Order status update email sent to ${order.shippingEmail}`);
    } catch (error) {
      console.error('Error sending order status update email:', error);
      throw error;
    }
  },

  async sendPasswordReset(user, resetToken) {
    try {
      const template = emailTemplates.passwordReset(user, resetToken);
      
      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: user.email,
        subject: template.subject,
        html: template.html
      });
      
      console.log(`Password reset email sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  },

  async sendWelcomeEmail(user) {
    try {
      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: user.email,
        subject: 'Welcome to BijouShop!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Welcome to EliteShop!</h1>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #333; margin-bottom: 20px;">Hi ${user.name}!</h2>
              <p>Thank you for joining EliteShop. We're excited to have you as part of our community!</p>
              <p>Start exploring our premium collection of products and enjoy exclusive deals.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}" 
                   style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Start Shopping
                </a>
              </div>
            </div>
            
            <div style="background: #333; color: white; padding: 20px; text-align: center;">
              <p style="margin: 0;">&copy; 2024 EliteShop. All rights reserved.</p>
            </div>
          </div>
        `
      });
      
      console.log(`Welcome email sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }
};

module.exports = emailService;