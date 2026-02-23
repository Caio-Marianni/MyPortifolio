"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectModal } from "@/components/projects/project-modal";
import { useLanguage } from "@/contexts/language-context";
import { projects, type Project } from "@/data/projects";

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { t } = useLanguage();

  return (
    <PageContainer showThemeToggle={false}>
      <Link href="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        {t("projects.back")}
      </Link>

      <PageHeader title={t("projects.title")} description={t("projects.description")} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
        ))}
      </div>

      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </PageContainer>
  );
}
