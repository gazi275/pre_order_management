"use client";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import type { PaginationMeta } from "@/types/preorder";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, limit, total } = meta;
  const totalPages = Math.ceil(total / limit);
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  if (total === 0) return null;

  return (
    <div className="flex items-center justify-center gap-3 py-3 text-sm text-gray-500 bg-gray-50">
      <button
        id="pagination-prev"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={`
          p-1.5 rounded-lg border transition-all duration-150 shadow-sm
          ${page <= 1 ? "border-gray-200 text-gray-300 bg-gray-50/50 cursor-not-allowed" : "border-gray-300 text-gray-500 bg-white hover:bg-gray-50 hover:text-gray-700"}
        `}
      >
        <HiChevronLeft className="w-4 h-4" />
      </button>

      <span className="text-gray-700 text-sm font-semibold">
        Showing {from} to {to} from {total}
      </span>

      <button
        id="pagination-next"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={`
          p-1.5 rounded-lg border transition-all duration-150 shadow-sm
          ${page >= totalPages ? "border-gray-200 text-gray-300 bg-gray-50/50 cursor-not-allowed" : "border-gray-300 text-gray-500 bg-white hover:bg-gray-50 hover:text-gray-700"}
        `}
      >
        <HiChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
