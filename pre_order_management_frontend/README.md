# Preorder Manager - Frontend

This is the frontend component for the **Preorder Manager** application, built for the Xubitar technical assessment.

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management & Data Fetching**: Redux Toolkit (RTK Query)
- **Icons**: React-Icons & Custom SVGs / Images

## ✨ Features Implemented

1. **Preorder List Page**:
   - Backend-driven pagination, sorting, and filtering (All, Active, Inactive).
   - Empty state UI when no preorders are found.
2. **Status Toggle & Delete**:
   - The Active/Inactive switch instantly updates the database, displaying a toast notification on success.
   - Delete functionality removes the record from the database and updates the UI.
3. **Selection Mechanism**:
   - Individual row selection checkboxes.
   - "Select All" functionality that toggles all rows based on current page visibility.
4. **Create & Update Forms**:
   - Validation handling.
   - Pre-fills data for existing preorders when editing.
   - Saves directly to the backend database.
5. **Navigation & Loading States**:
   - Displays clear loading indicators (skeletons and spinners) during data fetch and mutations.
   - Redirects to the preorder list upon saving, canceling, or going back.

## ⚙️ Getting Started

Before running the frontend, ensure the **Backend Server** is running on `http://localhost:5000` (see backend `README.md`).

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🛠️ Environment Variables

If your backend is running on a different port, update `.env` or `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
