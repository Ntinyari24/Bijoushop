# 🛒 Backend Specification for EliteShop E-commerce Platform

**Goal**: Build a **scalable, production-ready backend** for the EliteShop e-commerce application with full **database integration, authentication, payments (Stripe + M-Pesa), and comprehensive admin panel APIs**.

---

## 1. Tech Stack

### Core Technologies
* **Backend Framework**: Node.js with Express.js / Django REST Framework
* **Database**: PostgreSQL (primary) with Redis for caching
* **Authentication**: JWT (JSON Web Tokens) with bcrypt for password hashing
* **Payments**: Stripe API + M-Pesa Daraja API integration
* **Storage**: Cloudinary for product images and media
* **Email Service**: SendGrid for transactional emails
* **Real-time**: Socket.io for order notifications
* **Documentation**: Swagger/OpenAPI for API documentation

### Development Tools
* **Validation**: Joi/Yup for request validation
* **Logging**: Winston for structured logging
* **Testing**: Jest for unit/integration tests
* **Monitoring**: New Relic/DataDog for performance monitoring
* **Security**: Helmet.js, rate limiting, CORS configuration

---

## 2. Database Schema Design

### 🧑‍💼 Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin', 'super_admin') DEFAULT 'user',
  phone VARCHAR(20),
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 🏷️ Categories Table
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 🛍️ Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  sku VARCHAR(100) UNIQUE,
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  category_id UUID REFERENCES categories(id),
  brand VARCHAR(100),
  weight DECIMAL(8,2),
  dimensions JSONB, -- {length, width, height}
  images JSONB, -- array of image URLs
  tags TEXT[],
  meta_title VARCHAR(255),
  meta_description TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  rating_average DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 🛒 Cart Table
```sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);
```

### 📦 Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  payment_method ENUM('stripe', 'mpesa', 'cash_on_delivery') NOT NULL,
  payment_id VARCHAR(255), -- Stripe/M-Pesa transaction ID
  
  -- Pricing
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- Shipping Address
  shipping_name VARCHAR(255) NOT NULL,
  shipping_email VARCHAR(255),
  shipping_phone VARCHAR(20),
  shipping_address_line1 VARCHAR(255) NOT NULL,
  shipping_address_line2 VARCHAR(255),
  shipping_city VARCHAR(100) NOT NULL,
  shipping_state VARCHAR(100),
  shipping_postal_code VARCHAR(20),
  shipping_country VARCHAR(100) NOT NULL,
  
  -- Billing Address (can be same as shipping)
  billing_name VARCHAR(255),
  billing_address_line1 VARCHAR(255),
  billing_city VARCHAR(100),
  billing_postal_code VARCHAR(20),
  billing_country VARCHAR(100),
  
  notes TEXT,
  tracking_number VARCHAR(100),
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 📋 Order Items Table
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL, -- snapshot at time of order
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### ⭐ Reviews Table
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_verified BOOLEAN DEFAULT false, -- verified purchase
  is_approved BOOLEAN DEFAULT true,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id, order_id)
);
```

### 🎫 Coupons Table
```sql
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  type ENUM('percentage', 'fixed_amount') NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  minimum_amount DECIMAL(10,2),
  maximum_discount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP NOT NULL,
  valid_until TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. API Endpoints Specification

### 🔑 Authentication & Users
```
POST   /api/auth/register           → Register new user
POST   /api/auth/login              → Login and return JWT
POST   /api/auth/logout             → Logout (blacklist token)
POST   /api/auth/refresh            → Refresh JWT token
POST   /api/auth/forgot-password    → Send password reset email
POST   /api/auth/reset-password     → Reset password with token
POST   /api/auth/verify-email       → Verify email address
GET    /api/auth/profile            → Get logged-in user profile
PUT    /api/auth/profile            → Update user profile
PUT    /api/auth/change-password    → Change password
DELETE /api/auth/account            → Delete user account
```

### 🏷️ Categories
```
GET    /api/categories              → Get all categories (public)
GET    /api/categories/:id          → Get single category
POST   /api/categories              → (admin) Create category
PUT    /api/categories/:id          → (admin) Update category
DELETE /api/categories/:id          → (admin) Delete category
```

