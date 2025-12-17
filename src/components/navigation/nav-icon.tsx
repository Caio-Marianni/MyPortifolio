"use client";

import { LucideIcon } from "lucide-react";
import { useModal, ModalSection } from "@/contexts/modal-context";
import { useAudioContext } from "@/contexts/audio-context";

interface NavIconProps {
  icon: LucideIcon;
  section: ModalSection;
  label: string;
  useFill?: boolean;
}

export function NavIcon({ icon: Icon, section, label, useFill = false }: NavIconProps) {
  const { openModal, activeModal } = useModal();
  const { play } = useAudioContext();
  const isActive = activeModal === section;

  const handleClick = () => {
    play("navbar");
    openModal(section);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative p-3 rounded-full
        transition-[background-color,opacity] duration-200
        group
        ${useFill ? "text-[#000]/30" : "text-[var(--accent)]"}
        ${
          isActive
            ? "bg-white/10"
            : `hover:bg-white/5 ${useFill ? "hover:text-[var(--accent)]/30" : ""}`
        }
      `}
      title={label}
    >
      <Icon size={24} fill={useFill ? "var(--accent)" : "none"} />

      {/* Indicador de ativo (embaixo) */}
      {isActive && (
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1 bg-[var(--accent)] rounded-t-full transition-all duration-200"
        />
      )}

      {/* Tooltip (embaixo) */}
      <div
        className={`
          absolute top-full mt-2 left-1/2 -translate-x-1/2
          px-3 py-1.5 rounded-md
          bg-[var(--bg-primary)] text-[var(--color-white)]
          text-xs whitespace-nowrap
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          pointer-events-none
          border border-[var(--frame-color)]/20
          shadow-lg
          z-50
        `}
      >
        {label}
      </div>
    </button>
  );
}
