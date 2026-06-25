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
    <div className="flex items-center gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          id={`filter-tab-${tab.value}`}
          onClick={() => onFilterChange(tab.value)}
          className={`
            px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors duration-150
            ${
              activeFilter === tab.value
                ? "bg-gray-100 text-gray-900"
                : "text-gray-500 hover:text-gray-900 bg-transparent"
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

