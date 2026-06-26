"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiChevronLeft } from "react-icons/hi2";
import Toggle from "@/components/ui/Toggle";
import Loader from "@/components/ui/Loader";
import type {
  Preorder,
  CreatePreorderPayload,
  PreorderWhen,
} from "@/types/preorder";
import {
  useCreatePreorderMutation,
  useUpdatePreorderMutation,
} from "@/lib/features/api/apiSlice";
import toast from "react-hot-toast";

interface PreorderFormProps {
  /** If provided, we're in edit mode */
  preorder?: Preorder;
}

/**
 * Convert an ISO date string to a local datetime-local input value
 * Format: "yyyy-MM-ddTHH:mm"
 */
function toDatetimeLocal(isoStr: string | null): string {
  if (!isoStr) return "";
  const date = new Date(isoStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function PreorderForm({ preorder }: PreorderFormProps) {
  const router = useRouter();
  const isEditMode = Boolean(preorder);

  // ── Form state ──
  const [name, setName] = useState(preorder?.name ?? "");
  const [products, setProducts] = useState(preorder?.products ?? 1);
  const [preorderWhen, setPreorderWhen] = useState<PreorderWhen>(
    preorder?.preorderWhen ?? "regardless-of-stock"
  );
  const [startsAt, setStartsAt] = useState(
    preorder?.startsAt ? toDatetimeLocal(preorder.startsAt) : ""
  );
  const [endsAt, setEndsAt] = useState(
    preorder?.endsAt ? toDatetimeLocal(preorder.endsAt) : ""
  );
  const [status, setStatus] = useState(
    preorder?.status === "active" || !preorder
  );

  // Sync form if preorder prop changes (e.g. when data loads)
  useEffect(() => {
    if (preorder) {
      setName(preorder.name);
      setProducts(preorder.products);
      setPreorderWhen(preorder.preorderWhen);
      setStartsAt(toDatetimeLocal(preorder.startsAt));
      setEndsAt(preorder.endsAt ? toDatetimeLocal(preorder.endsAt) : "");
      setStatus(preorder.status === "active");
    }
  }, [preorder]);

  // ── Mutations ──
  const [createPreorder, { isLoading: isCreating }] =
    useCreatePreorderMutation();
  const [updatePreorder, { isLoading: isUpdating }] =
    useUpdatePreorderMutation();
  const isSaving = isCreating || isUpdating;

  // ── Submit handler ──
  const handleSubmit = async () => {
    // Validate
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!startsAt) {
      toast.error("Start date is required");
      return;
    }

    const payload: CreatePreorderPayload = {
      name: name.trim(),
      products,
      preorderWhen,
      startsAt: new Date(startsAt).toISOString(),
      endsAt: endsAt ? new Date(endsAt).toISOString() : null,
      status: status ? "active" : "inactive",
    };

    try {
      if (isEditMode && preorder) {
        await updatePreorder({ id: preorder.id, data: payload }).unwrap();
        toast.success("Preorder updated successfully");
      } else {
        await createPreorder(payload).unwrap();
        toast.success("Preorder created successfully");
      }
      router.push("/preorders");
    } catch {
      toast.error(
        isEditMode ? "Failed to update preorder" : "Failed to create preorder"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <button
            id="back-button"
            onClick={() => router.push("/preorders")}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150 shadow-sm"
          >
            <HiChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {/* Top buttons removed per user request */}
        </div>
      </div>

      {/* Form card */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="pb-6 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">
              Preorder details
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              These values appear in the preorders list.
            </p>
          </div>

          {/* Fields */}
          <div className="divide-y divide-gray-200">
            {/* Name */}
            <div className="grid grid-cols-[280px_1fr] gap-4 items-start py-6">
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Name<span className="text-red-500 ml-0.5">*</span>
                </label>
                <p className="text-xs text-gray-400 mt-0.5 max-w-[240px]">
                  A label to recognize this preorder by.
                </p>
              </div>
              <input
                id="field-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter preorder name"
                className="max-w-md w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-colors"
              />
            </div>

            {/* Products */}
            <div className="grid grid-cols-[280px_1fr] gap-4 items-start py-6">
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Products
                </label>
                <p className="text-xs text-gray-400 mt-0.5 max-w-[240px]">
                  Number of products covered by this preorder.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="field-products"
                  type="number"
                  min={0}
                  value={products}
                  onChange={(e) =>
                    setProducts(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-colors animate-none"
                />
                <span className="text-sm text-gray-500 font-medium">product(s)</span>
              </div>
            </div>

            {/* Preorder when */}
            <div className="grid grid-cols-[280px_1fr] gap-4 items-start py-6">
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Preorder when
                </label>
                <p className="text-xs text-gray-400 mt-0.5 max-w-[240px]">
                  When customers are allowed to preorder.
                </p>
              </div>
              <select
                id="field-preorder-when"
                value={preorderWhen}
                onChange={(e) =>
                  setPreorderWhen(e.target.value as PreorderWhen)
                }
                className="max-w-md w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-colors appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="regardless-of-stock">
                  regardless-of-stock
                </option>
                <option value="out-of-stock">out-of-stock</option>
              </select>
            </div>

            {/* Starts at */}
            <div className="grid grid-cols-[280px_1fr] gap-4 items-start py-6">
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Starts at
                </label>
                <p className="text-xs text-gray-400 mt-0.5 max-w-[240px]">
                  When the preorder window opens.
                </p>
              </div>
              <input
                id="field-starts-at"
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="max-w-md w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-colors"
              />
            </div>

            {/* Ends at */}
            <div className="grid grid-cols-[280px_1fr] gap-4 items-start py-6">
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Ends at
                </label>
                <p className="text-xs text-gray-400 mt-0.5 max-w-[240px]">
                  Leave empty for no end date.
                </p>
              </div>
              <input
                id="field-ends-at"
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="max-w-md w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-colors"
              />
            </div>

            {/* Status */}
            <div className="grid grid-cols-[280px_1fr] gap-4 items-start py-6">
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Status
                </label>
                <p className="text-xs text-gray-400 mt-0.5 max-w-[240px]">
                  Active preorders are visible to customers.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Toggle
                  id="field-status-toggle"
                  enabled={status}
                  onChange={setStatus}
                />
                <span className="text-sm text-gray-700 font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            id="cancel-button-bottom"
            onClick={() => router.push("/preorders")}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150 shadow-sm"
          >
            Cancel
          </button>
          <button
            id="save-button-bottom"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-955 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center shadow-sm"
          >
            {isSaving ? (
              <>
                <Loader size="sm" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
