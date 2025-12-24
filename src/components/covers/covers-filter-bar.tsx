"use client";

import { memo } from "react";
import type { VideoTag } from "@/types/video-cover";

interface CoversFilterBarProps {
  tags: VideoTag[];
  activeTag: string;
  onTagChange: (tagId: string) => void;
  tagCounts: Record<string, number>;
  totalCount: number;
  filterAllLabel: string;
}

export const CoversFilterBar = memo(function CoversFilterBar({
  tags,
  activeTag,
  onTagChange,
  tagCounts,
  totalCount,
  filterAllLabel,
}: CoversFilterBarProps) {
  return (
    <nav
      className={`
        sticky top-20 z-10
        bg-bg-dark/80 backdrop-blur-md
        border-b border-border
        theme-transition-500
      `}
      aria-label="Filter covers by category"
      role="navigation"
    >
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-2 px-4 py-3 min-w-max">
          {/* All Tag */}
          <button
            role="tab"
            aria-selected={activeTag === "all"}
            aria-controls="covers-grid"
            onClick={() => onTagChange("all")}
            className={`
              px-4 py-2 rounded-full
              font-courier text-sm font-bold
              transition-all duration-200
              whitespace-nowrap
              ${
                activeTag === "all"
                  ? "bg-text-accent text-white shadow-lg"
                  : "bg-file-bg text-text-dark hover:bg-file-border theme-transition-500"
              }
            `}
          >
            {filterAllLabel} ({totalCount})
          </button>

          {/* Category Tags */}
          {tags.map((tag) => (
            <button
              key={tag.id}
              role="tab"
              aria-selected={activeTag === tag.id}
              aria-controls="covers-grid"
              onClick={() => onTagChange(tag.id)}
              className={`
                px-4 py-2 rounded-full
                font-courier text-sm font-bold
                transition-all duration-200
                whitespace-nowrap
                ${
                  activeTag === tag.id
                    ? "bg-text-accent text-white shadow-lg"
                    : "bg-file-bg text-text-dark hover:bg-file-border theme-transition-500"
                }
              `}
            >
              {tag.name} ({tagCounts[tag.id] || 0})
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
});