### 🛍️ Products
```
GET    /api/products                → Get all products (with filters, pagination)
GET    /api/products/featured       → Get featured products
GET    /api/products/search         → Search products
GET    /api/products/:id            → Get single product
POST   /api/products                → (admin) Create product
PUT    /api/products/:id            → (admin) Update product
DELETE /api/products/:id            → (admin) Delete product
POST   /api/products/:id/images     → (admin) Upload product images
DELETE /api/products/:id/images/:imageId → (admin) Delete product image
```

### 🛒 Shopping Cart
```
GET    /api/cart                    → Get user's cart
POST   /api/cart/add                → Add product to cart
PUT    /api/cart/update             → Update cart item quantity
DELETE /api/cart/remove/:productId  → Remove item from cart
DELETE /api/cart/clear              → Clear entire cart
```

### 📦 Orders
```
GET    /api/orders                  → Get user's orders
GET    /api/orders/:id              → Get single order details
POST   /api/orders                  → Create new order
PUT    /api/orders/:id/cancel       → Cancel order
GET    /api/orders/:id/track        → Track order status

// Admin routes
GET    /api/admin/orders            → Get all orders (admin)
PUT    /api/admin/orders/:id/status → Update order status
PUT    /api/admin/orders/:id/tracking → Update tracking info
```

### 💳 Payments
```
POST   /api/payments/stripe/create-intent    → Create Stripe payment intent
POST   /api/payments/stripe/confirm          → Confirm Stripe payment
POST   /api/payments/mpesa/stk-push          → Initiate M-Pesa STK push
POST   /api/payments/mpesa/callback          → M-Pesa callback handler
GET    /api/payments/:orderId/status         → Get payment status
POST   /api/payments/:orderId/refund         → (admin) Process refund
```

### ⭐ Reviews
```
GET    /api/products/:id/reviews    → Get product reviews
POST   /api/products/:id/reviews    → Add product review
PUT    /api/reviews/:id             → Update review
DELETE /api/reviews/:id             → Delete review
POST   /api/reviews/:id/helpful     → Mark review as helpful
```

### 🎫 Coupons
```
POST   /api/coupons/validate        → Validate coupon code
GET    /api/admin/coupons           → (admin) Get all coupons
POST   /api/admin/coupons           → (admin) Create coupon
PUT    /api/admin/coupons/:id       → (admin) Update coupon
DELETE /api/admin/coupons/:id       → (admin) Delete coupon
```

### 🖼️ File Upload
```
POST   /api/upload/image            → Upload single image
POST   /api/upload/images           → Upload multiple images
DELETE /api/upload/:publicId        → Delete uploaded image
```

### 📊 Analytics (Admin)
```
GET    /api/admin/analytics/dashboard    → Dashboard overview stats
GET    /api/admin/analytics/sales        → Sales analytics
GET    /api/admin/analytics/products     → Product performance
GET    /api/admin/analytics/customers    → Customer analytics
GET    /api/admin/analytics/orders       → Order trends
```

---

## 4. Admin Panel API Features

### 🔐 Admin Authentication & Authorization
- Role-based access control (admin, super_admin)
- Admin-specific JWT tokens with elevated permissions
- Audit logging for all admin actions

### 📊 Dashboard APIs
```javascript
// Dashboard Overview
GET /api/admin/dashboard
Response: {
  totalOrders: number,
  totalRevenue: number,
  totalCustomers: number,
  totalProducts: number,
  recentOrders: Order[],
  topProducts: Product[],
  salesChart: ChartData,
  orderStatusBreakdown: StatusCount[]
}
```

### 🛍️ Product Management
- Full CRUD operations for products
- Bulk product import/export (CSV)
- Inventory management with low stock alerts
- Product image management with Cloudinary integration
- SEO optimization fields (meta title, description, slug)

### 📦 Order Management
- Order status workflow management
- Bulk order processing
- Shipping label generation
- Order notes and internal comments
- Refund processing

### 👥 Customer Management
```javascript
GET /api/admin/customers
PUT /api/admin/customers/:id/status  // activate/deactivate
GET /api/admin/customers/:id/orders  // customer order history
```

### 📈 Reports & Analytics
- Sales reports (daily, weekly, monthly, yearly)
- Product performance reports
- Customer behavior analytics
- Inventory reports
- Financial reports with tax calculations

---

## 5. Payment Integration Details

### 💳 Stripe Integration
```javascript
// Create Payment Intent
POST /api/payments/stripe/create-intent
Body: {
  orderId: string,
  amount: number,
  currency: 'usd',
  paymentMethodTypes: ['card']
}

// Webhook Handler
POST /api/payments/stripe/webhook
// Handle payment_intent.succeeded, payment_intent.payment_failed
```

