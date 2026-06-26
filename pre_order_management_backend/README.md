# Preorder Manager — Backend API

A RESTful API server for the **Preorder Manager** application, built as part of the Xubitar technical assessment.  
It provides full CRUD operations for managing preorders, including status toggling, server-side pagination, sorting, filtering, and search.

---

## Tech Stack

| Layer          | Technology              |
|----------------|-------------------------|
| Runtime        | Node.js                 |
| Framework      | Express.js              |
| Language       | TypeScript              |
| ORM            | Prisma                  |
| Database       | SQLite                  |
| Caching        | Redis (via ioredis)     |
| Validation     | Zod                     |

---

## Project Structure

```
pre_order_management_backend/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   ├── migrations/            # Prisma migration history
│   ├── seed.ts                # TypeScript seed script
│   └── dev.db                 # SQLite database file (auto-generated)
├── src/
│   ├── app/
│   │   ├── middlewares/
│   │   │   ├── globalErrorHandler.ts
│   │   │   └── validateRequest.ts
│   │   ├── modules/
│   │   │   └── Preorder/
│   │   │       ├── preorder.constant.ts    # Searchable/filterable field definitions
│   │   │       ├── preorder.controller.ts  # Request handlers
│   │   │       ├── preorder.redis.ts       # Redis caching logic
│   │   │       ├── preorder.route.ts       # Route definitions
│   │   │       ├── preorder.service.ts     # Business logic & DB queries
│   │   │       └── preorder.validation.ts  # Zod schemas for request validation
│   │   └── routes/
│   │       └── index.ts                    # Central route registry
│   ├── config/
│   │   └── index.ts                        # App configuration
│   ├── errors/                             # Custom error classes
│   ├── helpers/
│   │   └── paginationHelper.ts             # Pagination calculation utility
│   ├── interfaces/                         # Shared TypeScript interfaces
│   ├── shared/
│   │   ├── catchAsync.ts                   # Async error wrapper
│   │   ├── pick.ts                         # Object key picker utility
│   │   ├── prisma.ts                       # Prisma client instance
│   │   ├── redis.ts                        # Redis client instance
│   │   └── sendResponse.ts                 # Standardized API response helper
│   ├── app.ts                              # Express app setup (CORS, middleware, routes)
│   └── server.ts                           # Server entry point
├── .env                                    # Environment variables
├── package.json
└── tsconfig.json
```

---

## Database Schema

The application uses a single `Preorder` model:

| Field          | Type       | Description                                          |
|----------------|------------|------------------------------------------------------|
| `id`           | `String`   | CUID, primary key                                    |
| `name`         | `String`   | Preorder name                                        |
| `products`     | `Int`      | Number of products (default: `1`)                    |
| `preorderWhen` | `String`   | `"out-of-stock"` or `"regardless-of-stock"`          |
| `startsAt`     | `DateTime` | When the preorder starts                             |
| `endsAt`       | `DateTime?`| When the preorder ends (nullable)                    |
| `status`       | `String`   | `"active"` or `"inactive"` (default: `"active"`)     |
| `createdAt`    | `DateTime` | Auto-generated timestamp                             |
| `updatedAt`    | `DateTime` | Auto-updated timestamp                               |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **Redis** server running on `localhost:6379` (optional, for caching)

### 1. Install dependencies

```bash
cd pre_order_management_backend
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root (one is already provided):

```env
NODE_ENV="development"
PORT=5000
DATABASE_URL="file:./dev.db"
REDIS_URL="redis://localhost:6379"
```

### 3. Set up the database

Run Prisma migrations to create the SQLite database:

```bash
npx prisma migrate dev --name init
```

### 4. Seed sample data (optional)

Populate the database with sample preorders:

```bash
npm run db:seed
```

### 5. Start the development server

```bash
npm run dev
```

The API will be available at **`http://localhost:5000`**.

---

## Available Scripts

| Script          | Command                  | Description                              |
|-----------------|--------------------------|------------------------------------------|
| `npm run dev`   | `ts-node-dev src/server` | Start dev server with auto-reload        |
| `npm run build` | `tsc`                    | Compile TypeScript to `dist/`            |
| `npm start`     | `node ./dist/server.js`  | Run compiled production build            |
| `npm run db:migrate` | `prisma migrate dev` | Run pending Prisma migrations           |
| `npm run db:seed`    | `ts-node prisma/seed.ts` | Seed the database with sample data  |
| `npm run db:reset`   | `prisma migrate reset`   | Reset database & re-run migrations  |

---

## API Endpoints

Base URL: `/api/v1`

### Preorders

| Method   | Endpoint                       | Description                                         |
|----------|--------------------------------|-----------------------------------------------------|
| `GET`    | `/preorders`                   | List all preorders (supports filters, sort, pagination) |
| `POST`   | `/preorders`                   | Create a new preorder                               |
| `GET`    | `/preorders/:id`               | Get a single preorder by ID                         |
| `PATCH`  | `/preorders/:id`               | Update a preorder                                   |
| `PATCH`  | `/preorders/:id/status`        | Toggle preorder status (active ↔ inactive)          |
| `DELETE` | `/preorders/:id`               | Delete a preorder                                   |

### Query Parameters — `GET /preorders`

| Parameter    | Type     | Default     | Description                                                      |
|--------------|----------|-------------|------------------------------------------------------------------|
| `status`     | `string` | —           | Filter by status: `active`, `inactive`                           |
| `searchTerm` | `string` | —           | Search preorders by name (case-insensitive contains)             |
| `sortBy`     | `string` | `createdAt` | Sort field: `name`, `products`, `startsAt`, `endsAt`, `createdAt`|
| `sortOrder`  | `string` | `desc`      | Sort direction: `asc` or `desc`                                  |
| `page`       | `number` | `1`         | Page number for pagination                                       |
| `limit`      | `number` | `10`        | Number of items per page                                         |

### Example Requests

**List preorders with filters:**
```bash
GET /api/v1/preorders?status=active&searchTerm=variant&sortBy=name&sortOrder=asc&page=1&limit=10
```

**Create a preorder:**
```bash
POST /api/v1/preorders
Content-Type: application/json

{
  "name": "Summer Sale Pre-Order",
  "products": 5,
  "preorderWhen": "out-of-stock",
  "startsAt": "2026-07-01T00:00:00.000Z",
  "endsAt": "2026-08-01T00:00:00.000Z"
}
```

**Toggle status:**
```bash
PATCH /api/v1/preorders/cmquknn1i0007kk0m6u84ih0l/status
```

### Response Format

All API responses follow this standardized structure:

```json
{
  "success": true,
  "message": "Preorders retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 8
  },
  "data": [ ... ]
}
```

---

## Caching (Redis)

The backend uses **Redis** for caching list and single-preorder queries:

- **List queries** are cached with an MD5-hashed key derived from filter and pagination parameters.
- **Single preorder lookups** are cached by their ID.
- On any mutation (create, update, toggle, delete), all relevant caches are automatically invalidated using non-blocking `SCAN`.
- Default TTL: **1 hour**.

> **Note:** If Redis is unavailable, the app still functions — it simply skips the cache layer and hits the database directly.

---

## Error Handling

- **Zod validation errors** return `400` with field-level details.
- **Not found errors** return `404`.
- **Global error handler** catches all unhandled errors and returns a consistent JSON response.
