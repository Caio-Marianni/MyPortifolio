"use client";

import { motion, PanInfo } from "framer-motion";
import { useState, ReactNode, useEffect } from "react";

interface DocumentCardProps {
  children: ReactNode;
  onApprove?: () => void;
  onReject?: () => void;
  className?: string;
}

export function DocumentCard({ children, onApprove, onReject, className = "" }: DocumentCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 150;

    if (info.offset.x > threshold) {
      onApprove?.();
    } else if (info.offset.x < -threshold) {
      onReject?.();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      onApprove?.();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      onReject?.();
    }
  };

  return (
    <motion.div
      drag={prefersReducedMotion ? false : "x"}
      dragConstraints={{ left: -200, right: 200 }}
      dragElastic={0.2}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(e, info) => {
        handleDragEnd(e, info);
        setIsDragging(false);
      }}
      whileDrag={
        prefersReducedMotion
          ? {}
          : {
              scale: 1.05,
              rotate: isDragging ? 2 : 0,
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
              cursor: "grabbing",
            }
      }
      className={`paper-texture document-shadow cursor-grab active:cursor-grabbing ${className}`}
      style={{
        touchAction: "none",
      }}
      tabIndex={0}
      role="article"
      aria-label="Project document. Press left arrow to reject, right arrow to approve, or use the stamp buttons below"
      onKeyDown={handleKeyDown}
    >
      {children}
    </motion.div>
  );
}
