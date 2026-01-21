import { memo, type ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  showThemeToggle?: boolean;
}

export const PageContainer = memo(function PageContainer({ children, className = "", showThemeToggle = true }: PageContainerProps) {
  return (
    <main className={`min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 ${className}`}>
      {showThemeToggle && <div className="relative z-10"><ThemeToggle /></div>}
      <div className="container mx-auto px-6 py-16 max-w-6xl relative z-10">{children}</div>
    </main>
  );
});
