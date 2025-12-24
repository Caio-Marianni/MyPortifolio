"use client";

import { memo } from "react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import type { VideoCover } from "@/types/video-cover";

interface CoverCardProps {
  cover: VideoCover;
  priority?: boolean;
}

export const CoverCard = memo(function CoverCard({
  cover,
  priority = false,
}: CoverCardProps) {
  return (
    <article
      className={`
        group relative
        rounded-lg overflow-hidden
        border-2 border-file-border
        bg-file-bg
        transition-all duration-300
        hover:scale-[1.02] hover:shadow-xl
        theme-transition-500
      `}
      aria-label={`Video cover: ${cover.title}`}
    >
      {/* 16:9 Aspect Ratio Container */}
      <div className="relative aspect-video">
        <OptimizedImage
          src={cover.image}
          alt={`Thumbnail for ${cover.title}`}
          width={1920}
          height={1080}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />

        {/* Hover Overlay with Title (Desktop Only) */}
        <div
          className={`
            absolute inset-0
            bg-gradient-to-t from-black/80 via-black/40 to-transparent
            opacity-0 md:group-hover:opacity-100
            transition-opacity duration-300
            flex items-end p-4
          `}
        >
          <h3 className="font-courier text-white text-sm md:text-base font-bold">
            {cover.title}
          </h3>
        </div>

        {/* Tag Badges (Bottom-Left) */}
        <div
          className="absolute bottom-2 left-2 flex flex-wrap gap-1"
          aria-hidden="true"
        >
          {cover.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={`
                px-2 py-0.5 text-xs
                rounded bg-black/60 text-white
                backdrop-blur-sm
                font-courier uppercase
              `}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
});
