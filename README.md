# 🛒 E-Commerce Store Backend API

A powerful and scalable e-commerce backend built with NestJS! 🚀 Features JWT authentication, advanced EAV product system, smart filtering, shopping cart, order management, coupons, gifts, transactions, and more. Perfect for modern online stores. 💼

## ✨ Features

### Core Features

- 👤 **User Management**: Registration, login, profiles, and role-based access
- 🔐 **JWT Authentication**: Secure token-based auth with Passport
- 📂 **Category Management**: Hierarchical categories for organizing products
- 🏷️ **Advanced Product System**: Flexible EAV (Entity-Attribute-Value) for dynamic attributes like color, size, etc.
- 🔍 **Smart Filtering & Search**: Filter by attributes, price, category, and full-text search
- 🛒 **Shopping Cart**: Add, update, and manage cart items
- 📦 **Order Management**: Create orders, handle shipments, email confirmations
- 🎁 **Gift System**: Manage gift products and options
- 🎫 **Coupon System**: Apply discounts with coupon codes
- 💳 **Transaction Handling**: Process payments and track transactions
- 🖼️ **Image Management**: Cloudinary integration for product images
- 📧 **Email Services**: Order confirmations via Mailer and Handlebars templates
- 🐰 **Message Queue**: RabbitMQ for async processing
- 💰 **Payment Integration**: Stripe for secure payments
- 📊 **Caching**: Redis support for performance
- 🛡️ **Rate Limiting**: Throttler for API protection

### EAV Product System

- 🔧 **Dynamic Attributes**: Create custom attributes without schema changes
- 📋 **Data Types**: Text, number, boolean, date, select, multiselect
- ✅ **Validation**: Built-in rules for attribute values
- 📁 **Category-Specific**: Attributes per category

## 🛠 Tech Stack

- **Framework**: NestJS v11 🐺
- **Language**: TypeScript 📝
- **Database**: PostgreSQL 🐘
- **ORM**: TypeORM 🔗
- **Auth**: JWT with Passport 🛡️
- **Validation**: class-validator & class-transformer ✅
- **Hashing**: bcrypt 🔒
- **Queue**: RabbitMQ 🐰
- **Cache**: Redis (via cache-manager) ⚡
- **Payments**: Stripe 💳
- **Images**: Cloudinary ☁️
- **Emails**: Nodemailer with Handlebars 📧
- **Testing**: Jest 🧪
- **Linting**: ESLint + Prettier ✨

## 📋 Prerequisites

- Node.js (v18+) 🌟
- PostgreSQL (v12+) 🐘
- npm or yarn 📦

## 🚀 Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/a-3isa/ecommerce_store
   cd ecommerce_store
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment**  
   Create `.env` file:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=ecommerce_db
   DB_AUTO_LOAD_ENTITIES=true
   DB_SYNCHRONIZE=true

   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=3600s

   PORT=3000
   NODE_ENV=development

   # Optional: Stripe, Cloudinary, Redis keys
   STRIPE_SECRET_KEY=sk_test_...
   CLOUDINARY_CLOUD_NAME=...
   REDIS_URL=redis://localhost:6379
   ```

4. **Set up database**

   ```sql
   CREATE DATABASE ecommerce_db;
   ```

5. **Run the app**
   ```bash
   npm run start:dev  # Development
   npm run start:prod  # Production
   ```

API runs at `http://localhost:3000` 🌐

## 📖 API Documentation

Swagger docs available at `http://localhost:3000/api/docs` 📚

### Quick Examples

#### Auth

```http
POST /auth/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Cart

```http
POST /cart
Authorization: Bearer <token>
{
  "productId": "product-uuid",
  "quantity": 2
}
```

#### Order

```http
POST /order
Authorization: Bearer <token>
{
  "cartId": "cart-uuid",
  "shippingAddress": "123 Main St"
}
```

#### Coupon

```http
POST /coupon/apply
{
  "code": "DISCOUNT10",
  "orderTotal": 100
}
```

#### Product with EAV

```http
POST /product
{
  "name": "T-Shirt",
  "price": 29.99,
  "categoryId": "category-uuid",
  "attributes": [
    {"attributeId": "color-id", "value": "Red"},
    {"attributeId": "size-id", "value": "Large"}
  ]
}
```

## 🗄️ Database Schema (Overview)

- **Users**: id, username, email, password, roles
- **Categories**: id, name, slug, parentId
- **Products**: id, name, price, stock, categoryId
- **Product Attributes**: id, name, type, options
- **Product Attribute Values**: productId, attributeId, value
- **Cart**: id, userId, items
- **Orders**: id, userId, total, status
- **Coupons**: id, code, discount
- **Gifts**: id, name, description
- **Transactions**: id, orderId, amount, status

## 🧪 Testing

```bash
npm run test        # Unit tests
npm run test:e2e    # E2E tests
npm run test:cov    # Coverage
```

## 🤝 Contributing

1. Fork the repo 🍴
2. Create a feature branch 🌿
3. Make changes ✨
4. Add tests 🧪
5. Submit PR 📤

## 📄 License

UNLICENSED

## 🎯 What's Next?

- 📈 Analytics & reporting
- 🌍 Multi-language support
- 🔄 Advanced caching
- 📱 Mobile API optimizations

Enjoy building awesome e-commerce apps! 🎉
