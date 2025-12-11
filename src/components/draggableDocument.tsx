"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DraggableDocumentProps {
  children: ReactNode;
  title: string;
  onClose: () => void;
  initialX?: number;
  initialY?: number;
}

export function DraggableDocument({
  children,
  title,
  onClose,
  initialX = 0,
  initialY = 0
}: DraggableDocumentProps) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -5, x: initialX, y: initialY }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 5, opacity: 0 }}
      drag
      dragMomentum={false}
      dragElastic={0}
      className="absolute paper-texture document-shadow pixel-art border-4 border-passport-tan bg-passport-paper cursor-move select-none"
      style={{
        width: "400px",
        maxHeight: "500px",
        zIndex: 10,
      }}
    >
      {/* Document Header */}
      <div className="bg-passport-beige border-b-2 border-passport-tan p-3 flex items-center justify-between cursor-move">
        <h3 className="font-pixel text-xs text-office-desk pixel-font uppercase">
          {title}
        </h3>
        <button
          onClick={onClose}
          className="w-6 h-6 bg-stamp-rejected hover:bg-stamp-rejected/80 border-2 border-stamp-ink flex items-center justify-center text-passport-paper font-bold"
        >
          ✕
        </button>
      </div>

      {/* Document Content */}
      <div className="p-6 overflow-y-auto" style={{ maxHeight: "420px" }}>
        {children}
      </div>
    </motion.div>
  );
}
