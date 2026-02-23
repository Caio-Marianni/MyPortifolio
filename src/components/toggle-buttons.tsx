"use client";

import { Lightbulb, LightbulbOff } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { useLanguage } from "@/contexts/language-context";

interface ToggleButtonsProps {
  showThemeToggle?: boolean;
}

export function ToggleButtons({ showThemeToggle = true }: ToggleButtonsProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  const buttonClasses =
    "flex-1 flex items-center justify-center py-2 text-sm font-mono font-bold transition-all duration-300";

  return (
    <div className="fixed right-6 bottom-auto top-4 md:right-6 z-[100] flex rounded-full overflow-hidden backdrop-blur-lg bg-neutral-400/30 dark:bg-fuchsia-500/10 border-t border-t-white/30 dark:border-fuchsia-500/30 shadow-sm shadow-white/30 dark:shadow-fuchsia-300/20">
      <button
        onClick={toggleLanguage}
        className={`${buttonClasses} px-3 text-white/80 dark:text-cyan-300 hover:bg-neutral-500/30 dark:hover:bg-fuchsia-500/20`}
        aria-label="Toggle language"
      >
        {language.toUpperCase()}
      </button>
      {showThemeToggle && (
        <>
          <div className="w-px bg-neutral-600/50 dark:bg-fuchsia-500/30" />
          <button
            onClick={toggleTheme}
            className={`${buttonClasses} px-3 text-gray-900 dark:text-cyan-300 hover:bg-neutral-500/30 dark:hover:bg-fuchsia-500/20`}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Lightbulb className="w-4 h-4 text-purple-400" fill="currentColor" /> : <LightbulbOff className="w-4 h-4" />}
          </button>
        </>
      )}
    </div>
  );
}
