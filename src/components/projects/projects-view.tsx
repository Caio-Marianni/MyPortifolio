"use client";

import { CapaPage } from "@/components/capa/capa-page";
import { ProjectDossier } from "@/components/projects/project-dossier";
import { useLanguage } from "@/contexts/language-context";
import { projects } from "@/data/projects";
import type { Review } from "@/data/reviews";

/* Separado da page porque a página virou componente de servidor pra buscar as avaliações —
   tudo que precisa de `useLanguage` mora deste lado. */
export function ProjectsView({ reviews }: { reviews: Review[] }) {
  const { t, language } = useLanguage();
  const pt = language === "pt";

  return (
    <CapaPage
      bleed
      track="web"
      wordmark={t("status.projects")}
      descriptor={t("lobby.web.line")}
      stats={[`${projects.length} ${pt ? "publicados" : "published"}`, t("lobby.web.stat")]}
    >
      {/* Cada ficha pinta o próprio fundo, alternando creme/preto — a primeira é preta
          para emendar na faixa de metadados da capa, e o `bleed` leva até a borda. */}
      {projects.map((project, i) => (
        <ProjectDossier
          key={project.id}
          project={project}
          index={i}
          /* a mais recente que o painel amarrou a este projeto; a lista já vem por data */
          /* Só serve de depoimento a avaliação que tem texto: o bloco da ficha é uma citação,
             e nota sem comentário viraria um par de aspas vazio. */
          review={reviews.find((review) => review.project === project.id && review.comment)}
        />
      ))}
    </CapaPage>
  );
}
