# E-Commerce Store API

A NestJS REST API for an online shop: JWT accounts with shopper and admin roles, a product catalogue whose attributes (colour, size, ...) are data rather than columns, coupons, gift rules, Stripe Checkout with a signed webhook, and order-confirmation emails sent through a RabbitMQ queue.

## Overview

Admins build the catalogue: categories (nested), attributes, attribute values, products and product variants (a product plus a set of attribute values, with its own price and stock). Shoppers browse the catalogue, fill a cart and pay through Stripe Checkout. When Stripe calls the webhook, the API verifies the signature, turns the cart into a paid order, records the transaction and queues a confirmation email.

## Features

- **Accounts:** registration and login with bcrypt-hashed passwords and 7-day JWTs. Every route except register, login and the Stripe webhook needs a token. Admin-only routes check the role.
- **Catalogue:** nested categories; attributes and values stored as rows (EAV), so a new attribute needs no migration; variants carry their own price and stock. Product images upload to Cloudinary.
- **Promotions:** coupons (fixed or percentage, per order or per product, with expiry, usage limit and minimum order value) and gift rules ("buy N of X, get Y").
- **Payments:** `POST /order/checkout` creates a Stripe Checkout session from the cart, priced from the database (in EGP). `POST /order/webhook` checks the Stripe signature, then creates the order, the transaction and the email job.
- **Email:** the webhook publishes the order to a RabbitMQ topic exchange; a subscriber renders a Handlebars template and sends it over SMTP.
- **Protection:** a global per-IP rate limit (100 requests a minute per route), validation that drops undeclared fields, a global error filter, and password hashes stripped from every response.
- **Docs:** Swagger UI at `/api/docs`.

## Architecture

```mermaid
flowchart LR
    client[Client] -->|JWT| api
    stripe[Stripe] -->|signed webhook| api
    subgraph api[NestJS API]
        direction TB
        guard[JWT guard, role guard] --> modules[Auth, catalogue, cart,<br/>coupons, gifts, orders]
    end
    api -->|TypeORM| pg[(PostgreSQL)]
    api -->|Checkout session| stripe
    api -->|image upload| cloudinary[Cloudinary]
    api -->|publish order| mq[[RabbitMQ<br/>email_exchange]]
    mq -->|email_queue| mailer[Email subscriber] -->|SMTP| smtp[Mail server]
```

## Tech stack

NestJS 11, TypeScript, PostgreSQL with TypeORM, Passport JWT, bcrypt, class-validator, Stripe, RabbitMQ (`@golevelup/nestjs-rabbitmq`), Nodemailer with Handlebars templates (`@nestjs-modules/mailer`), Cloudinary, cache-manager, Swagger, Jest, ESLint and Prettier.

## Getting started

You need Node.js 20 or later (`.nvmrc` pins 22), PostgreSQL and RabbitMQ. Redis is configured but not used yet (see known issues). A Stripe test key is required at startup; Cloudinary and SMTP accounts are only needed for image uploads and emails.

```bash
git clone https://github.com/a-3isa/ecommerce_store
cd ecommerce_store
npm ci
cp .env.example .env.development      # then fill in the values
```

The app loads `.env.development`, or `.env.production` when `NODE_ENV=production`. It does not read `.env`.

| Variable | Required | Purpose |
|---|---|---|
| `PORT` | no (3000) | HTTP port |
| `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` | yes | PostgreSQL connection. TypeORM creates and updates the tables on start (`synchronize: true`). |
| `JWT_SECRET` | yes | Signs login tokens; the app will not start without it |
| `REDIS_HOST`, `REDIS_PORT` | no | Intended cache store; currently ignored (see known issues) |
| `RABBITMQ_URI` | yes | e.g. `amqp://guest:guest@localhost:5672` |
| `STRIPE_SECRET_KEY` | yes | Stripe secret key (test mode is fine); checked at startup |
| `STRIPE_WEBHOOK_SECRET` | for the webhook | Signing secret from `stripe listen` or the Stripe dashboard |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS` | for emails | SMTP server for order confirmations |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | for images | Product image uploads |

Start the services and the API:

```bash
docker run -d --name ecommerce-postgres -e POSTGRES_PASSWORD=change-me -e POSTGRES_DB=ecommerce_store -p 5432:5432 postgres:15
docker run -d --name ecommerce-rabbitmq -p 5672:5672 rabbitmq:3-alpine

npm run start:dev                     # watch mode
npm run seed                          # optional: sample categories, attributes, products and variants
```

The API listens on `http://localhost:3000`, with Swagger at `http://localhost:3000/api/docs`. For a production build, put the settings in `.env.production` and run `npm run build`, then `NODE_ENV=production npm run start:prod`.

**First admin.** `POST /auth/adminRegister` needs an admin token, so promote the first account in the database after registering it:

```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

**Stripe webhook locally.** Install the [Stripe CLI](https://docs.stripe.com/stripe-cli), then run `stripe listen --forward-to localhost:3000/order/webhook` and put the `whsec_...` it prints in `STRIPE_WEBHOOK_SECRET`.

## Docker

`docker-compose.yml` runs PostgreSQL 15, Redis, RabbitMQ (with the management UI on 15672) and the API on port 3000. The API container reads `.env.production`; inside the compose network, set `DB_HOST=postgres`, `REDIS_HOST=redis` and `RABBITMQ_URI=amqp://guest:guest@rabbitmq:5672`, and make `DB_USERNAME`, `DB_PASSWORD` and `DB_DATABASE` match the `postgres` service.

