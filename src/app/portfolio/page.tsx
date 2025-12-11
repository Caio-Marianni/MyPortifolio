"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { projects } from "../../core/constants";

export default function PortfolioPage() {
  const [filter, setFilter] = useState<"all" | "landing" | "fullstack">("all");

  const filteredProjects =
    filter === "all" ? projects : projects.filter((p) => p.tagFilter === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-passport-paper to-passport-light">
      {/* Header */}
      <header className="bg-office-desk border-b-4 border-office-shadow py-6 px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-pixel text-passport-paper text-sm md:text-base pixel-font mb-2">
                PORTFOLIO
              </h1>
              <p className="font-document text-passport-light text-sm">Caio Marianni - Full Stack Developer</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-passport-tan text-office-desk font-document text-sm rounded hover:bg-passport-light"
            >
              ← Back to Review
            </Link>
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 font-document text-sm rounded transition-colors ${
                filter === "all"
                  ? "bg-stamp-approved text-passport-paper"
                  : "bg-passport-beige text-office-desk hover:bg-passport-tan"
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter("landing")}
              className={`px-4 py-2 font-document text-sm rounded transition-colors ${
                filter === "landing"
                  ? "bg-stamp-approved text-passport-paper"
                  : "bg-passport-beige text-office-desk hover:bg-passport-tan"
              }`}
            >
              Landing Pages
            </button>
            <button
              onClick={() => setFilter("fullstack")}
              className={`px-4 py-2 font-document text-sm rounded transition-colors ${
                filter === "fullstack"
                  ? "bg-stamp-approved text-passport-paper"
                  : "bg-passport-beige text-office-desk hover:bg-passport-tan"
              }`}
            >
              Full Stack
            </button>
          </div>
        </div>
      </header>

      {/* Projects Grid */}
      <main className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const Icon = project.icon;
            return (
              <div
                key={project.id}
                className="paper-texture document-shadow rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                {/* Project Cover */}
                {project.cover && project.cover[0] && (
                  <div className="relative h-48 bg-passport-beige overflow-hidden">
                    <Image
                      src={project.cover[0]}
                      alt={project.title}
                      fill
                      className="object-cover pixel-art"
                    />
                    <div className="absolute top-3 right-3 p-2 bg-passport-paper/90 rounded">
                      <Icon className="w-6 h-6 text-office-desk" />
                    </div>
                  </div>
                )}

                {/* Project Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-document text-xl font-bold text-office-desk mb-2">
                      {project.title}
                    </h3>
                    <p className="font-document text-sm text-passport-tan">
                      {project.description}
                    </p>
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-passport-beige text-office-desk font-document text-xs rounded border border-passport-tan"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-1 bg-passport-beige text-office-desk font-document text-xs rounded border border-passport-tan">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-passport-tan">
                    <span className="font-document text-xs text-passport-muted">{project.year}</span>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-stamp-approved text-passport-paper font-document text-xs rounded hover:bg-stamp-approved/90"
                      >
                        View Project →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="font-document text-passport-tan text-lg">
              No projects found for this category.
            </p>
          </div>
        )}

        {/* Link to Thumbnails */}
        <div className="mt-16 text-center">
          <div className="inline-block paper-texture document-shadow rounded-lg p-8">
            <h2 className="font-pixel text-office-desk text-xs md:text-sm pixel-font mb-4">
              DESIGN PORTFOLIO
            </h2>
            <p className="font-document text-passport-tan mb-6">
              View my thumbnail design work and graphic design projects
            </p>
            <Link
              href="/old/portfolio/thumbnail"
              className="inline-block px-6 py-3 bg-stamp-approved text-passport-paper font-document rounded hover:bg-stamp-approved/90"
            >
              View Thumbnails Gallery
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-office-desk border-t-4 border-office-shadow py-6 px-6">
        <div className="container mx-auto text-center">
          <p className="font-document text-passport-light text-sm">
            © 2024 Caio Marianni - Full Stack Developer & Designer
          </p>
          <p className="font-document text-passport-muted text-xs mt-2">
            Contact: caio@example.com
          </p>
        </div>
      </footer>
    </div>
  );
}
