"use client";

import { memo } from "react";

interface AboutTestimonyProps {
  testimonyLabel: string;
  description: string[];
}

export const AboutTestimony = memo(function AboutTestimony({
  testimonyLabel,
  description,
}: AboutTestimonyProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
        {testimonyLabel}
      </h3>
      <div className="p-4 rounded-lg bg-[var(--bg-primary)] border border-[var(--frame-color)]/20 space-y-3">
        {description.map((paragraph, index) => (
          <p key={index} className="text-[var(--text-primary)] leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
});
