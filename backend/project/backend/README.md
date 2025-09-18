# 🛒 BijouShop Backend API

A complete, production-ready e-commerce backend built with Node.js, Express, and PostgreSQL. Features comprehensive authentication, payment processing, admin panel, and real-time notifications.

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (user, admin, super_admin)
- Password hashing with bcrypt
- Account activation and password reset

### 🛍️ E-commerce Core
- Complete product catalog with categories
- Shopping cart management
- Order processing and tracking
- Inventory management
- Review and rating system

### 💳 Payment Processing
- Stripe integration for card payments
- M-Pesa integration for mobile payments
- Webhook handling for payment confirmations
- Refund processing

### 👨‍💼 Admin Panel
- Comprehensive dashboard with analytics
- Product and category management
- Order management and status updates
- Customer management
- Inventory tracking and alerts

### 📧 Communication
- Email notifications (order confirmations, status updates)
- Real-time notifications with Socket.io
- Welcome emails and password reset

### 📊 Analytics & Reporting
- Sales analytics and trends
- Product performance metrics
- Customer insights and segmentation
- Inventory status reports

### 🔒 Security
- Input validation and sanitization
- Rate limiting
- CORS configuration
- SQL injection prevention
- XSS protection

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── errorHandler.js      # Global error handling
│   └── validation.js        # Input validation rules
├── models/
│   ├── index.js             # Model associations
│   ├── User.js              # User model
│   ├── Category.js          # Category model
│   ├── Product.js           # Product model
│   ├── Cart.js              # Shopping cart model
│   ├── Order.js             # Order model
│   ├── OrderItem.js         # Order items model
│   ├── Review.js            # Product reviews model
│   └── Coupon.js            # Discount coupons model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── products.js          # Product management routes
│   ├── cart.js              # Shopping cart routes
│   ├── orders.js            # Order management routes
│   ├── payments.js          # Payment processing routes
│   ├── admin.js             # Admin panel routes
│   ├── upload.js            # File upload routes
│   └── analytics.js         # Analytics and reporting routes
├── services/
│   └── emailService.js      # Email service with templates
├── scripts/
│   ├── migrate.js           # Database migration script
│   └── seed.js              # Database seeding script
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
├── server.js                # Main server file
└── README.md                # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Cloudinary account (for image storage)
- Stripe account (for payments)
- SMTP email service

### 1. Clone and Install
```bash
git clone <repository-url>
cd backend
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/bijoushop

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret

# Payments
STRIPE_SECRET_KEY=sk_test_your_stripe_key
MPESA_CONSUMER_KEY=your_mpesa_key

# File Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 3. Database Setup
```bash
# Run migrations
npm run migrate

# Seed with sample data
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## 📚 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register        # Register new user
POST   /api/auth/login           # User login
POST   /api/auth/refresh         # Refresh JWT token
POST   /api/auth/logout          # User logout
GET    /api/auth/profile         # Get user profile
PUT    /api/auth/profile         # Update user profile
PUT    /api/auth/change-password # Change password
```

### Product Endpoints
```
GET    /api/products             # Get all products (with filters)
GET    /api/products/featured    # Get featured products
GET    /api/products/:id         # Get single product
POST   /api/products             # (Admin) Create product
PUT    /api/products/:id         # (Admin) Update product
DELETE /api/products/:id         # (Admin) Delete product
GET    /api/products/:id/related # Get related products
```

### Cart Endpoints
```
GET    /api/cart                 # Get user's cart
POST   /api/cart/add             # Add product to cart
PUT    /api/cart/:id             # Update cart item
DELETE /api/cart/:id             # Remove cart item
DELETE /api/cart/clear           # Clear entire cart
GET    /api/cart/count           # Get cart item count
```

### Order Endpoints
```
POST   /api/orders               # Create new order
GET    /api/orders               # Get user's orders
GET    /api/orders/:id           # Get single order
PUT    /api/orders/:id/cancel    # Cancel order
GET    /api/orders/:id/track     # Track order status
```

### Payment Endpoints
```
POST   /api/payments/stripe/create-intent  # Create Stripe payment
POST   /api/payments/stripe/confirm        # Confirm Stripe payment
POST   /api/payments/mpesa/stk-push        # M-Pesa STK push
POST   /api/payments/mpesa/callback        # M-Pesa callback
GET    /api/payments/:orderId/status       # Get payment status
```

### Admin Endpoints
```
GET    /api/admin/dashboard       # Dashboard overview
GET    /api/admin/orders          # Get all orders
PUT    /api/admin/orders/:id/status        # Update order status
PUT    /api/admin/orders/:id/tracking      # Update tracking info
GET    /api/admin/customers       # Get all customers
PUT    /api/admin/customers/:id/status     # Update customer status
GET    /api/admin/analytics/sales          # Sales analytics
GET    /api/admin/analytics/products       # Product analytics
```

### Upload Endpoints
```
POST   /api/upload/image          # Upload single image
POST   /api/upload/images         # Upload multiple images
DELETE /api/upload/:publicId      # Delete image
POST   /api/upload/avatar         # Upload user avatar
```

## 🔧 Configuration

### Database Models

#### User Model
- Authentication and profile management
- Role-based access control
- Password hashing and validation

#### Product Model
- Complete product information
- Category relationships
- Inventory tracking
- SEO optimization fields

#### Order Model
- Comprehensive order management
- Payment and shipping information
- Status tracking and history

### Middleware

#### Authentication Middleware
- JWT token validation
- Role-based access control
- User session management

#### Validation Middleware
- Input validation with express-validator
- Sanitization and error handling
- Custom validation rules

#### Error Handling
- Global error handling
- Structured error responses
- Development vs production error details

### Services

#### Email Service
- Transactional email templates
- Order confirmations and updates
- Password reset and welcome emails
- SMTP configuration

## 🚀 Deployment

### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
PORT=3001
DATABASE_URL=your_production_database_url
JWT_SECRET=your_production_jwt_secret
```

### Railway Deployment
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main branch

### Render Deployment
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

### Database Migration
```bash
# Production migration
NODE_ENV=production npm run migrate
```

## 📊 Monitoring & Analytics

### Health Check
```
GET /health
```
Returns server status and uptime information.

### Real-time Features
- Socket.io for real-time notifications
- Admin dashboard live updates
- Order status notifications

### Analytics Endpoints
- Sales trends and performance
- Product analytics and insights
- Customer behavior analysis
- Inventory status monitoring

## 🔒 Security Features

### Authentication Security
- JWT with short expiration times
- Refresh token rotation
- Password strength requirements
- Account lockout protection

### API Security
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Input validation and sanitization
- SQL injection prevention
- XSS protection headers

### Data Protection
- Password hashing with bcrypt
- Sensitive data encryption
- Secure file upload handling
- Environment variable protection

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Test Coverage
- Unit tests for models and services
- Integration tests for API endpoints
- Authentication and authorization tests
- Payment processing tests

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if applicable)
  ]
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 100,
      "itemsPerPage": 10
    }
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with proper testing
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@eliteshop.com
- Documentation: API documentation available at `/api-docs` when server is running
- Issues: GitHub Issues for bug reports and feature requests

---

**Built with ❤️ for modern e-commerce solutions**