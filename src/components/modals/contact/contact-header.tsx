"use client";

import { memo } from "react";

interface ContactHeaderProps {
  headerLabel: string;
}

export const ContactHeader = memo(function ContactHeader({
  headerLabel,
}: ContactHeaderProps) {
  return (
    <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider">
      {headerLabel}
    </p>
  );
});
