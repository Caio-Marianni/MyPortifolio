"use client";

import { useMemo } from "react";
import { useUVMode } from "@/contexts/uv-mode-context";
import { useLanguage } from "@/contexts/language-context";
import { ProjectsHeader } from "./projects/projects-header";
import { ProjectCard } from "./projects/project-card";

export function ProjectsModalContent() {
  const { isUV } = useUVMode();
  const { translations } = useLanguage();

  const data = useMemo(() => {
    const mode = isUV ? "design" : "programming";
    const basePath = `modal.projects.data.${mode}`;

    const getValue = (key: string, fallback: any = "") => {
      const fullPath = `${basePath}.${key}`;
      const keys = fullPath.split(".");
      let value: any = translations;

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          return fallback;
        }
      }

      return value || fallback;
    };

    return {
      headerLabel: getValue("headerLabel", "casos documentados"),
      evidenceLabel: getValue("evidenceLabel", "EVIDÊNCIA"),
      viewProjectButton: getValue("viewProjectButton", "Ver Projeto"),
      codeButton: getValue("codeButton", "Código"),
      statusLabels: getValue("statusLabels", {}),
      projects: getValue("projects", []),
    };
  }, [translations, isUV]);

  const statusConfig = useMemo(
    () => ({
      inProgress: {
        label: data.statusLabels.inProgress || "em andamento",
        className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      },
      completed: {
        label: data.statusLabels.completed || "concluído",
        className: "bg-green-500/20 text-green-400 border-green-500/30",
      },
      archived: {
        label: data.statusLabels.archived || "arquivado",
        className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      },
    }),
    [data.statusLabels]
  );

  return (
    <div className="space-y-4">
      <ProjectsHeader count={data.projects.length} headerLabel={data.headerLabel} />

      <div className="space-y-4">
        {data.projects.map((project: any) => (
          <ProjectCard
            key={project.id}
            project={project}
            statusConfig={statusConfig}
            evidenceLabel={data.evidenceLabel}
            viewProjectButton={data.viewProjectButton}
            codeButton={data.codeButton}
          />
        ))}
      </div>
    </div>
  );
}
