"use client";

import { useState } from "react";
import { ExternalLink, Github, ChevronDown, ChevronUp } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useAudioContext } from "@/contexts/audio-context";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  status: string;
}

interface ProjectCardProps {
  project: Project;
  statusConfig: Record<string, { label: string; className: string }>;
  evidenceLabel: string;
  viewProjectButton: string;
  codeButton: string;
}

export function ProjectCard({
  project,
  statusConfig,
  evidenceLabel,
  viewProjectButton,
  codeButton,
}: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { play } = useAudioContext();

  const handleToggle = () => {
    play("navbar");
    setIsExpanded(!isExpanded);
  };

  const status = statusConfig[project.status] || {
    label: project.status,
    className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  return (
    <div className="rounded-lg overflow-hidden bg-[var(--bg-primary)] border border-[var(--frame-color)]/20 transition-all duration-300">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-[var(--frame-color)]/5 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            {project.id.toUpperCase()}
          </span>
          <h3 className="font-semibold text-[var(--text-primary)]">
            {project.title}
          </h3>
          <span className={`px-2 py-0.5 text-xs rounded border ${status.className}`}>
            {status.label}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp size={20} className="text-[var(--text-secondary)]" />
        ) : (
          <ChevronDown size={20} className="text-[var(--text-secondary)]" />
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 pt-0 space-y-4">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-[var(--frame-color)]/20">
            <OptimizedImage
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-xs font-mono text-white">
              {evidenceLabel}
            </div>
          </div>

          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity duration-200"
              >
                <ExternalLink size={14} />
                {viewProjectButton}
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--frame-color)]/20 text-[var(--text-primary)] text-sm font-medium hover:bg-[var(--frame-color)]/30 transition-colors duration-200 border border-[var(--frame-color)]/20"
              >
                <Github size={14} />
                {codeButton}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
