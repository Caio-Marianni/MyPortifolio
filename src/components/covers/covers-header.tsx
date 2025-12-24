"use client";

import { memo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface CoversHeaderProps {
  title: string;
  subtitle: string;
  backToHomeLabel: string;
  totalCovers: number;
  totalCategories: number;
  coversCountLabel: string;
  categoriesCountLabel: string;
}

export const CoversHeader = memo(function CoversHeader({
  title,
  subtitle,
  backToHomeLabel,
  totalCovers,
  totalCategories,
  coversCountLabel,
  categoriesCountLabel,
}: CoversHeaderProps) {
  return (
    <div className="relative pt-24 pb-8 px-4 md:px-8">
      {/* Back Button */}
      <Link
        href="/"
        className={`
          inline-flex items-center gap-2
          mb-6
          px-4 py-2 rounded-lg
          bg-file-bg text-text-dark
          font-courier font-bold text-sm
          transition-all duration-200
          hover:bg-file-border
          theme-transition-500
        `}
      >
        <ArrowLeft size={16} />
        <span>{backToHomeLabel}</span>
      </Link>

      {/* Header with File Tab Aesthetic */}
      <div className="relative">
        <div className="text-4xl md:text-5xl font-bold tracking-widest text-color-black rounded-tab z-10">
          <div className="translate-y-1 z-10 rounded-lg overflow-hidden">
            {/* Texture Overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "url('/assets/images/texture/snow.png')",
                backgroundSize: "auto",
              }}
            />

            {/* Black Tag */}
            <div className="bg-color-black h-3"></div>

            {/* Title */}
            <div className="flex items-center gap-4 bg-color-white glow-uv px-6 py-3">
              <hr className="border-color-black border-2 w-6" />
              <h1 className="translate-y-0.5 font-courier">{title}</h1>
              <hr className="border-color-black border-2 w-6" />
            </div>
          </div>
        </div>

        {/* Subtitle and Stats */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="font-special text-lg text-text-muted">{subtitle}</p>

          <div className="flex items-center gap-6 font-courier text-sm text-text-muted">
            <span>
              {totalCovers} {coversCountLabel}
            </span>
            <span className="text-border">|</span>
            <span>
              {totalCategories} {categoriesCountLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
