"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";
import Toggle from "@/components/ui/Toggle";
import type { Preorder } from "@/types/preorder";
import {
  useTogglePreorderStatusMutation,
  useDeletePreorderMutation,
} from "@/lib/features/api/apiSlice";
import toast from "react-hot-toast";

interface PreorderTableProps {
  preorders: Preorder[];
  isLoading: boolean;
}

/**
 * Format a date string to match the screenshot format:
 * "Dec 15, 2025 08:24 PM"
 */
function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function PreorderTable({
  preorders,
  isLoading,
}: PreorderTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [toggleStatus] = useTogglePreorderStatusMutation();
  const [deletePreorder] = useDeletePreorderMutation();

  // ── Checkbox logic ──
  const allSelected =
    preorders.length > 0 && selectedIds.size === preorders.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(preorders.map((p) => p.id)));
    }
  };

  const handleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // ── Status toggle ──
  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus(id).unwrap();
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  // ── Delete ──
  const handleDelete = async (id: string) => {
    try {
      await deletePreorder(id).unwrap();
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast.success("Preorder deleted");
    } catch {
      toast.error("Failed to delete preorder");
    }
  };

  // ── Loading skeleton ──
  if (isLoading) {
    return (
      <div className="animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-12 bg-gray-100 rounded mb-1"
          />
        ))}
      </div>
    );
  }

  // ── Empty state ──
  if (preorders.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <svg
          className="mx-auto mb-4 w-12 h-12 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="text-sm font-medium text-gray-500">No preorders found</p>
        <p className="text-xs text-gray-400 mt-1">
          Create a preorder to get started
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" id="preorder-table">
        {/* Header */}
        <thead>
          <tr className="border-b border-gray-200">
            <th className="w-10 py-3.5 px-4 text-left">
              <input
                id="select-all-checkbox"
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500 cursor-pointer"
              />
            </th>
            <th className="py-3.5 px-4 text-left font-semibold text-gray-500">
              Name
            </th>
            <th className="py-3.5 px-4 text-left font-semibold text-gray-500">
              Products
            </th>
            <th className="py-3.5 px-4 text-left font-semibold text-gray-500">
              Preorder when
            </th>
            <th className="py-3.5 px-4 text-left font-semibold text-gray-500">
              Starts at
            </th>
            <th className="py-3.5 px-4 text-left font-semibold text-gray-500">
              Ends at
            </th>
            <th className="py-3.5 px-4 text-left font-semibold text-gray-500">
              Status
            </th>
            <th className="py-3.5 px-4 text-left font-semibold text-gray-500">
              Actions
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {preorders.map((preorder) => (
            <tr
              key={preorder.id}
              className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-100"
            >
              {/* Checkbox */}
              <td className="py-3.5 px-4">
                <input
                  type="checkbox"
                  checked={selectedIds.has(preorder.id)}
                  onChange={() => handleSelectRow(preorder.id)}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500 cursor-pointer"
                />
              </td>

              {/* Name */}
              <td className="py-3.5 px-4 font-bold text-gray-900">
                {preorder.name}
              </td>

              {/* Products */}
              <td className="py-3.5 px-4 text-gray-600">{preorder.products}</td>

              {/* Preorder when */}
              <td className="py-3.5 px-4 text-gray-600">
                {preorder.preorderWhen}
              </td>

              {/* Starts at */}
              <td className="py-3.5 px-4 text-gray-600">
                {formatDate(preorder.startsAt)}
              </td>

              {/* Ends at */}
              <td className="py-3.5 px-4 text-gray-600">
                {formatDate(preorder.endsAt)}
              </td>

              {/* Status */}
              <td className="py-3.5 px-4">
                <Toggle
                  id={`status-toggle-${preorder.id}`}
                  enabled={preorder.status === "active"}
                  onChange={() => handleToggleStatus(preorder.id)}
                />
              </td>

              {/* Actions */}
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-2">
                  <button
                    id={`edit-preorder-${preorder.id}`}
                    onClick={() =>
                      router.push(`/preorders/edit/${preorder.id}`)
                    }
                    className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors duration-150 shadow-sm"
                    title="Edit"
                  >
                    <HiOutlinePencil className="w-4 h-4" />
                  </button>
                  <button
                    id={`delete-preorder-${preorder.id}`}
                    onClick={() => handleDelete(preorder.id)}
                    className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors duration-150 shadow-sm"
                    title="Delete"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
