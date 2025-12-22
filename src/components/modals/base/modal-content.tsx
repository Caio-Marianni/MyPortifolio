"use client";

import { memo, ReactNode } from "react";
import { ModalFileWrapper } from "./modal-file-wrapper";

interface ModalContentProps {
  children: ReactNode;
}

export const ModalContent = memo(function ModalContent({ children }: ModalContentProps) {
  return (
    <ModalFileWrapper>
      <div
        className="
          relative
          overflow-y-auto
          p-8 max-h-[calc(90vh-80px)]
          hide-scrollbar
          bg-file-bg"
      >
        {/* Overlay de textura */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/assets/images/texture/egg-shell.png')",
            backgroundSize: "auto",
          }}
        />
        {children}
      </div>
    </ModalFileWrapper>
  );
});
