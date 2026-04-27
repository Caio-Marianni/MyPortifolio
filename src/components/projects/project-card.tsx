"use client";

import { memo } from "react";
import Image from "next/image";
import { ExternalLink, Globe, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { formatDisplayUrl } from "@/lib/format-url";
import { LighthouseBadge } from "@/components/projects/lighthouse-badge";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

export const ProjectCard = memo(function ProjectCard({
  project,
  index,
  onClick,
}: ProjectCardProps) {
  const { t, language } = useLanguage();
  const displayUrl = formatDisplayUrl(project.demo);
  const coverImage = project.mockups[0];
  const description = project.description[language];

  return (
    <div
      onClick={onClick}
      className="group flex flex-col cursor-pointer bg-zinc-900 rounded-xl border border-zinc-800 hover:border-orange-500/40 dark:hover:border-[#31A8FF]/35 hover:shadow-xl hover:shadow-orange-500/8 dark:hover:shadow-[#31A8FF]/8 transition-all duration-300"
    >
      <div className="relative aspect-video overflow-hidden bg-zinc-800 rounded-t-xl">
        {/* Project number */}
        <div className="absolute top-3 left-3 z-10 font-mono text-xs text-white/30 select-none tabular-nums leading-none">
          {String(index + 1).padStart(2, "0")}
        </div>

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
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-700/40 border border-zinc-600/50">
              <Globe className="w-6 h-6 text-zinc-400" />
            </div>
            <span className="text-sm font-semibold text-zinc-300 select-none tracking-wide">{project.title}</span>
            <span className="text-xs text-zinc-500 font-mono">{displayUrl}</span>
          </div>
        )}

        {/* URL badge on hover */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 backdrop-blur-sm">
          {displayUrl}
          <ExternalLink className="w-3 h-3" />
        </div>

        {/* Bottom gradient for transition into content */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-zinc-900/60 to-transparent" />
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-base font-bold text-zinc-100 leading-tight">
            {project.title}
          </h3>
          {project.lighthouse && (
            <LighthouseBadge scores={project.lighthouse} />
          )}
        </div>

        <p className="text-sm text-zinc-400 mb-4 line-clamp-2 flex-1 leading-relaxed">
          {description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 font-mono bg-zinc-800 text-zinc-400 border border-zinc-700/60 rounded"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="text-xs px-2 py-0.5 text-zinc-600">
              +{project.tags.length - 4}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm text-zinc-400 border border-zinc-700/80 rounded-lg hover:text-zinc-100 hover:border-orange-500/50 dark:hover:border-[#31A8FF]/40 hover:bg-zinc-800/60 transition-all duration-200">
            {t("projects.viewDetails")}
            <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300" />
          </button>
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center px-3.5 py-2 bg-zinc-800 border border-zinc-700/80 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
            aria-label={`Visitar ${project.title}`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
});
