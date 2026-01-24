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
  const iconClasses = `w-3 h-3 sm:w-4 sm:h-4 text-orange-500 dark:text-fuchsia-500 ${fill ? "fill-orange-950 dark:fill-fuchsia-950" : ""}`;

  if (isLink && href) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <Icon className={iconClasses} />
        <a
          href={href}
          className="text-orange-700 hover:text-orange-600 dark:text-fuchsia-400 dark:hover:text-fuchsia-300 transition-colors tracking-wide"
        >
          {children}
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Icon className={iconClasses} />
      <span className="tracking-wide">{children}</span>
    </div>
  );
});
