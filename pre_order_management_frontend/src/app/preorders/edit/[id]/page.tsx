"use client";

import { useParams } from "next/navigation";
import { useGetPreorderQuery } from "@/lib/features/api/apiSlice";
import PreorderForm from "@/components/preorders/PreorderForm";

export default function EditPreorderPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError } = useGetPreorderQuery(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-gray-900 border-t-transparent" />
          <p className="text-sm text-gray-500">Loading preorder...</p>
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-800">
            Preorder not found
          </p>
          <p className="text-sm text-gray-500 mt-1">
            The preorder you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return <PreorderForm preorder={data.data} />;
}
