"use client";

import { useUVMode } from "@/contexts/uv-mode-context";

export function TopLight() {
  const { isUV } = useUVMode();

  return (
    <div
      className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl ${
        isUV ? "h-[20%]" : "h-[60%]"
      } pointer-events-none z-30 transition-all duration-200`}
      style={{
        background: `radial-gradient(ellipse at top, var(--light-glow) 0%, transparent 70%)`,
      }}
    />
  );
}
