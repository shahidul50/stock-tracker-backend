# Stock Tracker API Examples

This document describes the implemented API routes and request shapes.

## Base URL

```text
http://localhost:5000/api/v1
```

The health check is not versioned:

```http
GET http://localhost:5000/
```

```json
{
  "success": true,
  "message": "Stock tracker API is running"
}
```

## Authentication

Protected routes accept either a bearer token or the HTTP-only `token` cookie set by login.

```http
Authorization: Bearer <token>
```

All protected routes require authentication. There is currently no role-based route restriction.

## 1) Login

The seeded admin email and password come from `ADMIN_SEEDING_ACCOUNT_EMAIL` and `ADMIN_SEEDING_ACCOUNT_PASSWORD` in `.env`.

```http
POST /auth/v1/login
Content-Type: application/json
```

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

`email` must be valid and `password` must contain at least 6 characters.

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64d2c1b9aaf2f613d6234567",
      "name": "Admin",
      "email": "admin@example.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiJ9..."
  }
}
```

The response also sets an HTTP-only `token` cookie for 7 days.

## 2) Current User

```http
GET /auth/me
Authorization: Bearer <token>
```

Returns `data.user` with `id`, `name`, `email`, and `role`.

## 3) Logout

Logout is public and clears the `token` cookie.

```http
POST /auth/v1/logout
```

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Categories

All category routes require `Authorization: Bearer <token>`.

### List Categories

```http
GET /categories?searchTerm=beverage&sortBy=name&sortOrder=asc&page=1&limit=10
```

All query parameters are optional. `searchTerm` searches by name, `sortOrder` is `asc` or `desc` (default `desc`), and the default pagination is page `1`, limit `10`.

### Category Select Options

```http
GET /categories/select
```

Returns `data.data` as options such as:

```json
[
  { "label": "Beverage", "value": "64d2c1b9aaf2f613d6234567" }
]
```

### Get Category 

```http
GET /categories/64d2c1b9aaf2f613d6234567
```

### Create Category

```http
POST /categories
Content-Type: application/json
```

```json
{
  "name": "Beverage",
  "description": "Cold drink items"
}
```

Returns `201` with message `Category created successfully`.

Note: `descrption` field is optional.

### Update Category

At least one field must be provided.

```http
PUT /categories/64d2c1b9aaf2f613d6234567
Content-Type: application/json
```

```json
{
  "name": "Beverages",
  "description": "Cold and hot drink items"
}
```

Returns `200` with message `Category updated successfully`.

### Delete Category

```http
DELETE /categories/64d2c1b9aaf2f613d6234567
```

Returns `200` with message `Category deleted successfully`.

## Companies

All company routes require authentication and use the same response envelope as category routes.

### List Companies

```http
GET /companies?searchTerm=fresh&sortBy=name&sortOrder=asc&page=1&limit=10
```

Supported query parameters are `searchTerm`, `sortBy`, `sortOrder` (`asc|desc`, default `desc`), `page` (default `1`), and `limit` (default `10`).

### Company Select Options

```http
GET /companies/select
```

Returns `data.data` as `{ "label": "Fresh Supply Ltd", "value": "<companyId>" }` options.

### Get Company

```http
GET /companies/64d2c1b9aaf2f613d6234567
```
### Create Company

```http
POST /companies
Content-Type: application/json
```

```json
{
  "name": "Dell Technologies",
  "description": "Global tech manufacturer for PCs and servers"
}
```

Returns `201` with message `Company created successfully`.

Note: `descrption` field is optional.

### Update Company

At least one field must be provided.

```http
PUT /companies/64d2c1b9aaf2f613d6234567
Content-Type: application/json
```

```json
{
  "name": "Dell Technologies",
  "description": "Global tech manufacturer for PCs and servers"
}
```

Returns `200` with message `Company updated successfully`.

### Delete Company

```http
DELETE /companies/64d2c1b9aaf2f613d6234567
```

Returns `200` with message `Company deleted successfully`.

## Items

All item routes require authentication. Use valid MongoDB ObjectId values for `categoryId`, `companyId`, and `itemId`.

### List Items

```http
GET /items?searchTerm=cola&categoryId=<categoryId>&companyId=<companyId>&sortBy=name&sortOrder=asc&page=1&limit=10
```

All query parameters are optional. `searchTerm` searches name and description; `sortOrder` is `asc` or `desc` (default `desc`); page and limit default to `1` and `10`.

### Item Select Options

Both filters are required:

```http
GET /items/select?categoryId=<categoryId>&companyId=<companyId>
```

### Get Item

```http
GET /items/<itemId>
```

### Create Item

`availableQuantity` is initialized to `0` by the server and must not be sent.

```http
POST /items
Content-Type: application/json
```

```json
{
  "name": "Dell XPS 13 Laptop",
  "categoryId": "64d2c1b9aaf2f613d6234567",
  "companyId": "64d2c1d5aaf2f613d6234568",
  "reorderLevel": 20,
  "description": "Optional..."
}
```

`reorderLevel` must be a positive number. Returns `201` with message `Item created successfully`.

Note: `description` field is Optional.

### Update Item

The validation requires `categoryId` and `companyId`; other fields are optional.

```http
PUT /items/<itemId>
Content-Type: application/json
```

```json
{
  "categoryId": "64d2c1b9aaf2f613d6234567",
  "companyId": "64d2c1d5aaf2f613d6234568",
  "name": "Dell XPS 13 Laptop",
  "reorderLevel": 25,
  "description": "Updated description"
}
```

### Delete Item

```http
DELETE /items/<itemId>
```

## Stock In

All stock-in routes require authentication.

### List Stock-ins

```http
GET /stock-in?searchTerm=Dell XPS 13 Laptop&categoryId=<categoryId>&companyId=<companyId>&sortBy=createdAt&sortOrder=desc&page=1&limit=10
```

All query parameters are optional. The default page and limit are `1` and `10`.

### Record Stock-in

```http
POST /stock-in
Content-Type: application/json
```

```json
{
  "itemId": "64d2c1b9aaf2f613d6234567",
  "quantity": 25
}
```

`quantity` must be a positive integer. This increments the item's available quantity. Returns `201` with message `Stock-in recorded successfully`.

## Stock Out

All stock-out routes require authentication.

### Today's Stock-out Count

```http
GET /stock-out/count/today
```

Returns a count object in `data`:

```json
{ "count": 3 }
```

### Record Stock-out

```http
POST /stock-out
Content-Type: application/json
```

```json
{
  "items": [
    {
      "itemId": "64d2c1b9aaf2f613d6234567",
      "quantity": 5,
      "type": "Sell"
    },
    {
      "itemId": "64d2c1b9aaf2f613d6234567",
      "quantity": 2,
      "type": "Damage"
    },
    {
      "itemId": "64d2c1b9aaf2f613d6234567",
      "quantity": 1,
      "type": "Lost"
    }
  ]
}
```

`items` must contain at least one entry. `type` must be `Sell`, `Damage`, or `Lost`; each quantity must be positive. The server rejects insufficient stock and decrements available quantities. Returns `201` with message `Stock-out processed successfully` and an array of created records.

## Reports

All report routes require authentication. Report responses use the standard success envelope.

### Stock Summary

```http
GET /reports/stock-summary?companyId=<companyId>&categoryId=<categoryId>&page=1&limit=10
```

All query parameters are optional. The default page and limit are `1` and `10`. Results include `itemName`, `companyName`, `categoryName`, `availableQty`, `reorderLevel`, and `status` (`Out of Stock`, `Low Stock`, or `In Stock`).

### Stock Summary Export

```http
GET /reports/stock-summary/export?companyId=<companyId>&categoryId=<categoryId>
```

Filters are optional. This returns all matching rows as JSON in `data.data`; it is not a CSV or file download.

### Sales Report

```http
GET /reports/sales?fromDate=2026-08-01&toDate=2026-08-31&page=1&limit=10
```

`fromDate` and `toDate` are required and must be valid dates with `fromDate <= toDate`. `page` and `limit` are optional and default to `1` and `10`. Only `Sell` records are included. Each row contains `itemName`, `categoryName`, `companyName`, `totalSoldQty`, and `soldDate`.

### Sales Report Export

```http
GET /reports/sales/export?fromDate=2026-08-01&toDate=2026-08-31
```

The date parameters are required. This returns all matching sales rows as JSON in `data.data`; it is not a file download.

## Common Responses

Successful responses follow this shape:

```json
{
  "success": true,
  "message": "Optional success message",
  "data": {}
}
```

Errors follow the application's error response format and commonly use status codes `400`, `401`, `404`, `409`, `500`, or `503`:

```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Description of the error"
}
```
