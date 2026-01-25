"use client";

import { memo, useState, useEffect, useCallback } from "react";
import { ExternalLink, X, ChevronLeft, ChevronRight, ImageIcon, CheckCircle2, Code2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import type { Project } from "@/data/projects";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectModal = memo(function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [project]);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  }, [project.images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  }, [project.images.length]);

  const handleBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative bg-white dark:bg-zinc-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={stopPropagation}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold">{project.title}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative bg-gray-100 dark:bg-gray-800 aspect-video">
          {project.images.length > 0 ? (
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${project.images[currentImageIndex]})` }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-gray-400" />
            </div>
          )}

          {project.images.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {project.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {project.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${index === currentImageIndex ? "bg-gray-800 dark:bg-white" : "bg-gray-400 dark:bg-gray-600"}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-6">{project.fullDescription}</p>

          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">{t("projects.technologies")}</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">{t("projects.features")}</h3>
            <ul className="space-y-2">
              {project.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-gray-500 dark:text-gray-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
            >
              <Code2 className="w-4 h-4" />
              {t("projects.sourceCode")}
            </a>
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-80 transition-opacity text-sm"
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
