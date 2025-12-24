"use client";

import { memo } from "react";
import { Mail, FileText, FolderOpen, Briefcase } from "lucide-react";
import { useModal } from "@/contexts/modal-context";
import { useUVMode } from "@/contexts/uv-mode-context";
import { useAudioContext } from "@/contexts/audio-context";

interface InfoNavigationGridProps {
  contactLabel: string;
  cvLabel: string;
  projectsLabel: string;
  experienceLabel: string;
}

export const InfoNavigationGrid = memo(function InfoNavigationGrid({
  contactLabel,
  cvLabel,
  projectsLabel,
  experienceLabel,
}: InfoNavigationGridProps) {
  const { openModal } = useModal();
  const { isUV } = useUVMode();
  const { play } = useAudioContext();

  const handleClick = (modal: string) => {
    play("navbar");
    openModal(modal as any);
  };

  const handleCVDownload = () => {
    if (!isUV) {
      play("navbar");
      // Aqui você pode adicionar a lógica de download do CV
      window.open("/cv.pdf", "_blank");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Botão Contato */}
      <button
        onClick={() => handleClick("contact")}
        className="glow-uv flex flex-col items-center justify-center gap-2 p-4 rounded-md bg-buttom text-text-light border-2 border-white/40 hover:text-text-accent font-semibold hover:opacity-90 transition-all duration-200"
      >
        <Mail size={24} />
        <span className="text-sm">{contactLabel}</span>
      </button>

      {/* Botão CV */}
      <button
        onClick={handleCVDownload}
        disabled={isUV}
        className={`glow-uv flex flex-col items-center justify-center gap-2 p-4 rounded-md font-semibold ${
          isUV
            ? "bg-buttom text-text-light cursor-not-allowed opacity-50"
            : "bg-buttom text-text-light border-2 border-white/40 hover:text-text-accent"
        }`}
      >
        <FileText size={24} />
        <span className="text-sm">{cvLabel}</span>
      </button>

      {/* Botão Projetos */}
      <button
        onClick={() => handleClick("projects")}
        className="glow-uv flex flex-col items-center justify-center gap-2 p-4 rounded-md bg-buttom text-text-light font-semibold border-2 border-white/40 hover:text-text-accent transition-all duration-200"
      >
        <FolderOpen size={24} />
        <span className="text-sm">{projectsLabel}</span>
      </button>

      {/* Botão Experience */}
      <button
        onClick={() => handleClick("experience")}
        className="glow-uv flex flex-col items-center justify-center gap-2 p-4 rounded-md bg-buttom text-text-light font-semibold border-2 border-white/40 hover:text-text-accent transition-all duration-200"
      >
        <Briefcase size={24} />
        <span className="text-sm">{experienceLabel}</span>
      </button>
    </div>
  );
});
