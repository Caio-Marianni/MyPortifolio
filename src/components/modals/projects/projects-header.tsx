"use client";

import { memo } from "react";

interface ProjectsHeaderProps {
  count: number;
  headerLabel: string;
}

export const ProjectsHeader = memo(function ProjectsHeader({
  count,
  headerLabel,
}: ProjectsHeaderProps) {
  return (
    <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider mb-4">
      {count} {headerLabel}
    </p>
  );
});
