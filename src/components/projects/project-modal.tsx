"use client";

import { memo, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink, X, CheckCircle2, Code2, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { formatDisplayUrl } from "@/lib/format-url";
import type { Project } from "@/data/projects";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectModal = memo(function ProjectModal({
  project,
  onClose,
}: ProjectModalProps) {
  const { t } = useLanguage();
  const displayUrl = formatDisplayUrl(project.demo);
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultiple = project.mockups.length > 1;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + project.mockups.length) % project.mockups.length);
  }, [project.mockups.length]);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % project.mockups.length);
  }, [project.mockups.length]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80" />

      <div
        className="relative bg-zinc-900 border border-zinc-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={stopPropagation}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-zinc-100">{project.title}</h2>
            <span className="text-xs text-zinc-500 font-mono">{displayUrl}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative bg-zinc-800 aspect-video">
          {project.mockups.length > 0 ? (
            <>
              <Image
                src={project.mockups[currentIndex]}
                alt={`Mockup ${currentIndex + 1} do projeto ${project.title}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
              />

              {hasMultiple && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                    aria-label="Próxima imagem"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {project.mockups.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i === currentIndex ? "bg-white" : "bg-white/30"
                        }`}
                        aria-label={`Ir para imagem ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <span className="text-6xl font-bold text-zinc-700 select-none">
                {project.title.charAt(0)}
              </span>
              <span className="text-sm text-zinc-600 font-mono">{displayUrl}</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
            {project.fullDescription}
          </p>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3">
              {t("projects.technologies")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3">
              {t("projects.features")}
            </h3>
            <ul className="space-y-2">
              {project.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-zinc-400"
                >
                  <CheckCircle2 className="w-4 h-4 text-zinc-600 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors text-sm"
              >
                <Code2 className="w-4 h-4" />
                {t("projects.sourceCode")}
              </a>
            )}
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-zinc-900 rounded-lg hover:opacity-80 transition-opacity text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              {t("projects.viewProject")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});
