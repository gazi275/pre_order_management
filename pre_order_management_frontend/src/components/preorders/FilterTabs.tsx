"use client";

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const tabs = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function FilterTabs({
  activeFilter,
  onFilterChange,
}: FilterTabsProps) {
  return (
    <div className="flex items-center gap-0 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          id={`filter-tab-${tab.value}`}
          onClick={() => onFilterChange(tab.value)}
          className={`
            px-4 py-2 text-sm font-medium transition-colors duration-150
            border-b-2 -mb-[1px]
            ${
              activeFilter === tab.value
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
