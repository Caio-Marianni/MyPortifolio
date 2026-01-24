"use client";

import { memo, useState, useEffect } from "react";
import { Globe, Award, Send, Package, Image } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { useLanguage } from "@/contexts/language-context";
import { StatusItem } from "./status-item";

function getTimeInGoias(): { time: string; period: string } {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const formatted = now.toLocaleTimeString("en-US", options);
  const [time, period] = formatted.split(" ");
  return { time, period };
}

export const StatusSection = memo(function StatusSection() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [clock, setClock] = useState<{ time: string; period: string } | null>(null);

  useEffect(() => {
    setClock(getTimeInGoias());
    const interval = setInterval(() => {
      setClock(getTimeInGoias());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

      {/* Diploma - Visible in LIGHT mode only */}
      {theme === "light" && (
        <StatusItem icon={Award} href="#" isLink fill>
          {t("status.diploma")}
        </StatusItem>
      )}

      {/* Contact */}
      <StatusItem icon={Send} href="/contact" isLink fill>
        {t("status.contacts")}
      </StatusItem>

      {/* Projetos - Visible in LIGHT mode only */}
      {theme === "light" && (
        <StatusItem icon={Package} href="/projects" isLink fill>
          {t("status.projects")}
        </StatusItem>
      )}

      {/* Thumbnails - Visible in DARK mode only */}
      {theme === "dark" && (
        <StatusItem icon={Image} href="/thumbnails" isLink fill>
          {t("status.thumbnails")}
        </StatusItem>
      )}
    </div>
  );
});
