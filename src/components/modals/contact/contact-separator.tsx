"use client";

import { memo } from "react";

interface ContactSeparatorProps {
  separatorText: string;
}

export const ContactSeparator = memo(function ContactSeparator({
  separatorText,
}: ContactSeparatorProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-px bg-[var(--frame-color)]/20" />
      <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
        {separatorText}
      </span>
      <div className="flex-1 h-px bg-[var(--frame-color)]/20" />
    </div>
  );
});
