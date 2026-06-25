// ──────────────────────────────────────────────
// Preorder domain types
// ──────────────────────────────────────────────

export type PreorderWhen = "out-of-stock" | "regardless-of-stock";
export type PreorderStatus = "active" | "inactive";

export interface Preorder {
  id: string;
  name: string;
  products: number;
  preorderWhen: PreorderWhen;
  startsAt: string;
  endsAt: string | null;
  status: PreorderStatus;
  createdAt: string;
  updatedAt: string;
}

// ──────────────────────────────────────────────
// API request / response shapes
// ──────────────────────────────────────────────

export interface PreorderListParams {
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  meta?: PaginationMeta;
  data: T;
}

export interface CreatePreorderPayload {
  name: string;
  products: number;
  preorderWhen: PreorderWhen;
  startsAt: string;
  endsAt: string | null;
  status: PreorderStatus;
}

export interface UpdatePreorderPayload extends Partial<CreatePreorderPayload> {}
