"use client";

import { ReactNode, useEffect, useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useModal } from "@/contexts/modal-context";
import { useAudioContext } from "@/contexts/audio-context";
import { ModalNavButton } from "./base/modal-nav-button";
import { ModalHeader } from "./base/modal-header";
import { ModalContent } from "./base/modal-content";
import { ModalFileWrapper } from "./base/modal-file-wrapper";

interface ModalBaseProps {
  children: ReactNode;
  title: string;
  rotate?: number;
}

export function ModalBase({ children, title, rotate }: ModalBaseProps) {
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
        fixed inset-0 z-20 flex items-start justify-center p-4 pt-[15vh]
        ${isVisible && !isAnimating ? "animate-fade-in" : "animate-fade-out"}
      `}
    >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

        <ModalNavButton direction="prev" icon={ChevronLeft} onClick={handlePrev} title="Anterior" />

        <ModalNavButton direction="next" icon={ChevronRight} onClick={handleNext} title="Próximo" />

        {/* Modal */}
        <div
          className={`
          relative
          flex flex-col
          w-full max-w-6xl md:max-w-4xl
          max-h-[calc(100vh-15vh-10vh)]
          shadow-2xl
          theme-transition-500
          will-change-transform
          ${isVisible && !isAnimating ? "animate-modal-in" : "animate-modal-out"}
        `}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader title={title} onClose={handleClose} rotate={rotate} />
          <ModalContent>{children}</ModalContent>
        </div>
    </div>
  );
}
