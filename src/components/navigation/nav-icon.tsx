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
        theme-transition-200
        group
        ${useFill ? "text-black/30" : `${isActive ? "text-on" : "text-off"}`}
      `}
      title={label}
    >
      <Icon size={24} fill={useFill ? (isActive ? "var(--on)" : "var(--off)") : "none"} className={`${isActive ? "glow" : ""} transition-all`} />

      {/* Tooltip (embaixo) */}
      <div
        className={`
          absolute top-full left-1/2 -translate-x-1/2
          px-3 py-1.5 rounded-md
          bg-board-bg text-on
          text-xs whitespace-nowrap
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          pointer-events-none
          border border-off
          shadow-lg
          z-50
        `}
      >
        {label}
      </div>
    </button>
  );
}
