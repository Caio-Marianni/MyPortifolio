"use client";

import { memo } from "react";
import { LucideIcon } from "lucide-react";

interface ModalNavButtonProps {
  direction: "prev" | "next";
  icon: LucideIcon;
  onClick: () => void;
  title: string;
}

export const ModalNavButton = memo(function ModalNavButton({
  direction,
  icon: Icon,
  onClick,
  title,
}: ModalNavButtonProps) {
  const positionClass = direction === "prev" ? "left-0 border-l-0 rounded-r-xl" : "right-0 border-r-0 rounded-l-xl";

  return (
    <button
      onClick={onClick}
      className={`
        absolute ${positionClass} top-1/2 -translate-y-1/2 z-20
        px-2 py-12
        bg-[var(--bg-board)]
        text-[var(--color-white)] hover:text-white/30
        border border-black/80
        transition-all duration-200
      `}
      title={title}
    >
      <Icon size={24} />
    </button>
  );
});
