"use client";

import { CapaPage } from "@/components/capa/capa-page";
import { ProjectDossier } from "@/components/projects/project-dossier";
import { useLanguage } from "@/contexts/language-context";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  const { t, language } = useLanguage();
  const pt = language === "pt";

  return (
    <CapaPage
      bleed
      wordmark={t("status.projects")}
      descriptor={t("lobby.web.line")}
      stats={[`${projects.length} ${pt ? "publicados" : "published"}`, t("lobby.web.stat")]}
    >
      {/* Cada ficha pinta o próprio fundo, alternando creme/preto — a primeira é preta
          para emendar na faixa de metadados da capa, e o `bleed` leva até a borda. */}
      {projects.map((project, i) => (
        <ProjectDossier key={project.id} project={project} index={i} />
      ))}
    </CapaPage>
  );
}
