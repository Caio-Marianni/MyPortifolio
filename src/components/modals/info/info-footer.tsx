"use client";

import { memo } from "react";
import { ExternalLink, Mail } from "lucide-react";

interface InfoFooterProps {
  imageKey: number;
  lastCrimeLabel: string;
  lastCrimeTitle: string;
  lastCrimeUrl: string;
  victimsLabel: string;
  victimsCount: string;
  contactButton: string;
  onContactClick: () => void;
}

export const InfoFooter = memo(function InfoFooter({
  imageKey,
  lastCrimeLabel,
  lastCrimeTitle,
  lastCrimeUrl,
  victimsLabel,
  victimsCount,
  contactButton,
  onContactClick,
}: InfoFooterProps) {
  return (
    <>
      {/* Seção inferior */}
      <div
        key={`bottom-${imageKey}`}
        className="space-y-4 pt-4 border-t border-[var(--frame-color)]/20 animate-fade-in"
      >
        <InfoRow
          label={lastCrimeLabel}
          value={
            <a
              href={lastCrimeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                inline-flex items-center gap-1.5
                text-[var(--accent)] hover:underline
                font-medium
              `}
            >
              {lastCrimeTitle}
              <ExternalLink size={16} />
            </a>
          }
        />
        <InfoRow label={victimsLabel} value={victimsCount} />
      </div>

      {/* Botão de contato */}
      <div className="pt-6">
        <button
          onClick={onContactClick}
          className={`
            w-full py-4 px-6 rounded-lg
            bg-[var(--accent)] text-white
            font-semibold text-base
            flex items-center justify-center gap-2
            hover:opacity-90
            transition-all duration-200
            shadow-lg shadow-[var(--accent)]/20
          `}
        >
          <Mail size={20} />
          {contactButton}
        </button>
      </div>
    </>
  );
});

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[var(--text-secondary)] text-xs font-bold tracking-wider uppercase">
        {label}
      </span>
      <span className="text-[var(--text-primary)] text-base">{value}</span>
    </div>
  );
}
