"use client";

export function TopLight() {
  return (
    <div
      className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 pointer-events-none z-50 theme-transition"
      style={{
        background: `radial-gradient(ellipse at top, var(--light-glow) 0%, transparent 70%)`,
      }}
    />
  );
}
