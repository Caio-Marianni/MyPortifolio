"use client";

import { useMemo, useCallback } from "react";
import { useUVMode } from "@/contexts/uv-mode-context";
import { useLanguage } from "@/contexts/language-context";
import { SkillsHeader } from "./skills/skills-header";
import { SkillCategoryCard } from "./skills/skill-category-card";

export function SkillsModalContent() {
  const { isUV } = useUVMode();
  const { translations } = useLanguage();

  const data = useMemo(() => {
    const mode = isUV ? "design" : "programming";
    const basePath = `modal.skills.data.${mode}`;

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
      headerLabel: getValue("headerLabel", "Arsenal do Suspeito"),
      levelLabels: getValue("levelLabels", {
        "1": "Iniciante",
        "2": "Básico",
        "3": "Intermediário",
        "4": "Avançado",
        "5": "Expert",
      }),
      categories: getValue("categories", []),
    };
  }, [translations, isUV]);

  const getLevelLabel = useCallback(
    (level: number): string => {
      return data.levelLabels[level.toString()] || "N/A";
    },
    [data.levelLabels]
  );

  return (
    <div className="space-y-6">
      <SkillsHeader headerLabel={data.headerLabel} />

      <div className="space-y-6">
        {data.categories.map((category: any) => (
          <SkillCategoryCard
            key={category.name}
            category={category}
            getLevelLabel={getLevelLabel}
          />
        ))}
      </div>
    </div>
  );
}
