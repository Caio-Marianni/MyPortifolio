"use client";

import { memo } from "react";

interface SkillsHeaderProps {
  headerLabel: string;
}

export const SkillsHeader = memo(function SkillsHeader({
  headerLabel,
}: SkillsHeaderProps) {
  return (
    <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider">
      {headerLabel}
    </p>
  );
});
