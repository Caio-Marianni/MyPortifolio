"use client";

import { ReactNode, useEffect, useCallback, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useModal } from "@/contexts/modal-context";
import { useAudioContext } from "@/contexts/audio-context";

interface ModalBaseProps {
  children: ReactNode;
  title: string;
}

export function ModalBase({ children, title }: ModalBaseProps) {
  const { isOpen, closeModal, nextModal, prevModal } = useModal();
  const { play } = useAudioContext();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = useCallback(() => {
    play("close");
    setIsAnimating(true);
    setTimeout(() => {
      closeModal();
      setIsAnimating(false);
    }, 250);
  }, [play, closeModal]);

  const handleNext = useCallback(() => {
    play("navbar");
    nextModal();
  }, [play, nextModal]);

  const handlePrev = useCallback(() => {
    play("navbar");
    prevModal();
  }, [play, prevModal]);

  // Fechar com ESC, navegar com setas
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    },
    [handleClose, handleNext, handlePrev]
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
        fixed inset-0 z-40 flex items-center justify-center p-4 pt-20
        ${isVisible && !isAnimating ? "animate-fade-in" : "animate-fade-out"}
      `}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Botão anterior */}
      <button
        onClick={handlePrev}
        className={`
          absolute left-4 top-1/2 -translate-y-1/2 z-20
          p-3 rounded-full
          bg-[var(--bg-secondary)]/80 backdrop-blur-sm
          text-[var(--text-secondary)] hover:text-[var(--text-primary)]
          border border-[var(--frame-color)]/20
          hover:bg-[var(--bg-secondary)]
          transition-all duration-200
          hover:scale-110 active:scale-95
        `}
        title="Anterior"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Botão próximo */}
      <button
        onClick={handleNext}
        className={`
          absolute right-4 top-1/2 -translate-y-1/2 z-20
          p-3 rounded-full
          bg-[var(--bg-secondary)]/80 backdrop-blur-sm
          text-[var(--text-secondary)] hover:text-[var(--text-primary)]
          border border-[var(--frame-color)]/20
          hover:bg-[var(--bg-secondary)]
          transition-all duration-200
          hover:scale-110 active:scale-95
        `}
        title="Próximo"
      >
        <ChevronRight size={24} />
      </button>

      {/* Modal */}
      <div
        className={`
          relative z-10
          w-full max-w-2xl max-h-[75vh]
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
        <div className="p-6 overflow-y-auto max-h-[calc(75vh-80px)] hide-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
