"use client";

import { memo, ReactNode } from "react";

interface ModalFileWrapperProps {
  children: ReactNode;
  className?: string;
}

export const ModalFileWrapper = memo(function ModalFileWrapper({
  children,
  className = "",
}: ModalFileWrapperProps) {
  return (
    <div className={`${className} modal-file-border overflow-hidden`}>
      <div className="modal-file-border-bottom" />
      <div className="modal-file-border-left" />
      {children}
    </div>
  );
});
