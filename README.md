# E-Commerce Store Backend API

A robust, scalable e-commerce backend API built with NestJS, featuring an advanced Entity-Attribute-Value (EAV) product system, JWT authentication, and comprehensive product filtering capabilities.

## 🚀 Features

### Core Features

- **User Management**: Complete user registration, authentication, and profile management
- **JWT Authentication**: Secure token-based authentication with role-based access control
- **Category Management**: Hierarchical category structure for product organization
- **Advanced Product System**: Flexible EAV (Entity-Attribute-Value) model for dynamic product attributes
- **Smart Filtering**: Advanced product filtering by attributes, categories, price, and search terms
- **Search Functionality**: Full-text search across products with attribute-based filtering

### EAV Product System

- **Dynamic Attributes**: Create custom attributes (color, size, material, etc.) without schema changes
- **Flexible Data Types**: Support for text, number, boolean, date, select, and multiselect attributes
- **Attribute Management**: Complete CRUD operations for product attributes
- **Validation Rules**: Built-in validation for attribute values
- **Category-Specific Attributes**: Different attributes per category

## 🛠 Technology Stack

- **Framework**: NestJS v11 (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens) with Passport
- **Validation**: class-validator & class-transformer
- **Password Hashing**: bcrypt
- **Testing**: Jest with e2e testing
- **Linting**: ESLint + Prettier

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/a-3isa/ecommerce_store
   cd ecommerce_store
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=ecommerce_db
   DB_AUTO_LOAD_ENTITIES=true
   DB_SYNCHRONIZE=true

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=3600s

   # Application
   PORT=3000
   NODE_ENV=development
   ```

4. **Database Setup**

   ```sql
   CREATE DATABASE ecommerce_db;
   ```

5. **Run the application**

   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run start:prod
   ```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepassword123"
}
```

#### Admin Register

```http
POST /auth/adminRegister
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@example.com",
  "password": "adminpassword123"
}
```

### User Endpoints

#### Get All Users

```http
GET /user
Authorization: Bearer <jwt_token>
```

#### Get User by ID

```http
GET /user/:id
Authorization: Bearer <jwt_token>
```

### Category Endpoints

#### Create Category

```http
POST /category
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices and accessories"
}
```

#### Get All Categories

```http
GET /category
```

#### Get Category by ID

```http
GET /category/:id
```

### Product Endpoints

#### Create Product with EAV Attributes

```http
POST /product
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "T-Shirt",
  "slug": "t-shirt",
  "description": "Comfortable cotton t-shirt",
  "price": 29.99,
  "stock": 100,
  "type": "single",
  "sku": "TS001",
  "barcode": "123456789",
  "categoryId": "category-uuid",
  "attributes": [
    {
      "attributeId": "color-attribute-id",
      "value": "Red",
      "metadata": {
        "unit": "color"
      }
    },
    {
      "attributeId": "size-attribute-id",
      "value": "Large",
      "metadata": {
        "unit": "size"
      }
    }
  ]
}
```

#### Get Products with Filtering

```http
GET /product?search=t-shirt&categoryId=electronics&minPrice=10&maxPrice=50&attributeFilters=color:red,size:large&page=1&limit=10&sortBy=price&sortOrder=ASC
```

#### Search Products

```http
GET /product/search?q=t-shirt
```

#### Get Products by Category

```http
GET /product/category/:categoryId
```

#### Get Products by Attribute

```http
GET /product/attribute/:attributeId/:value
```

#### Get Category Filter Attributes

```http
GET /product/category-filters/attributes?categoryId=electronics
```

#### Get Category Attribute Values

```http
GET /product/category-filters/:categoryId/attribute/:attributeId/values
```

## 🗄️ Database Schema

### Core Tables

#### Users

- `id` (UUID, Primary Key)
- `username` (String, Unique)
- `email` (String, Unique)
- `password` (String, Hashed)
- `roles` (JSON)
- `isActive` (Boolean)
- `createdAt`, `updatedAt` (Timestamps)

#### Categories

- `id` (UUID, Primary Key)
- `name` (String, Unique)
- `slug` (String, Unique)
- `description` (Text)
- `parentId` (UUID, Foreign Key)
- `isActive` (Boolean)
- `createdAt`, `updatedAt` (Timestamps)

#### Products

- `id` (UUID, Primary Key)
- `name` (String)
- `slug` (String, Unique)
- `description` (Text)
- `price` (Decimal)
- `stock` (Integer)
- `type` (Enum: single, variant, group, gift)
- `sku` (String, Unique)
- `barcode` (String, Unique)
- `categoryId` (UUID, Foreign Key)
- `isActive` (Boolean)
- `createdAt`, `updatedAt` (Timestamps)

### EAV Tables

#### Product Attributes

- `id` (UUID, Primary Key)
- `name` (String, Unique) - e.g., "color", "size"
- `displayName` (String) - e.g., "Color", "Size"
- `type` (Enum: text, number, boolean, date, select, multiselect)
- `description` (Text)
- `isRequired` (Boolean)
- `isActive` (Boolean)
- `options` (JSON Array) - For select/multiselect types
- `validationRules` (JSON)
- `sortOrder` (Integer)
- `createdAt`, `updatedAt` (Timestamps)

#### Product Attribute Values

- `id` (UUID, Primary Key)
- `productId` (UUID, Foreign Key)
- `attributeId` (UUID, Foreign Key)
- `value` (Text)
- `isActive` (Boolean)
- `createdAt`, `updatedAt` (Timestamps)

## 🔧 EAV System Usage

### 1. Create Attributes First

```http
POST /admin/attributes
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "color",
  "displayName": "Color",
  "type": "select",
  "options": ["Red", "Blue", "Green", "Black"],
  "isRequired": true,
  "description": "Product color options"
}
```

### 2. Create Products with Attributes

```http
POST /product
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Cotton T-Shirt",
  "slug": "cotton-t-shirt",
  "price": 25.99,
  "stock": 50,
  "categoryId": "clothing-category-id",
  "attributes": [
    {
      "attributeId": "color-attribute-id",
      "value": "Red"
    },
    {
      "attributeId": "size-attribute-id",
      "value": "Large"
    }
  ]
}
```

### 3. Filter Products by Attributes

```http
GET /product?attributeFilters=color:red,size:large
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write descriptive commit messages
- Add proper error handling

