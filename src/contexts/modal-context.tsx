"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type ModalSection =
  | "about"
  | "info"
  | "projects"
  | "experience"
  | "skills"
  | "contact"
  | null;

// Ordem dos modais para navegação
const MODAL_ORDER: Exclude<ModalSection, null>[] = [
  "about",
  "info",
  "projects",
  "experience",
  "skills",
  "contact",
];

interface ModalContextType {
  activeModal: ModalSection;
  openModal: (section: ModalSection) => void;
  closeModal: () => void;
  nextModal: () => void;
  prevModal: () => void;
  isOpen: boolean;
  hasNext: boolean;
  hasPrev: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalSection>(null);

  const openModal = useCallback((section: ModalSection) => {
    setActiveModal(section);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const nextModal = useCallback(() => {
    if (!activeModal) return;
    const currentIndex = MODAL_ORDER.indexOf(activeModal);
    const nextIndex = (currentIndex + 1) % MODAL_ORDER.length;
    setActiveModal(MODAL_ORDER[nextIndex]);
  }, [activeModal]);

  const prevModal = useCallback(() => {
    if (!activeModal) return;
    const currentIndex = MODAL_ORDER.indexOf(activeModal);
    const prevIndex = currentIndex === 0 ? MODAL_ORDER.length - 1 : currentIndex - 1;
    setActiveModal(MODAL_ORDER[prevIndex]);
  }, [activeModal]);

  const currentIndex = activeModal ? MODAL_ORDER.indexOf(activeModal) : -1;

  return (
    <ModalContext.Provider
      value={{
        activeModal,
        openModal,
        closeModal,
        nextModal,
        prevModal,
        isOpen: activeModal !== null,
        hasNext: currentIndex < MODAL_ORDER.length - 1,
        hasPrev: currentIndex > 0,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
