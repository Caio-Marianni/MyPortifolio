"use client";

import { useEffect } from "react";
import { Download } from "lucide-react";

/* Bandeiras desenhadas inline: emoji de bandeira não renderiza no Windows (vira "BR"/"GB"). */
function FlagBR() {
  return (
    <svg viewBox="0 0 28 20" className="h-[1.15em] w-[1.65em] shrink-0" aria-hidden>
      <rect width="28" height="20" fill="#009C3B" />
      <polygon points="14,2.5 25,10 14,17.5 3,10" fill="#FFDF00" />
      <circle cx="14" cy="10" r="4.2" fill="#002776" />
    </svg>
  );
}

function FlagUK() {
  return (
    <svg viewBox="0 0 28 20" className="h-[1.15em] w-[1.65em] shrink-0" aria-hidden>
      <rect width="28" height="20" fill="#012169" />
      <path d="M0 0L28 20M28 0L0 20" stroke="#FFF" strokeWidth="4" />
      <path d="M0 0L28 20M28 0L0 20" stroke="#C8102E" strokeWidth="2" />
      <path d="M14 0V20M0 10H28" stroke="#FFF" strokeWidth="6" />
      <path d="M14 0V20M0 10H28" stroke="#C8102E" strokeWidth="3.5" />
    </svg>
  );
}

const OPTION = [
  "group flex items-center gap-[0.9em] rounded-sm px-[1em] py-[0.8em] text-left",
  "font-bold uppercase tracking-[0.12em] text-white/60",
  "transition-colors hover:bg-white/[0.07] hover:text-white",
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-white/60",
].join(" ");

const FLAG_WRAP = "grayscale opacity-70 transition duration-200 group-hover:grayscale-0 group-hover:opacity-100";

/* rail: sai da faixa preta no 16:9. sheet: sobe da base no mobile. */
const VARIANT = {
  rail: {
    panel: "absolute left-[50.2%] top-[74%] text-[clamp(10px,0.85cqw,12px)]",
    open: "visible translate-x-0 opacity-100",
    closed: "invisible -translate-x-[1cqw] opacity-0",
  },
  sheet: {
    panel: "absolute inset-x-0 bottom-0 text-[12px]",
    open: "visible translate-y-0 opacity-100",
    closed: "invisible translate-y-4 opacity-0",
  },
} as const;

interface CvPanelProps {
  open: boolean;
  onClose: () => void;
  labels: { title: string; pt: string; en: string };
  variant?: keyof typeof VARIANT;
}

export function CvPanel({ open, onClose, labels, variant = "rail" }: CvPanelProps) {
  const style = VARIANT[variant];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {open && <button type="button" className="absolute inset-0 z-20 cursor-default" onClick={onClose} aria-label="Fechar" tabIndex={-1} />}

      {/* invisible (não hidden) tira do fluxo de foco sem matar a transição */}
      <div
        className={`${style.panel} z-30 flex flex-col gap-[0.3em] bg-[#111111] p-[1em] shadow-[0_8px_28px_rgba(0,0,0,0.45)] transition-all duration-200 ease-out ${
          open ? style.open : style.closed
        }`}
        aria-hidden={!open}
      >
        <span className="flex items-center gap-[0.5em] px-[1em] pb-[0.5em] text-[0.85em] uppercase tracking-[0.2em] text-white/35">
          <Download className="h-[1em] w-[1em]" strokeWidth={2} aria-hidden />
          {labels.title}
        </span>

        <a href="/cv/caio-marianni-pt.pdf" download className={OPTION} tabIndex={open ? 0 : -1}>
          <span className={FLAG_WRAP}>
            <FlagBR />
          </span>
          {labels.pt}
        </a>

        <a href="/cv/caio-marianni-en.pdf" download className={OPTION} tabIndex={open ? 0 : -1}>
          <span className={FLAG_WRAP}>
            <FlagUK />
          </span>
          {labels.en}
        </a>
      </div>
    </>
  );
}
