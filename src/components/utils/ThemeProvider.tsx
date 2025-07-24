"use client";

import { useState, useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Evita renderizar tema incorreto no SSR
    return <>{children}</>;
  }

  return <NextThemesProvider attribute="class">{children}</NextThemesProvider>;
}
