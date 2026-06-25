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
    <div className="flex items-center justify-center gap-3 py-3 text-sm text-gray-500">
      <button
        id="pagination-prev"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={`
          p-1 rounded transition-colors duration-150
          ${page <= 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}
        `}
      >
        <HiChevronLeft className="w-4 h-4" />
      </button>

      <span className="text-gray-600 text-sm">
        Showing {from} to {to} from {total}
      </span>

      <button
        id="pagination-next"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={`
          p-1 rounded transition-colors duration-150
          ${page >= totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}
        `}
      >
        <HiChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
