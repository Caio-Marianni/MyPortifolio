"use client";

import { FileText, MapPin, Calendar, Target } from "lucide-react";
import { useUVMode } from "@/contexts/uv-mode-context";
import { useLanguage } from "@/contexts/language-context";

interface AboutData {
  caseNumber: string;
  location: string;
  activeSince: string;
  objective: string;
  description: string[];
  evidence: string[];
}

const programmingData: AboutData = {
  caseNumber: "DEV-2024-001",
  location: "São Paulo, Brasil",
  activeSince: "2020",
  objective: "Criar experiências digitais memoráveis",
  description: [
    "Desenvolvedor Front-end com paixão por criar interfaces intuitivas e performáticas.",
    "Especializado em React e seu ecossistema, sempre buscando as melhores práticas e padrões de código limpo.",
    "Acredito que o código deve ser tão elegante quanto a interface que ele cria.",
  ],
  evidence: [
    "Código limpo e bem documentado em todos os projetos",
    "Histórico de entregas dentro do prazo",
    "Feedback positivo de clientes e colegas",
    "Contribuições para projetos open source",
  ],
};

const designData: AboutData = {
  caseNumber: "DES-2024-001",
  location: "São Paulo, Brasil",
  activeSince: "2019",
  objective: "Capturar atenção em milissegundos",
  description: [
    "Designer gráfico especializado em thumbnails que convertem e visuais que engajam.",
    "Combinando psicologia visual com técnicas de design para criar peças impossíveis de ignorar.",
    "Cada thumbnail é uma armadilha visual cuidadosamente planejada.",
  ],
  evidence: [
    "CTR acima da média em campanhas",
    "Portfolio diversificado de estilos",
    "Domínio de múltiplas ferramentas criativas",
    "Entregas rápidas sem perda de qualidade",
  ],
};

export function AboutModalContent() {
  const { isUV } = useUVMode();
  const { t } = useLanguage();

  const data = isUV ? designData : programmingData;

  return (
    <div className="space-y-6">
      {/* Cabeçalho do caso */}
      <div className="flex items-center gap-4 pb-4 border-b border-[var(--frame-color)]/20">
        <div
          className={`
            p-3 rounded-lg
            bg-[var(--accent)]/10
            border border-[var(--accent)]/30
          `}
        >
          <FileText size={24} className="text-[var(--accent)]" />
        </div>
        <div>
          <p className="text-sm text-[var(--text-secondary)]">Caso Nº</p>
          <p className="text-lg font-mono font-semibold text-[var(--accent)]">
            {data.caseNumber}
          </p>
        </div>
      </div>

      {/* Informações básicas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InfoCard
          icon={<MapPin size={16} />}
          label="Localização"
          value={data.location}
        />
        <InfoCard
          icon={<Calendar size={16} />}
          label="Ativo desde"
          value={data.activeSince}
        />
        <InfoCard
          icon={<Target size={16} />}
          label="Objetivo"
          value={data.objective}
        />
      </div>

      {/* Descrição / Depoimento */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          Depoimento do Suspeito
        </h3>
        <div
          className={`
            p-4 rounded-lg
            bg-[var(--bg-primary)]
            border border-[var(--frame-color)]/20
            space-y-3
          `}
        >
          {data.description.map((paragraph, index) => (
            <p
              key={index}
              className="text-[var(--text-primary)] leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Evidências */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          Evidências Coletadas
        </h3>
        <ul className="space-y-2">
          {data.evidence.map((item, index) => (
            <li
              key={index}
              className={`
                flex items-start gap-3
                p-3 rounded-lg
                bg-[var(--bg-primary)]
                border border-[var(--frame-color)]/10
              `}
            >
              <span
                className={`
                  flex-shrink-0 w-6 h-6
                  flex items-center justify-center
                  rounded-full
                  bg-[var(--accent)]/20
                  text-[var(--accent)]
                  text-xs font-bold
                `}
              >
                {index + 1}
              </span>
              <span className="text-[var(--text-primary)]">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <div
      className={`
        p-3 rounded-lg
        bg-[var(--bg-primary)]
        border border-[var(--frame-color)]/20
      `}
    >
      <div className="flex items-center gap-2 text-[var(--text-secondary)] mb-1">
        {icon}
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-[var(--text-primary)] font-medium">{value}</p>
    </div>
  );
}
