"use client";

import { memo } from "react";
import { CoverCard } from "./cover-card";
import type { VideoCover } from "@/types/video-cover";

interface CoversGridProps {
  covers: VideoCover[];
}

export const CoversGrid = memo(function CoversGrid({ covers }: CoversGridProps) {
  return (
    <div
      id="covers-grid"
      className={`
        grid gap-4 md:gap-6 lg:gap-8
        grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
        auto-rows-fr
        px-4 md:px-8 py-6
      `}
    >
      {covers.map((cover) => (
        <CoverCard
          key={cover.id}
          cover={cover}
          priority={cover.priority}
        />
      ))}
    </div>
  );
});
