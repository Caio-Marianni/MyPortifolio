"use client";

import { useMemo } from "react";
import { useUVMode } from "@/contexts/uv-mode-context";
import { useLanguage } from "@/contexts/language-context";
import { AboutHeader } from "./about/about-header";
import { AboutInfoCards } from "./about/about-info-cards";
import { AboutTestimony } from "./about/about-testimony";
import { AboutEvidence } from "./about/about-evidence";

export function AboutModalContent() {
  const { isUV } = useUVMode();
  const { translations } = useLanguage();

  const data = useMemo(() => {
    const mode = isUV ? "design" : "programming";
    const basePath = `modal.about.data.${mode}`;

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
      caseNumberLabel: getValue("caseNumberLabel", "Caso Nº"),
      caseNumber: getValue("caseNumber", "DEV-2024-001"),
      locationLabel: getValue("locationLabel", "Localização"),
      location: getValue("location", "São Paulo, Brasil"),
      activeSinceLabel: getValue("activeSinceLabel", "Ativo desde"),
      activeSince: getValue("activeSince", "2020"),
      objectiveLabel: getValue("objectiveLabel", "Objetivo"),
      objective: getValue("objective", ""),
      testimonyLabel: getValue("testimonyLabel", "Depoimento do Suspeito"),
      description: getValue("description", []),
      evidenceLabel: getValue("evidenceLabel", "Evidências Coletadas"),
      evidence: getValue("evidence", []),
    };
  }, [translations, isUV]);

  return (
    <div className="space-y-6">
      <AboutHeader
        caseNumberLabel={data.caseNumberLabel}
        caseNumber={data.caseNumber}
      />

      <AboutInfoCards
        locationLabel={data.locationLabel}
        location={data.location}
        activeSinceLabel={data.activeSinceLabel}
        activeSince={data.activeSince}
        objectiveLabel={data.objectiveLabel}
        objective={data.objective}
      />

      <AboutTestimony
        testimonyLabel={data.testimonyLabel}
        description={data.description}
      />

      <AboutEvidence
        evidenceLabel={data.evidenceLabel}
        evidence={data.evidence}
      />
    </div>
  );
}
