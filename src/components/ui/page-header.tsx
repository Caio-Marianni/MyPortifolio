import { memo } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
}

export const PageHeader = memo(function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-12">
      <h1 className="text-4xl md:text-5xl font-serif mb-4 neon-heading">{title}</h1>
      {description && <p className="text-gray-500 dark:text-gray-400 text-base max-w-2xl">{description}</p>}
    </div>
  );
});