```bash
cp .env.example .env.production       # then edit as above
npm ci && npm run build               # the compose file mounts this folder over /app, so dist/ comes from here
docker compose up -d --build
```

The API container may exit once or twice while RabbitMQ starts; `restart: always` brings it back. The `Dockerfile` alone builds a standalone image (`docker build -t ecommerce-store .`).

## API

All routes except the first two and the webhook need `Authorization: Bearer <token>`. "Admin" routes also need the admin role. Swagger documents the request bodies.

| Area | Route | Who |
|---|---|---|
| Auth | `POST /auth/register`, `POST /auth/login` | Anyone |
| | `POST /auth/adminRegister` | Admin |
| Users | `GET /user/me`, `PATCH /user` (own profile and password) | Signed in |
| | `GET /user`, `GET /user/:id`, `DELETE /user/:id` | Admin |
| Categories | `GET /category` (top level), `GET /category/:id` (subcategories) | Signed in |
| | `POST /category`, `PATCH /category/:id`, `DELETE /category/:id` | Admin |
| Products | `GET /product`, `GET /product/:id`, `GET /product/search` | Signed in |
| | `POST /product` (multipart, optional `image`), `PATCH /product/:id`, `DELETE /product/:id` | Admin |
| Attributes | `GET`, `POST`, `PATCH`, `DELETE /product-attr[/:id]` | Admin |
| Attribute values | `GET /product-attr-val[/:id]` | Signed in |
| | `POST`, `PATCH`, `DELETE /product-attr-val[/:id]` | Admin |
| Variants | `GET /product-attr-var[/:id]` | Signed in |
| | `POST`, `PATCH`, `DELETE /product-attr-var[/:id]` | Admin |
| Cart | `GET /cart`, `PATCH /cart` | Signed in |
| Orders | `POST /order/checkout` (returns the Stripe Checkout URL), `GET /order`, `GET /order/:id` | Signed in |
| | `POST /order/webhook` | Stripe (signature checked) |
| Coupons | `GET /coupon/code/:code` | Signed in |
| | `GET /coupon`, `GET /coupon/:id`, `POST`, `PATCH`, `DELETE /coupon[/:id]` | Admin |
| Gifts | `GET /gift[/:id]`, `POST /gift/check-gifts` | Signed in |
| | `POST`, `PATCH`, `DELETE /gift[/:id]` | Admin |
| Transactions | `GET /transaction[/:id]`, `PATCH /transaction/:id` | Admin |

## Project structure

```
src/
  auth/                 register, login, JWT strategy, global JWT guard, role guard
  user/                 profile and admin user management
  category/             nested categories
  product/              products, search, Cloudinary upload
  product-attr/         attributes (EAV)
  product-attr-val/     attribute values
  product-attr-var/     variants: price, stock, attribute values
  cart/  order/         cart, Stripe Checkout and webhook, order emails
  coupon/  gift/        promotions
  transaction/          payment records
  rabbitmq/  cloudinary/  common/   queue, image upload, global pipe, filter, interceptors
  seed.ts               sample data
templates/              Handlebars email templates
```

## Testing and checks

```bash
npm test               # unit tests (Jest)
npm run lint           # ESLint, no fixes applied
npm run format:check   # Prettier
npm run build
```

The unit tests cover the role guard, the list of admin-only routes and the validation pipe. There are no end-to-end tests yet. CI runs lint, format check, build and tests, and builds the Docker image, on every pull request and on pushes to `master`.

## Security notes

- Passwords are hashed with bcrypt and never returned. Login gives the same answer for an unknown email and a wrong password.
- A global guard requires a valid JWT everywhere except register, login and the Stripe webhook; catalogue, coupon, gift, user and transaction management need the admin role.
- Request bodies are validated against DTOs, and undeclared fields are dropped, so a client cannot set fields like `role`.
- The webhook is accepted only with a valid Stripe signature, over the raw request body. Prices come from the database, not the client.
- Secrets come from the environment; `.env*` files other than `.env.example` are git-ignored. See [SECURITY.md](SECURITY.md) to report a vulnerability.

## Known issues and roadmap

These are bugs in the current code, recorded here rather than hidden:

- **Routes that use the signed-in user return 400** (`/user/me`, `PATCH /user`, cart, checkout, orders, transactions). The custom global validation pipe also validates the `@GetUser()` parameter, which has no validation rules, and class-validator rejects it.
- **`GET /product/search` returns 400**: it is declared after `GET /product/:id`, which matches first.
- **`PATCH /product/:id` returns 400**: the handler reads the id from the wrong parameter type.
- **The cache is in memory, not in Redis**: `cache-manager-redis-store` is not compatible with cache-manager 7, so the Redis settings are ignored.
- Registration accepts passwords of 6 or more characters, but login requires 8 to 12 with mixed case and a digit or symbol, so some new accounts cannot log in.
- Checkout success and cancel URLs are placeholders, and coupons are not yet passed from the checkout route.
- Planned: migrations instead of `synchronize`, end-to-end tests, and upgrades to nodemailer 10 and bcrypt 6.

## License and author

UNLICENSED: the source is public for portfolio review, and no licence is granted to reuse it. Built by Ahmed Ibrahim Hussien ([a-3isa](https://github.com/a-3isa)).
