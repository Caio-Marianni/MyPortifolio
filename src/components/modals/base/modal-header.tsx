"use client";

import { memo } from "react";
import { X } from "lucide-react";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  rotate?: number;
}

export const ModalHeader = memo(function ModalHeader({
  title,
  onClose,
  rotate = -2,
}: ModalHeaderProps) {
  return (
    <div
      className={`
        relative
        flex items-center justify-between
        `}
    >
      {/* Tab */}
      <div className="font-courier text-2xl px-6 py-2 font-bold tracking-widest text-[var(--color-black)] rounded-tab z-10">
        <div className="translate-y-1 z-10" style={{ transform: `rotate(${rotate}deg)` }}>
          {/*  black tag */}
          <div className="bg-[var(--color-black)] h-3 rounded-t-lg"></div>
          {/* {title} */}
          <div className="flex items-center gap-2 bg-[var(--color-white)] rounded-b-lg">
            <hr className="border-[var(--color-black)] border-2 w-4" />
            <h2 className="translate-y-0.5">{title}</h2>
            <hr className="border-[var(--color-black)] border-2 w-4" />
          </div>
        </div>
      </div>
      {/* Close Button */}
      <button
        onClick={onClose}
        className={`
          mr-1.5
          p-3 py-3
          translate-y-3.5
          bg-red-700/50
          border border-b-0 border-red-700/30
          hover:bg-red-600/50
          transition-colors duration-200
          text-white/80
        `}
      >
        <X size={20} />
      </button>
    </div>
  );
});
