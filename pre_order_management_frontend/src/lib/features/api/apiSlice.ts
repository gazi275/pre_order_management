import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Preorder,
  ApiResponse,
  PreorderListParams,
  CreatePreorderPayload,
  UpdatePreorderPayload,
} from "@/types/preorder";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",
  }),
  tagTypes: ["Preorders"],
  endpoints: (builder) => ({
    // ── List preorders (with filter / sort / pagination) ──
    getPreorders: builder.query<
      ApiResponse<Preorder[]>,
      PreorderListParams | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params) {
          if (params.status && params.status !== "all") {
            searchParams.set("status", params.status);
          }
          if (params.page) searchParams.set("page", String(params.page));
          if (params.limit) searchParams.set("limit", String(params.limit));
          if (params.sortBy) searchParams.set("sortBy", params.sortBy);
          if (params.sortOrder)
            searchParams.set("sortOrder", params.sortOrder);
          if (params.searchTerm)
            searchParams.set("searchTerm", params.searchTerm);
        }
        return `/preorders?${searchParams.toString()}`;
      },
      providesTags: ["Preorders"],
    }),

    // ── Get single preorder ──
    getPreorder: builder.query<ApiResponse<Preorder>, string>({
      query: (id) => `/preorders/${id}`,
      providesTags: ["Preorders"],
    }),

    // ── Create preorder ──
    createPreorder: builder.mutation<ApiResponse<Preorder>, CreatePreorderPayload>({
      query: (body) => ({
        url: "/preorders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Preorders"],
    }),

    // ── Update preorder ──
    updatePreorder: builder.mutation<
      ApiResponse<Preorder>,
      { id: string; data: UpdatePreorderPayload }
    >({
      query: ({ id, data }) => ({
        url: `/preorders/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Preorders"],
    }),

    // ── Toggle status ──
    togglePreorderStatus: builder.mutation<ApiResponse<Preorder>, string>({
      query: (id) => ({
        url: `/preorders/${id}/status`,
        method: "PATCH",
      }),
      invalidatesTags: ["Preorders"],
    }),

    // ── Delete preorder ──
    deletePreorder: builder.mutation<ApiResponse<Preorder>, string>({
      query: (id) => ({
        url: `/preorders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Preorders"],
    }),
  }),
});

export const {
  useGetPreordersQuery,
  useGetPreorderQuery,
  useCreatePreorderMutation,
  useUpdatePreorderMutation,
  useTogglePreorderStatusMutation,
  useDeletePreorderMutation,
} = apiSlice;