### 📱 M-Pesa Integration (Kenya)
```javascript
// STK Push
POST /api/payments/mpesa/stk-push
Body: {
  orderId: string,
  phoneNumber: string,
  amount: number
}

// Callback Handler
POST /api/payments/mpesa/callback
// Handle M-Pesa transaction status updates
```

---

## 6. Security Implementation

### 🔒 Authentication Security
- JWT tokens with short expiration (15 minutes) + refresh tokens
- Password hashing with bcrypt (12 rounds minimum)
- Account lockout after failed login attempts
- Email verification for new accounts
- Two-factor authentication (optional)

### 🛡️ API Security
- Rate limiting (100 requests per 15 minutes per IP)
- CORS configuration for frontend domains
- Helmet.js for security headers
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- XSS protection

### 🔐 Data Protection
- Sensitive data encryption at rest
- PCI DSS compliance for payment data
- GDPR compliance features (data export, deletion)
- Audit logging for sensitive operations

---

## 7. Performance Optimization

### ⚡ Caching Strategy
- Redis for session storage and frequently accessed data
- Product catalog caching with TTL
- Database query optimization with indexes
- CDN integration for static assets

### 📊 Database Optimization
- Proper indexing on frequently queried columns
- Database connection pooling
- Query optimization and monitoring
- Read replicas for analytics queries

---

## 8. Notification System

### 📧 Email Notifications
- Order confirmation emails
- Shipping notifications
- Password reset emails
- Marketing newsletters (with unsubscribe)
- Admin alerts for low stock, new orders

### 🔔 Real-time Notifications
- WebSocket connections for real-time order updates
- Push notifications for mobile apps
- Admin dashboard real-time updates

---

## 9. Testing Strategy

### 🧪 Test Coverage
- Unit tests for business logic (80%+ coverage)
- Integration tests for API endpoints
- End-to-end tests for critical user flows
- Load testing for performance validation
- Security testing for vulnerabilities

### 🔄 CI/CD Pipeline
- Automated testing on pull requests
- Code quality checks with ESLint/Prettier
- Security scanning with Snyk
- Automated deployment to staging/production

---

## 10. Deployment & Infrastructure

### 🚀 Deployment Options
- **Primary**: Railway/Render for backend API
- **Database**: Supabase PostgreSQL or Railway PostgreSQL
- **Redis**: Railway Redis or Redis Cloud
- **File Storage**: Cloudinary for images
- **Email**: SendGrid for transactional emails

### 🌍 Environment Configuration
```bash
# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Authentication
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Payments
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_SHORTCODE=...
MPESA_PASSKEY=...

# File Storage
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Email
SENDGRID_API_KEY=...
FROM_EMAIL=noreply@eliteshop.com

# App Configuration
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-domain.com
ADMIN_URL=https://admin.your-domain.com
```

---

## 11. API Documentation

### 📚 Swagger/OpenAPI
- Complete API documentation with examples
- Interactive API testing interface
- Request/response schemas
- Authentication requirements
- Error code documentation

### 📖 Developer Resources
- Postman collection for API testing
- SDK/client libraries for common languages
- Webhook documentation
- Rate limiting guidelines

---

## 12. Monitoring & Logging

### 📊 Application Monitoring
- Performance monitoring with New Relic/DataDog
- Error tracking with Sentry
- Uptime monitoring
- Database performance monitoring

### 📝 Logging Strategy
- Structured logging with Winston
- Request/response logging
- Error logging with stack traces
- Audit logging for admin actions
- Log aggregation and analysis

---

## ✅ Deliverables

1. **Production-ready REST API** with all endpoints implemented
2. **Comprehensive database schema** with proper relationships and constraints
3. **Secure authentication system** with JWT and role-based access
4. **Payment processing** with Stripe and M-Pesa integration
5. **Admin panel APIs** for complete store management
6. **Real-time notifications** for order updates
7. **Complete API documentation** with Swagger
8. **Deployment configuration** for Railway/Render
9. **Testing suite** with unit and integration tests
10. **Monitoring and logging** setup for production

This backend will provide a robust, scalable foundation for the EliteShop e-commerce platform, capable of handling high traffic and complex business requirements while maintaining security and performance standards.