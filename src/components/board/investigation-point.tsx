"use client";

import { useModal, ModalSection } from "@/contexts/modal-context";
import { useAudioContext } from "@/contexts/audio-context";
import { calculatePointPosition } from "@/lib/pseudo-random";

interface InvestigationPointProps {
  id: ModalSection;
  basePosition: { x: number; y: number };
  seed: number;
  label: string;
}

export function InvestigationPoint({
  id,
  basePosition,
  seed,
  label,
}: InvestigationPointProps) {
  const { openModal } = useModal();
  const { play } = useAudioContext();

  const position = calculatePointPosition(basePosition, seed);

  const handleClick = () => {
    play("open");
    openModal(id);
  };

  return (
    <button
      className="absolute z-10 group animate-scale-in"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={handleClick}
    >
      {/* Ponto principal */}
      <div
        className={`
          w-6 h-6 rounded-full theme-transition
          bg-[var(--point-color)]
          animate-point-pulse
          cursor-pointer
          hover:scale-125
          active:scale-95
          transition-transform duration-150
        `}
      />

      {/* Tooltip com label */}
      <div
        className={`
          absolute left-1/2 -translate-x-1/2 -top-10
          px-3 py-1 rounded-md
          bg-[var(--bg-secondary)] text-[var(--text-primary)]
          text-sm whitespace-nowrap
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          pointer-events-none
          border border-[var(--frame-color)]/20
        `}
      >
        {label}
      </div>

      {/* Pin/tachinha visual */}
      <div
        className={`
          absolute -top-1 left-1/2 -translate-x-1/2
          w-2 h-2 rounded-full
          bg-[var(--frame-color)]
          opacity-60
        `}
      />
    </button>
  );
}
