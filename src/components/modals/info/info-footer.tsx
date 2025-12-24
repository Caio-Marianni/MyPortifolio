"use client";

import { memo } from "react";
import { ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { InfoNavigationGrid } from "./info-navigation-grid";

interface InfoFooterProps {
  imageKey: number;
  lastCrimeLabel: string;
  lastCrimeTitle: string;
  lastCrimeUrl: string;
  victimsLabel: string;
  victimsCount: string;
  contactLabel: string;
  cvLabel: string;
  projectsLabel: string;
  experienceLabel: string;
}

export const InfoFooter = memo(function InfoFooter({
  imageKey,
  lastCrimeLabel,
  lastCrimeTitle,
  lastCrimeUrl,
  victimsLabel,
  victimsCount,
  contactLabel,
  cvLabel,
  projectsLabel,
  experienceLabel,
}: InfoFooterProps) {
  return (
    <>
      {/* Seção inferior */}
      <div key={`bottom-${imageKey}`} className="flex">
        <InfoRow
          label={lastCrimeLabel}
          value={
            <a href={lastCrimeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[var(--accent)] hover:underline font-medium">
              {lastCrimeTitle}
              <ExternalLink size={16} />
            </a>
          }
        />
        <InfoRow label={victimsLabel} value={victimsCount} />
      </div>
      <Separator />
      {/* Grid de botao 2x2 */}
      <InfoNavigationGrid contactLabel={contactLabel} cvLabel={cvLabel} projectsLabel={projectsLabel} experienceLabel={experienceLabel} />
    </>
  );
});

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex flex-col glow-uv w-[31%]">
      <span className="text-text-dark text-lg font-bold font-courier tracking-wider uppercase">{label}</span>
      <span className="text-text-dark text-base font-special opacity-80">{value}</span>
    </div>
  );
}
