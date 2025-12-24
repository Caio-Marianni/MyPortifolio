"use client";

import { memo } from "react";

interface ExperienceHeaderProps {
  headerLabel: string;
}

export const ExperienceHeader = memo(function ExperienceHeader({
  headerLabel,
}: ExperienceHeaderProps) {
  return (
    <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider">
      {headerLabel}
    </p>
  );
});
