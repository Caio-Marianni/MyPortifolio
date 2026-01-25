"use client";

import { memo } from "react";
import { ExternalLink, ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export const ProjectCard = memo(function ProjectCard({ project, onClick }: ProjectCardProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        {project.images.length > 0 ? (
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${project.images[0]})` }} />
        ) : (
          <>
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
                <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="1" />
                <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="1" />
                <line x1="29" y1="29" x2="71" y2="71" stroke="currentColor" strokeWidth="1" />
                <line x1="71" y1="29" x2="29" y2="71" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold mb-1">{project.title}</h3>
        <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && <span className="text-xs px-2 py-1 text-blue-600 dark:text-blue-400">+{project.tags.length - 4}</span>}
        </div>

        <button
          onClick={onClick}
          className="w-full py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          {t("projects.viewDetails")}
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
});
