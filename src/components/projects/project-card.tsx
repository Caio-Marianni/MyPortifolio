"use client";

import { memo } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { formatDisplayUrl } from "@/lib/format-url";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export const ProjectCard = memo(function ProjectCard({
  project,
  onClick,
}: ProjectCardProps) {
  const { t } = useLanguage();
  const displayUrl = formatDisplayUrl(project.demo);
  const coverImage = project.mockups[0];

  return (
    <div
      onClick={onClick}
      className="group flex flex-col cursor-pointer bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden hover:border-zinc-600 hover:shadow-xl hover:shadow-black/40 transition-all duration-300"
    >
      <div className="relative aspect-video overflow-hidden bg-zinc-800">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={`Mockup do projeto ${project.title}`}
            fill
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <span className="text-5xl font-bold text-zinc-700 select-none">
              {project.title.charAt(0)}
            </span>
            <span className="text-xs text-zinc-600 font-mono">{displayUrl}</span>
          </div>
        )}

        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
          {displayUrl}
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="text-base font-bold text-zinc-100 leading-tight">
            {project.title}
          </h3>
          <div className="flex gap-1 shrink-0">
            {project.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <p className="text-sm text-zinc-400 mb-4 line-clamp-2 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.slice(2, 5).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-md"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 5 && (
            <span className="text-xs px-2 py-0.5 text-zinc-500">
              +{project.tags.length - 5}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button className="flex-1 py-2 text-sm text-zinc-300 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors">
            {t("projects.viewDetails")}
          </button>
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center px-3.5 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
            aria-label={`Visitar ${project.title}`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
});
