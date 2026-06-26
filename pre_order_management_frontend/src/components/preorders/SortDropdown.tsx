"use client";

import { useState, useRef, useEffect } from "react";
import { HiArrowsUpDown } from "react-icons/hi2";

interface SortDropdownProps {
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

const sortOptions = [
  { label: "Name", value: "name" },
  { label: "Created At", value: "createdAt" },
  { label: "Starts At", value: "startsAt" },
  { label: "Ends At", value: "endsAt" },
];

export default function SortDropdown({
  sortBy,
  sortOrder,
  onSortChange,
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="sort-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          p-2 rounded-lg border transition-colors duration-150
          ${isOpen ? "border-gray-400 bg-gray-50" : "border-gray-300 hover:border-gray-400"}
        `}
        title="Sort"
      >
        <HiArrowsUpDown className="w-4 h-4 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-1">
          <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Sort by
          </div>

          <div className="space-y-0.5">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                id={`sort-option-${option.value}`}
                onClick={() => {
                  onSortChange(option.value, sortOrder);
                }}
                className={`
                  w-full text-left px-3 py-1.5 text-sm flex items-center gap-2
                  transition-colors duration-100 rounded-md
                  ${
                    sortBy === option.value
                      ? "text-gray-900 font-semibold bg-gray-50"
                      : "text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                <span
                  className={`
                    w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0
                    ${sortBy === option.value ? "border-black" : "border-gray-300"}
                  `}
                >
                  {sortBy === option.value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  )}
                </span>
                {option.label}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 my-1" />

          {/* Direction */}
          <div className="space-y-0.5">
            <button
              id="sort-direction-asc"
              onClick={() => {
                onSortChange(sortBy, "asc");
              }}
              className={`
                w-full text-left px-3 py-1.5 text-sm flex items-center gap-2
                transition-colors duration-100 rounded-md
                ${sortOrder === "asc" ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-600 hover:bg-gray-50"}
              `}
            >
              <span className="text-base font-semibold">↑</span> Ascending
            </button>
            <button
              id="sort-direction-desc"
              onClick={() => {
                onSortChange(sortBy, "desc");
              }}
              className={`
                w-full text-left px-3 py-1.5 text-sm flex items-center gap-2
                transition-colors duration-100 rounded-md
                ${sortOrder === "desc" ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-600 hover:bg-gray-50"}
              `}
            >
              <span className="text-base font-semibold">↓</span> Descending
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
