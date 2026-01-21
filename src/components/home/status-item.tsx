import { memo, type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";

interface StatusItemProps {
  icon: LucideIcon;
  href?: string;
  children: ReactNode;
  isLink?: boolean;
  fill?: boolean;
}

export const StatusItem = memo(function StatusItem({ icon: Icon, href, children, isLink = false, fill = false }: StatusItemProps) {
  const iconClasses = `w-4 h-4 text-gray-600 dark:text-purple-400 ${fill ? "fill-gray-400 dark:fill-purple-500/50" : ""}`;

  if (isLink && href) {
    return (
      <div className="flex items-center gap-3">
        <Icon className={iconClasses} />
        <a
          href={href}
          className="text-red-500 hover:text-red-600 dark:text-purple-400 dark:hover:text-purple-300 transition-colors tracking-wide"
        >
          {children}
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Icon className={iconClasses} />
      <span className="tracking-wide">{children}</span>
    </div>
  );
});