### API Guidelines

- Use appropriate HTTP status codes
- Include proper error messages
- Validate all inputs
- Use pagination for list endpoints
- Include proper TypeScript types

### Database Guidelines

- Use UUID for primary keys
- Include createdAt and updatedAt timestamps
- Use soft deletes where appropriate
- Add proper indexes for performance

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- SQL injection prevention through TypeORM
- CORS configuration

## 📈 Performance Features

- Database query optimization
- Pagination support
- Efficient EAV queries with proper indexing
- Caching strategies (can be implemented)
- Lazy loading for related entities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the API documentation
- Review the code examples

## 🔄 API Response Examples

### Successful Product Creation

```json
{
  "id": "product-uuid",
  "name": "T-Shirt",
  "slug": "t-shirt",
  "price": 29.99,
  "stock": 100,
  "attributeValues": [
    {
      "id": "attr-value-uuid",
      "attribute": {
        "id": "color-attr-id",
        "name": "color",
        "displayName": "Color"
      },
      "value": "Red"
    }
  ]
}
```

### Filtered Products Response

```json
{
  "products": [...],
  "total": 150,
  "page": 1,
  "limit": 10,
  "totalPages": 15
}
```

## 🎯 Future Enhancements

- [ ] Image upload and management
- [ ] Product reviews and ratings
- [ ] Shopping cart functionality
- [ ] Order management system
- [ ] Payment integration
- [ ] Inventory management
- [ ] Analytics and reporting
- [ ] Multi-language support
- [ ] API rate limiting
- [ ] Caching layer (Redis)
