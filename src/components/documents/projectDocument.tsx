"use client";

import Image from "next/image";
import { Project } from "@/core/types";

interface ProjectDocumentProps {
  project: Project;
}

export function ProjectDocument({ project }: ProjectDocumentProps) {
  const Icon = project.icon;

  return (
    <div className="w-full max-w-2xl p-8 space-y-6">
      {/* Document Header */}
      <div className="border-b-2 border-office-desk pb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-passport-beige rounded-sm">
            <Icon className="w-8 h-8 text-office-desk" />
          </div>
          <div>
            <h2 className="font-document text-2xl font-bold text-office-desk uppercase">
              {project.title}
            </h2>
            <p className="font-document text-sm text-passport-tan">
              Document ID: {project.id.toString().padStart(3, "0")}
            </p>
          </div>
        </div>
      </div>

      {/* Document Body */}
      <div className="space-y-4">
        {/* Year */}
        <div className="flex gap-4">
          <span className="font-document font-bold text-office-desk w-32">Year:</span>
          <span className="font-document text-passport-tan">{project.year}</span>
        </div>

        {/* Description */}
        <div className="flex gap-4">
          <span className="font-document font-bold text-office-desk w-32">Description:</span>
          <p className="font-document text-passport-tan flex-1">{project.description}</p>
        </div>

        {/* Technologies */}
        <div className="flex gap-4">
          <span className="font-document font-bold text-office-desk w-32">Technologies:</span>
          <div className="flex flex-wrap gap-2 flex-1">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-passport-beige text-office-desk font-document text-xs rounded-sm border border-passport-tan"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="flex gap-4">
          <span className="font-document font-bold text-office-desk w-32">Category:</span>
          <span className="font-document text-passport-tan uppercase">{project.tagFilter}</span>
        </div>

        {/* Cover Images */}
        {project.cover && project.cover.length > 0 && (
          <div className="mt-6 space-y-2">
            <span className="font-document font-bold text-office-desk">Evidence:</span>
            <div className="grid grid-cols-2 gap-4">
              {project.cover.map((img, index) => (
                <div key={index} className="border-2 border-passport-tan pixel-art overflow-hidden">
                  <Image
                    src={img}
                    alt={`${project.title} screenshot ${index + 1}`}
                    width={300}
                    height={200}
                    className="w-full h-auto pixel-art"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Link */}
        {project.link && (
          <div className="flex gap-4 pt-4 border-t border-passport-tan">
            <span className="font-document font-bold text-office-desk w-32">Link:</span>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-document text-stamp-ink hover:text-stamp-rejected underline"
            >
              View Project →
            </a>
          </div>
        )}
      </div>

      {/* Document Footer - Official Stamp Area */}
      <div className="pt-6 border-t-2 border-dashed border-passport-tan">
        <p className="font-document text-xs text-passport-muted italic text-center">
          Official Document - Subject to Approval
        </p>
      </div>
    </div>
  );
}
