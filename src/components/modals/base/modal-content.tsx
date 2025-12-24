"use client";

import { memo, ReactNode } from "react";
import { ModalFileWrapper } from "./modal-file-wrapper";

interface ModalContentProps {
  children: ReactNode;
}

export const ModalContent = memo(function ModalContent({ children }: ModalContentProps) {
  return (
    <ModalFileWrapper className="flex flex-col flex-1 min-h-0">
      {/* Container scrollável com textura que rola junto */}
      <div
        className="
          relative
          overflow-y-auto
          overflow-x-hidden
          p-8
          bg-file-bg
          hide-scrollbar
          flex-1"
        style={{
          borderRadius: '0 8px 8px 8px',
          backgroundImage: "url('/assets/images/texture/egg-shell.png')",
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat',
        }}
      >
        {children}
      </div>
    </ModalFileWrapper>
  );
});
