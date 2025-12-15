"use client";

import { ReactNode, useEffect, useCallback, useState } from "react";
import { X } from "lucide-react";
import { useModal } from "@/contexts/modal-context";
import { useAudioContext } from "@/contexts/audio-context";

interface ModalBaseProps {
  children: ReactNode;
  title: string;
}

export function ModalBase({ children, title }: ModalBaseProps) {
  const { isOpen, closeModal } = useModal();
  const { play } = useAudioContext();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = useCallback(() => {
    play("close");
    setIsAnimating(true);
    setTimeout(() => {
      closeModal();
      setIsAnimating(false);
    }, 200);
  }, [play, closeModal]);

  // Fechar com ESC
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    },
    [handleClose]
  );

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        ${isVisible && !isAnimating ? "animate-fade-in" : "animate-fade-out"}
      `}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`
          relative z-10
          w-full max-w-2xl max-h-[85vh]
          bg-[var(--bg-secondary)]
          border-2 border-[var(--frame-color)]
          rounded-lg
          shadow-2xl
          overflow-hidden
          theme-transition
          ${isVisible && !isAnimating ? "animate-modal-in" : "animate-modal-out"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`
            flex items-center justify-between
            px-6 py-4
            border-b border-[var(--frame-color)]/20
            bg-[var(--bg-primary)]
          `}
        >
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            {title}
          </h2>
          <button
            onClick={handleClose}
            className={`
              p-2 rounded-full
              hover:bg-[var(--accent)]/20
              transition-colors duration-200
              text-[var(--text-secondary)] hover:text-[var(--text-primary)]
            `}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)] hide-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
