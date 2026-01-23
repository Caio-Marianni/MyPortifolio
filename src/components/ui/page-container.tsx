import { memo, type ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  showThemeToggle?: boolean;
}

export const PageContainer = memo(function PageContainer({ children, className = "", showThemeToggle = true }: PageContainerProps) {
  return (
    <main className={`min-h-screen bg-black text-white ${className}`}>
      {/* Background */}
      <div className="absolute h-full w-full bg-[radial-gradient(#ffffff_.1px,transparent_.8px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      {showThemeToggle && (
        <div className="relative z-10">
          <ThemeToggle />
        </div>
      )}

      <div className="container mx-auto px-6 py-16 max-w-6xl relative z-10">{children}</div>
    </main>
  );
});
