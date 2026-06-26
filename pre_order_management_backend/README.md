# Preorder Manager - Backend

This is the backend component for the **Preorder Manager** application, built for the Xubitar technical assessment.

## 🚀 Tech Stack

- **Framework**: Express.js (Node.js)
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: SQLite
- **Validation**: Zod

## ✨ Features Implemented

- **RESTful API**: Clean API endpoints for CRUD operations on preorders.
- **Server-side Logic**: Handles pagination, sorting, filtering, and search robustly on the backend using Prisma queries.
- **Data Integrity**: Validates payloads on creation and update to ensure a reliable SQLite database state.

## ⚙️ Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

Ensure that Prisma migrates your SQLite database:

```bash
npx prisma migrate dev --name init
```

### 3. Seed sample data (Optional)

If you'd like to populate the database with initial sample data:

```bash
npm run db:seed
```

### 4. Run the development server

```bash
npm run dev
```

The API will be running at `http://localhost:5000`

## 📡 API Endpoints

| Method   | Endpoint                       | Description                      |
| -------- | ------------------------------ | -------------------------------- |
| `GET`    | `/api/v1/preorders`            | List all preorders (with filters, sort, pagination) |
| `POST`   | `/api/v1/preorders`            | Create a new preorder            |
| `GET`    | `/api/v1/preorders/:id`        | Get a single preorder            |
| `PATCH`  | `/api/v1/preorders/:id`        | Update a preorder                |
| `PATCH`  | `/api/v1/preorders/:id/status` | Toggle preorder status (active/inactive) |
| `DELETE` | `/api/v1/preorders/:id`        | Delete a preorder                |

## 🔍 Query Parameters (GET /api/v1/preorders)

| Parameter    | Type   | Description                              |
| ------------ | ------ | ---------------------------------------- |
| `status`     | string | Filter by status: `all`, `active`, `inactive` |
| `searchTerm` | string | Search by preorder name                  |
| `sortBy`     | string | Sort field (e.g., `name`, `products`, `startsAt`, `endsAt`) |
| `sortOrder`  | string | Sort direction: `asc` or `desc`          |
| `page`       | number | Page number (default: 1)                 |
| `limit`      | number | Items per page (default: 10)             |

## 🛠️ Environment Variables

A `.env` file should be present in the root of the backend directory. Here's a sample configuration:

```env
NODE_ENV="development"
PORT=5000
DATABASE_URL="file:./dev.db"
```
