"use client";

import { memo } from "react";
import { SearchX } from "lucide-react";

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
}

export const EmptyState = memo(function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="rounded-full bg-file-bg p-6 mb-6">
        <SearchX size={48} className="text-text-muted" />
      </div>

      <h3 className="font-courier text-xl font-bold text-text-dark mb-2">
        {title}
      </h3>

      <p className="text-text-muted text-center mb-6 max-w-md">
        {message}
      </p>

      <button
        onClick={onAction}
        className={`
          px-6 py-3 rounded-lg
          bg-text-accent text-white
          font-courier font-bold
          transition-all duration-200
          hover:shadow-lg hover:scale-105
        `}
      >
        {actionLabel}
      </button>
    </div>
  );
});
