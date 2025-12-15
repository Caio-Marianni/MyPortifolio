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

interface ModalContextType {
  activeModal: ModalSection;
  openModal: (section: ModalSection) => void;
  closeModal: () => void;
  isOpen: boolean;
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

  return (
    <ModalContext.Provider
      value={{
        activeModal,
        openModal,
        closeModal,
        isOpen: activeModal !== null,
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
