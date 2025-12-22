"use client";

import { memo } from "react";
import { X } from "lucide-react";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  rotate?: number;
}

export const ModalHeader = memo(function ModalHeader({ title, onClose, rotate = -2 }: ModalHeaderProps) {
  return (
    <div
      className={`
        relative
        flex items-center justify-between
        `}
    >
      {/* Tab */}
      <div className="font-courier text-2xl px-6 py-2 font-bold tracking-widest text-[var(--color-black)] rounded-tab z-10">
        <div className="translate-y-1 z-10 rounded-lg overflow-hidden" style={{ transform: `rotate(${rotate}deg)` }}>
          {/* Overlay de textura */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "url('/assets/images/texture/snow.png')",
              backgroundSize: "auto",
            }}
          />
          {/*  black tag */}
          <div className="bg-color-black h-3"></div>
          {/* {title} */}
          <div className="flex items-center gap-2 bg-color-white glow-uv">
            <hr className="border-color-black border-2 w-4" />
            <h2 className="translate-y-0.5">{title}</h2>
            <hr className="border-color-black border-2 w-4" />
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
          bg-file-closeBg
          theme-transition
          text-file-closeIcon
        `}
      >
        <X size={20} />
      </button>
    </div>
  );
});
