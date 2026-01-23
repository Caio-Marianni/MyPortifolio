"use client";

import { memo, useState, useEffect } from "react";
import { Globe, Award, Send, Package, Image } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
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
        Brasil-GO <span className="opacity-50">•</span> {clock ? `${clock.time} ` : "--:-- "}
        <span className="opacity-60">{clock?.period ?? ""}</span>
      </StatusItem>

      {/* Stats */}
      <StatusItem icon={Package} fill>+20 Projetos <span className="opacity-50">•</span> 2 Clientes felizes</StatusItem>

      {/* Diploma - Visible in LIGHT mode only */}
      {theme === "light" && (
        <StatusItem icon={Award} href="#" isLink fill>
          Diploma
        </StatusItem>
      )}

      {/* Contact */}
      <StatusItem icon={Send} href="/contact" isLink fill>
        Contactos
      </StatusItem>

      {/* Projetos - Visible in LIGHT mode only */}
      {theme === "light" && (
        <StatusItem icon={Package} href="/projects" isLink fill>
          Projetos
        </StatusItem>
      )}

      {/* Thumbnails - Visible in DARK mode only */}
      {theme === "dark" && (
        <StatusItem icon={Image} href="/thumbnails" isLink fill>
          Thumbnails
        </StatusItem>
      )}
    </div>
  );
});
