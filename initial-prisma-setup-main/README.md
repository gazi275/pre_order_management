# Preorder Manager - Backend API

A simple Express.js + Prisma + SQLite backend for managing preorders.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** SQLite
- **Validation:** Zod

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

```bash
npx prisma migrate dev --name init
```

### 3. Seed sample data

```bash
npm run db:seed
```

### 4. Run the development server

```bash
npm run dev
```

The API will be running at `http://localhost:5000`

## API Endpoints

| Method   | Endpoint                       | Description                      |
| -------- | ------------------------------ | -------------------------------- |
| `GET`    | `/api/v1/preorders`            | List all preorders (with filters, sort, pagination) |
| `POST`   | `/api/v1/preorders`            | Create a new preorder            |
| `GET`    | `/api/v1/preorders/:id`        | Get a single preorder            |
| `PATCH`  | `/api/v1/preorders/:id`        | Update a preorder                |
| `PATCH`  | `/api/v1/preorders/:id/status` | Toggle preorder status           |
| `DELETE` | `/api/v1/preorders/:id`        | Delete a preorder                |

## Query Parameters (GET /api/v1/preorders)

| Parameter    | Type   | Description                              |
| ------------ | ------ | ---------------------------------------- |
| `status`     | string | Filter by status: `all`, `active`, `inactive` |
| `searchTerm` | string | Search by preorder name                  |
| `sortBy`     | string | Sort field: `name`, `createdAt`, `startsAt`, `endsAt` |
| `sortOrder`  | string | Sort direction: `asc` or `desc`          |
| `page`       | number | Page number (default: 1)                 |
| `limit`      | number | Items per page (default: 10)             |

## Environment Variables

Create a `.env` file:

```env
NODE_ENV="development"
PORT=5000
DATABASE_URL="file:./dev.db"
```
