"use client";

import { memo } from "react";

interface AboutEvidenceProps {
  evidenceLabel: string;
  evidence: string[];
}

export const AboutEvidence = memo(function AboutEvidence({
  evidenceLabel,
  evidence,
}: AboutEvidenceProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
        {evidenceLabel}
      </h3>
      <ul className="space-y-2">
        {evidence.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--frame-color)]/10"
          >
            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[var(--accent)]/20 text-[var(--accent)] text-xs font-bold">
              {index + 1}
            </span>
            <span className="text-[var(--text-primary)]">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});
