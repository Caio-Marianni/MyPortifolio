"use client";

import { memo } from "react";

interface FilterTabsProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export const FilterTabs = memo(function FilterTabs({ categories, selected, onSelect }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all z-20 ${
            selected === category
              ? "bg-orange-500 dark:bg-blue-600 text-white"
              : "bg-gray-900 dark:bg-zinc-800/60 text-gray-400 hover:bg-gray-800 dark:hover:bg-zinc-700/60 dark:border dark:border-zinc-700/50"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
});
