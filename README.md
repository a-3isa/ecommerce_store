# E-Commerce Store Backend API

A NestJS REST API for an online store: JWT authentication, a flexible EAV (Entity-Attribute-Value) product catalogue, filtering and search, cart, orders, coupons, gifts, Stripe payments and transactional email.

## Features

- **Auth and users**: registration, login, profiles, role-based access (JWT + Passport)
- **Catalogue**: hierarchical categories; products with dynamic attributes (color, size, ...) defined at runtime via EAV, so new attributes need no schema change
- **Attribute types**: text, number, boolean, date, select, multiselect, with validation rules and per-category attributes
- **Search and filtering**: by attribute, price, category and text
- **Cart and orders**: cart management, order creation, shipment handling, order-confirmation emails (Nodemailer + Handlebars templates)
- **Promotions**: coupons and gift products
- **Payments**: Stripe, with transactions recorded per order
- **Images**: product images stored on Cloudinary
- **Async work**: RabbitMQ queue for background jobs such as email
- **Caching and protection**: Redis cache (cache-manager) and request rate limiting (Throttler)

## Tech stack

NestJS 11, TypeScript, PostgreSQL, TypeORM, Passport/JWT, class-validator, bcrypt, RabbitMQ, Redis, Stripe, Cloudinary, Nodemailer, Jest, ESLint + Prettier.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- Redis (cache) and RabbitMQ (queue)
- Optional accounts: Stripe (test keys), Cloudinary, an SMTP provider

Redis and RabbitMQ can be started locally with Docker:

```bash
docker run -d --name redis -p 6379:6379 redis
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

## Getting started

```bash
git clone https://github.com/a-3isa/ecommerce_store
cd ecommerce_store
npm install
```

Create the database:

```sql
CREATE DATABASE ecommerce_db;
```

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=ecommerce_db
DB_AUTO_LOAD_ENTITIES=true
# Convenient for local development only. Turn off and use migrations in production.
DB_SYNCHRONIZE=true

JWT_SECRET=change-me
JWT_EXPIRES_IN=3600s

PORT=3000
NODE_ENV=development

REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost:5672

STRIPE_SECRET_KEY=sk_test_...
CLOUDINARY_CLOUD_NAME=...
```

Run:

```bash
npm run start:dev                      # development, hot reload
npm run build && npm run start:prod    # production
```

The API listens on `http://localhost:3000`; Swagger docs are at `http://localhost:3000/api/docs`. Treat Swagger as the source of truth for request shapes.

## Example requests

```http
POST /auth/register
{ "username": "john_doe", "email": "john@example.com", "password": "securepassword123" }

POST /cart                      (Authorization: Bearer <token>)
{ "productId": "<product-uuid>", "quantity": 2 }

POST /order                     (Authorization: Bearer <token>)
{ "cartId": "<cart-uuid>", "shippingAddress": "123 Main St" }

POST /coupon/apply
{ "code": "DISCOUNT10", "orderTotal": 100 }

POST /product
{ "name": "T-Shirt", "price": 29.99, "categoryId": "<category-uuid>",
  "attributes": [ { "attributeId": "<color-id>", "value": "Red" },
                  { "attributeId": "<size-id>", "value": "Large" } ] }
```

## Data model (overview)

Users, Categories (self-referencing parent), Products, Product Attributes, Product Attribute Values (product x attribute), Cart and cart items, Orders, Coupons, Gifts, Transactions.

## Testing

```bash
npm run test       # unit
npm run test:e2e   # end to end
npm run test:cov   # coverage
```

## License

UNLICENSED. Source is public for portfolio review.
