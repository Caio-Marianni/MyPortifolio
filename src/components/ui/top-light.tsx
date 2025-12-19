"use client";

export function TopLight() {
  return (
    <div
      className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[60%] pointer-events-none z-50 theme-transition-800"
      style={{
        background: `radial-gradient(ellipse at top, var(--light-glow) 0%, transparent 70%)`,
      }}
    />
  );
}
