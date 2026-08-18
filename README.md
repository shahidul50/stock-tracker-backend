# Stock Tracker Backend App

A Node.js + Express + MongoDB backend for the stock tracking system described in the PRD.

## Tech Stack

- Node.js
- TypeScript
- Express
- MongoDB + Mongoose
- JWT authentication
- bcryptjs
- pnpm

## Project Structure

- `src/app.ts` - Express app setup
- `src/index.ts` - server entry point
- `src/lib/config.ts` - environment config
- `src/lib/connectDB.ts` - MongoDB connection
- `src/lib/seedAdmin.ts` - seed admin user on startup
- `src/models/` - Mongoose schemas
- `src/modules/` - route + controller modules
- `src/middlewares/` - auth + error handling
- `src/utils/` - utilities and helpers

## Environment Variables

Create a `.env` file using the example values from `.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/stock-trackr
JWT_SECRET=stock-trackr-super-secret
JWT_EXPIRES_IN=7d
ADMIN_SEEDING_ACCOUNT_NAME=Admin
ADMIN_SEEDING_ACCOUNT_EMAIL=admin@stocktrackr.com
ADMIN_SEEDING_ACCOUNT_PASSWORD=admin123
```

## Install and Run

```bash
pnpm install
pnpm dev
```

## Base URL

```text
http://localhost:5000
```

## Authentication

### Login

```http
POST /api/v1/auth/login
```

Request body:

```json
{
  "email": "admin@stocktrackr.com",
  "password": "admin123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "Admin",
      "email": "admin@stocktrackr.com",
      "role": "admin"
    },
    "token": "..."
  }
}
```

### Get Current User

```http
GET /api/v1/auth/me
```

### Logout

```http
POST /api/v1/auth/logout
```

## API Endpoints

### Categories

```http
GET    /api/v1/categories
POST   /api/v1/categories
PATCH  /api/v1/categories/:id
DELETE /api/v1/categories/:id
```

### Companies

```http
GET    /api/v1/companies
POST   /api/v1/companies
PATCH  /api/v1/companies/:id
DELETE /api/v1/companies/:id
```

### Items

```http
GET    /api/v1/items
POST   /api/v1/items
PATCH  /api/v1/items/:id
DELETE /api/v1/items/:id
```

### Stock In

```http
GET  /api/v1/stock-in
POST /api/v1/stock-in
```

Example stock-in request:

```json
{
  "itemId": "64f1c7d12e9e7d0012345678",
  "quantity": 25
}
```

### Stock Out

```http
GET  /api/v1/stock-out
POST /api/v1/stock-out
```

Example stock-out request:

```json
{
  "items": [
    {
      "itemId": "64f1c7d12e9e7d0012345678",
      "quantity": 5,
      "type": "Sell"
    },
    {
      "itemId": "64f1c7d12e9e7d0012345678",
      "quantity": 2,
      "type": "Damage"
    }
  ]
}
```

### Reports

```http
GET /api/v1/reports/summary
GET /api/v1/reports/sales
```

Summary filters:

```http
GET /api/v1/reports/summary?companyId=...&categoryId=...
```

Sales report filters:

```http
GET /api/v1/reports/sales?fromDate=2026-08-01&toDate=2026-08-31
```

## Notes

- All protected routes require a valid JWT token.
- The app will auto-create the admin account from environment variables on server startup.
- Stock-out operations are handled in a MongoDB session transaction to maintain consistency.
