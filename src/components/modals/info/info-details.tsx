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
      <InfoRow label={statusLabel} value={headline} />
      <InfoRow label={servicesLabel} value={services.join(" • ")} />
      <InfoRow
        notHighlight
        label={arsenalLabel}
        value={
          <div className="flex flex-wrap gap-2">
            {stack.map((tech) => {

              return (
                <span
                  key={tech}
                  className={`
                    px-3 py-1 text-sm rounded-sm
                    bg-bg-board text-text-light font-courier
                  `}
                >
                  {tech}
                </span>
              );
            })}
          </div>
        }
      />
    </div>
  );
});

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  notHighlight?: boolean;
}

function InfoRow({ label, value, notHighlight = false }: InfoRowProps) {
  return (
    <div className="flex flex-col">
      <span className="text-text-dark text-lg font-bold font-courier tracking-wider uppercase glow-uv">
        {label}
      </span>
      <span
        className={`
          text-text-dark text-base font-special
          ${notHighlight ? "" : "glow-uv"}
        `}
      >
        {value}
      </span>
    </div>
  );
}
