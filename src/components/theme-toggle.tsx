"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-gray-100 dark:bg-fuchsia-500/10 hover:bg-gray-200 dark:hover:bg-fuchsia-500/20 transition-all duration-300 backdrop-blur-sm border border-gray-300 dark:border-fuchsia-500/30"
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon className="w-5 h-5 text-gray-900" /> : <Sun className="w-5 h-5 text-cyan-300" />}
    </button>
  );
}
