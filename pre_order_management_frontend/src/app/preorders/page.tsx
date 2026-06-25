"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetPreordersQuery } from "@/lib/features/api/apiSlice";
import FilterTabs from "@/components/preorders/FilterTabs";
import SortDropdown from "@/components/preorders/SortDropdown";
import PreorderTable from "@/components/preorders/PreorderTable";
import Pagination from "@/components/preorders/Pagination";

export default function PreordersListPage() {
  // ── Query state ──
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const limit = 10;

  // ── RTK Query ──
  const { data, isLoading, isFetching } = useGetPreordersQuery({
    status: filter,
    sortBy,
    sortOrder,
    page,
    limit,
  });

  const preorders = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, limit: 10, total: 0 };

  // Reset page when filter changes
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: "asc" | "desc") => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Preorders
          </h1>
          <Link
            href="/preorders/create"
            id="create-preorder-button"
            className="px-4 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-950 transition-colors duration-150 shadow-sm"
          >
            Create Preorder
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Filter bar + Sort */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-150 bg-white">
            <FilterTabs
              activeFilter={filter}
              onFilterChange={handleFilterChange}
            />
            <SortDropdown
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
            />
          </div>

          {/* Table */}
          <div className={`${isFetching && !isLoading ? "opacity-60" : ""} transition-opacity duration-200`}>
            <PreorderTable
              preorders={preorders}
              isLoading={isLoading}
            />
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-200">
            <Pagination meta={meta} onPageChange={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
}
