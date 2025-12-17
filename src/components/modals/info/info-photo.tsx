"use client";

import { memo } from "react";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface InfoPhotoProps {
  imageSrc: string;
  name: string;
  imageKey: number;
}

export const InfoPhoto = memo(function InfoPhoto({
  imageSrc,
  name,
  imageKey,
}: InfoPhotoProps) {
  return (
    <div className="flex-shrink-0 mx-auto md:mx-0">
      <div
        className={`
          relative w-48 h-56 sm:w-56 sm:h-64
          bg-[var(--bg-primary)]
          border-4 border-[var(--color-white)]
          overflow-hidden
          shadow-lg
          shadow-black/70
        `}
      >
        {/* Tachinha decorativa */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[var(--accent)] opacity-80 z-10 shadow-md" />

        <div key={imageKey} className="absolute inset-0 animate-fade-in">
          <OptimizedImage
            src={imageSrc}
            alt={name}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
});
