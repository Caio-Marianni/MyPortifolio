"use client";

import { memo } from "react";
import { Globe, Award, Send, Package, Image } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useGoiasClock } from "@/hooks/use-goias-clock";
import { StatusItem } from "./status-item";

export const StatusSection = memo(function StatusSection() {
  const { t } = useLanguage();
  const clock = useGoiasClock();

  return (
    <div className="space-y-1 text-[10px] md:text-[12px] font-monocraft uppercase">
      {/* Separator */}
      <hr className="max-w-60 opacity-20 my-6 border-gray-300 dark:border-blue-500" />
      {/* Location */}
      <StatusItem icon={Globe} fill>
        {t("status.location")} <span className="opacity-50">•</span> {clock ? `${clock.time} ` : "--:-- "}
        <span className="opacity-60">{clock?.period ?? ""}</span>
      </StatusItem>

      {/* Stats */}
      <StatusItem icon={Package} fill>
        {t("status.stats")} <span className="opacity-50">•</span> {t("status.clients")}
      </StatusItem>

      {/* Sem troca de tema, esconder destino por tema não faz mais sentido: todos aparecem.
          Antes, Diploma e Projetos só existiam no light e Thumbnails só no dark. */}
      <StatusItem icon={Award} href="#" isLink fill>
        {t("status.diploma")}
      </StatusItem>

      <StatusItem icon={Send} href="/contact" isLink fill>
        {t("status.contacts")}
      </StatusItem>

      <StatusItem icon={Package} href="/projects" isLink fill>
        {t("status.projects")}
      </StatusItem>

      <StatusItem icon={Image} href="/thumbnails" isLink fill>
        {t("status.thumbnails")}
      </StatusItem>
    </div>
  );
});
