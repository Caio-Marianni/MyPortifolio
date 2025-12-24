"use client";

import { useMemo } from "react";
import { useUVMode } from "@/contexts/uv-mode-context";
import { useLanguage } from "@/contexts/language-context";
import { ExperienceHeader } from "./experience/experience-header";
import { ExperienceCard } from "./experience/experience-card";

export function ExperienceModalContent() {
  const { isUV } = useUVMode();
  const { translations } = useLanguage();

  const data = useMemo(() => {
    const mode = isUV ? "design" : "programming";
    const basePath = `modal.experience.data.${mode}`;

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
      headerLabel: getValue("headerLabel", "Histórico de Atividades Suspeitas"),
      currentLabel: getValue("currentLabel", "Em atividade"),
      experiences: getValue("experiences", []),
    };
  }, [translations, isUV]);

  return (
    <div className="space-y-6">
      <ExperienceHeader headerLabel={data.headerLabel} />

      <div className="relative">
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-[var(--frame-color)]/30" />

        <div className="space-y-6">
          {data.experiences.map((exp: any) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              currentLabel={data.currentLabel}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
