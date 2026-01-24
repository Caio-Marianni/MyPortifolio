import { memo, type ReactNode } from "react";
import { ToggleButtons } from "@/components/toggle-buttons";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  showToggles?: boolean;
}

export const PageContainer = memo(function PageContainer({ children, className = "", showToggles = true }: PageContainerProps) {
  return (
    <main className={`min-h-screen bg-black text-white ${className}`}>
      {/* Background */}
      <div className="absolute h-full w-full bg-grid [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {showToggles && <ToggleButtons />}

      <div className="container mx-auto px-6 py-16 max-w-6xl relative z-10">{children}</div>
    </main>
  );
});
