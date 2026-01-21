import { memo } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
}

export const PageHeader = memo(function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
      {description && <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">{description}</p>}
    </div>
  );
});
