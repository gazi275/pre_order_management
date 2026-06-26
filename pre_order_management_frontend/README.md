# Preorder Manager — Frontend

The frontend client for the **Preorder Manager** application, built as part of the Xubitar technical assessment.  
It provides a clean, responsive UI for listing, creating, editing, and managing preorders.

---

## Tech Stack

| Layer                | Technology                     |
|----------------------|--------------------------------|
| Framework            | Next.js 16 (App Router)        |
| Language             | TypeScript                     |
| Styling              | Tailwind CSS 4                 |
| State & Data Fetching| Redux Toolkit (RTK Query)      |
| Notifications        | react-hot-toast                |
| Icons                | react-icons (Heroicons set)    |

---

## Project Structure

```
pre_order_management_frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout with Redux & Toaster providers
│   │   ├── page.tsx                   # Home page (redirects to /preorders)
│   │   ├── globals.css                # Global styles & Tailwind imports
│   │   ├── preorders/
│   │   │   ├── page.tsx               # Preorder list page
│   │   │   ├── create/
│   │   │   │   └── page.tsx           # Create preorder page
│   │   │   └── edit/
│   │   │       └── [id]/
│   │   │           └── page.tsx       # Edit preorder page (dynamic route)
│   │   └── favicon.ico
│   ├── components/
│   │   ├── preorders/
│   │   │   ├── FilterTabs.tsx         # All / Active / Inactive tab filters
│   │   │   ├── Pagination.tsx         # Page navigation controls
│   │   │   ├── PreorderForm.tsx       # Create & Edit form (shared)
│   │   │   ├── PreorderTable.tsx      # Data table with select, toggle, actions
│   │   │   └── SortDropdown.tsx       # Column sort selector
│   │   └── ui/
│   │       ├── Loader.tsx             # Loading spinner component
│   │       └── Toggle.tsx             # Active/Inactive status toggle switch
│   ├── lib/
│   │   ├── features/
│   │   │   └── api/
│   │   │       └── apiSlice.ts        # RTK Query API definitions (all endpoints)
│   │   ├── providers.tsx              # Redux store provider wrapper
│   │   └── store.ts                   # Redux store configuration
│   └── types/
│       └── preorder.ts                # TypeScript type definitions
├── public/                            # Static assets
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## Features

### 1. Preorder List Page (`/preorders`)
- Displays preorders in a data table with columns: **Name**, **Products**, **Preorder When**, **Starts At**, **Ends At**, **Status**, **Actions**.
- **Filter tabs**: Switch between All, Active, and Inactive preorders.
- **Sort dropdown**: Sort by any column in ascending or descending order.
- **Pagination**: Server-side pagination with page numbers and "Showing X to Y from Z" indicator.
- **Row selection**: Individual checkboxes per row, with a "Select All" checkbox in the header.

### 2. Status Toggle
- Each row has a toggle switch to activate or deactivate a preorder.
- Calls `PATCH /preorders/:id/status` on the backend and refetches the list via RTK Query tag invalidation.
- Uses icon-based visual feedback (green toggle for active, gray toggle for inactive).

### 3. Create & Edit Forms (`/preorders/create`, `/preorders/edit/[id]`)
- Shared `PreorderForm` component used by both create and edit pages.
- Fields: Name, Products, Preorder When (dropdown), Starts At (datetime picker), Ends At (optional datetime picker).
- On edit, form is pre-filled with the existing preorder data fetched by ID.
- Validates required fields before submission.
- Redirects back to the list page on success.

### 4. Delete
- Each row has a delete action button.
- Confirms deletion and removes the preorder from the database.
- Shows a toast notification on success/failure.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- The **Backend API** must be running (see backend `README.md`)

### 1. Install dependencies

```bash
cd pre_order_management_frontend
npm install
```

### 2. Configure the API base URL

The API base URL is configured in `src/lib/features/api/apiSlice.ts`. By default, it points to:

```ts
baseUrl: "http://localhost:5000/api/v1"
```

Update this if your backend is running on a different host or port.

### 3. Start the development server

```bash
npm run dev
```

The app will be available at **`http://localhost:4000`**.

---

## Available Scripts

| Script          | Command          | Description                                |
|-----------------|------------------|--------------------------------------------|
| `npm run dev`   | `next dev -p 4000` | Start dev server on port 4000            |
| `npm run build` | `next build`     | Create an optimized production build       |
| `npm start`     | `next start -p 4000` | Serve the production build on port 4000|
| `npm run lint`  | `eslint`         | Run ESLint checks                          |

---

## Pages & Routes

| Route                    | Description                        |
|--------------------------|------------------------------------|
| `/`                      | Redirects to `/preorders`          |
| `/preorders`             | Preorder list page with table      |
| `/preorders/create`      | Create a new preorder form         |
| `/preorders/edit/[id]`   | Edit an existing preorder form     |

---

## State Management

The app uses **RTK Query** for all server state management. There are no local Redux slices — everything is handled through the API slice with automatic caching, refetching, and tag-based invalidation.

### Defined Endpoints (in `apiSlice.ts`)

| Hook                            | Type     | Description                   |
|---------------------------------|----------|-------------------------------|
| `useGetPreordersQuery`          | Query    | Fetch paginated preorder list |
| `useGetPreorderQuery`           | Query    | Fetch a single preorder by ID |
| `useCreatePreorderMutation`     | Mutation | Create a new preorder         |
| `useUpdatePreorderMutation`     | Mutation | Update an existing preorder   |
| `useTogglePreorderStatusMutation` | Mutation | Toggle active/inactive status |
| `useDeletePreorderMutation`     | Mutation | Delete a preorder             |

All mutations automatically invalidate the `"Preorders"` cache tag, which triggers a refetch of the list.
