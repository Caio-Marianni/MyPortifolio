"use client";

import { memo } from "react";

interface InfoDetailsProps {
  imageKey: number;
  nameLabel: string;
  name: string;
  statusLabel: string;
  headline: string;
  servicesLabel: string;
  services: string[];
  arsenalLabel: string;
  stack: string[];
}

export const InfoDetails = memo(function InfoDetails({
  imageKey,
  nameLabel,
  name,
  statusLabel,
  headline,
  servicesLabel,
  services,
  arsenalLabel,
  stack,
}: InfoDetailsProps) {
  return (
    <div key={imageKey} className="flex-1 space-y-4 animate-fade-in">
      <InfoRow label={nameLabel} value={name} />
      <InfoRow label={statusLabel} value={headline} highlight />
      <InfoRow label={servicesLabel} value={services.join(" • ")} />
      <InfoRow
        label={arsenalLabel}
        value={
          <div className="flex flex-wrap gap-2">
            {stack.map((tech) => (
              <span
                key={tech}
                className={`
                  px-3 py-1 text-sm rounded-md
                  bg-[var(--accent)]/20 text-[var(--accent)]
                  border border-[var(--accent)]/40
                  font-medium
                `}
              >
                {tech}
              </span>
            ))}
          </div>
        }
      />
    </div>
  );
});

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}

function InfoRow({ label, value, highlight = false }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[var(--text-secondary)] text-xs font-bold tracking-wider uppercase">
        {label}
      </span>
      <span
        className={`
          text-[var(--text-primary)] text-base
          ${highlight ? "text-[var(--accent)] italic font-medium" : ""}
        `}
      >
        {value}
      </span>
    </div>
  );
}
