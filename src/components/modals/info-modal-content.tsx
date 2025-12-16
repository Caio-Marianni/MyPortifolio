"use client";

import { ExternalLink, Mail } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useModal } from "@/contexts/modal-context";
import { useUVMode } from "@/contexts/uv-mode-context";
import { useLanguage } from "@/contexts/language-context";
import { useAudioContext } from "@/contexts/audio-context";

interface InfoData {
  name: string;
  headline: string;
  services: string[];
  stack: string[];
  lastCrime: {
    title: string;
    url: string;
  };
  victims: string;
  image: string;
}

const programmingData: InfoData = {
  name: "Caio Marianni",
  headline: "Suspeito de criar interfaces que viciam usuários",
  services: ["Desenvolvimento Web", "Front-end", "UI/UX", "Aplicações React"],
  stack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
  lastCrime: {
    title: "Portfolio Interativo",
    url: "#",
  },
  victims: "10+ projetos entregues",
  image: "/assets/images/Profile.png",
};

const designData: InfoData = {
  name: "Caio Marianni",
  headline: "Procurado por criar thumbnails impossíveis de ignorar",
  services: ["Thumbnails", "Design Gráfico", "Identidade Visual", "Banners"],
  stack: ["Photoshop", "Illustrator", "Figma", "After Effects"],
  lastCrime: {
    title: "Campanha de Thumbnails",
    url: "#",
  },
  victims: "50+ thumbnails criadas",
  image: "/assets/images/Profile.png",
};

export function InfoModalContent() {
  const { isUV } = useUVMode();
  const { t } = useLanguage();
  const { openModal } = useModal();
  const { play } = useAudioContext();

  const data = isUV ? designData : programmingData;

  const handleContact = () => {
    play("navbar");
    openModal("contact");
  };

  return (
    <div className="space-y-6">
      {/* Seção superior: Foto + Info básica */}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Foto estilo ficha policial */}
        <div className="flex-shrink-0">
          <div
            className={`
              relative w-32 h-40 sm:w-40 sm:h-48
              border-4 border-[var(--frame-color)]
              bg-[var(--bg-primary)]
              overflow-hidden
            `}
          >
            {/* Tachinha decorativa */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--frame-color)] opacity-60 z-10" />

            <OptimizedImage
              src={data.image}
              alt={data.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Info lado direito */}
        <div className="flex-1 space-y-3">
          <InfoRow label="Nome" value={data.name} />
          <InfoRow label="Status" value={data.headline} highlight />
          <InfoRow
            label="Serviços"
            value={data.services.join(" • ")}
          />
          <InfoRow
            label="Arsenal"
            value={
              <div className="flex flex-wrap gap-1.5">
                {data.stack.map((tech) => (
                  <span
                    key={tech}
                    className={`
                      px-2 py-0.5 text-xs rounded
                      bg-[var(--accent)]/20 text-[var(--accent)]
                      border border-[var(--accent)]/30
                    `}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            }
          />
        </div>
      </div>

      {/* Seção inferior */}
      <div className="space-y-3 pt-4 border-t border-[var(--frame-color)]/20">
        <InfoRow
          label="Último Crime"
          value={
            <a
              href={data.lastCrime.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                inline-flex items-center gap-1.5
                text-[var(--accent)] hover:underline
              `}
            >
              {data.lastCrime.title}
              <ExternalLink size={14} />
            </a>
          }
        />
        <InfoRow label="Vítimas" value={data.victims} />
      </div>

      {/* Botão de contato */}
      <div className="pt-4">
        <button
          onClick={handleContact}
          className={`
            w-full py-3 px-4 rounded-lg
            bg-[var(--accent)] text-white
            font-medium
            flex items-center justify-center gap-2
            hover:opacity-90
            transition-all duration-200
            hover:scale-[1.02] active:scale-[0.98]
          `}
        >
          <Mail size={18} />
          Entrar em Contato
        </button>
      </div>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}

function InfoRow({ label, value, highlight = false }: InfoRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-3">
      <span className="text-[var(--text-secondary)] text-sm min-w-[100px] font-medium">
        {label}:
      </span>
      <span
        className={`
          text-[var(--text-primary)]
          ${highlight ? "text-[var(--accent)] italic" : ""}
        `}
      >
        {value}
      </span>
    </div>
  );
}
