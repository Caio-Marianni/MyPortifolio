"use client";

import { projects } from "../../core/constants";

export function ProjectsSection() {
  // Show only first 3 projects as highlights
  const highlightedProjects = projects.slice(0, 3);

  return (
    <div className="space-y-4 font-document text-sm text-office-desk">
      <div>
        <h4 className="font-bold text-base mb-3">Featured Projects</h4>
      </div>

      {highlightedProjects.map((project) => {
        const Icon = project.icon;
        return (
          <div key={project.id} className="border-t-2 border-passport-tan pt-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-passport-beige border border-passport-tan flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-office-desk" />
              </div>
              <div className="flex-1">
                <p className="font-bold">{project.title}</p>
                <p className="text-xs text-passport-muted mb-2">{project.year}</p>
                <p className="text-passport-tan text-xs mb-2">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {project.technologies.slice(0, 3).map((tech, i) => (
                    <span key={i} className="px-2 py-1 bg-passport-beige border border-passport-tan text-[10px]">
                      {tech}
                    </span>
                  ))}
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stamp-ink hover:text-stamp-rejected text-xs underline"
                  >
                    View Project →
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div className="border-t-2 border-dashed border-passport-tan pt-3 text-center">
        <a href="/portfolio" className="text-stamp-ink hover:text-stamp-rejected text-xs font-bold underline">
          View All Projects →
        </a>
      </div>
    </div>
  );
}
