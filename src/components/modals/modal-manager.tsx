"use client";

import { useModal } from "@/contexts/modal-context";
import { useUVMode } from "@/contexts/uv-mode-context";
import { useLanguage } from "@/contexts/language-context";
import { ModalBase } from "./modal-base";
import { AboutModalContent } from "./about-modal-content";
import { InfoModalContent } from "./info-modal-content";
import { ProjectsModalContent } from "./projects-modal-content";
import { ExperienceModalContent } from "./experience-modal-content";
import { SkillsModalContent } from "./skills-modal-content";
import { ContactModalContent } from "./contact-modal-content";

// Mapeamento de rotações para cada modal
const modalRotations: Record<string, number> = {
  about: -1.5,
  info: 1,
  projects: -2,
  experience: 0.5,
  skills: -1,
  contact: 1.5,
};

export function ModalManager() {
  const { activeModal } = useModal();
  const { isUV } = useUVMode();
  const { t } = useLanguage();

  if (!activeModal) return null;

  const mode = isUV ? "uv" : "normal";
  const title = t(`modal.${activeModal}.title.${mode}`);
  const rotate = modalRotations[activeModal] || 0;

  // Renderizar conteúdo específico por modal
  const renderContent = () => {
    switch (activeModal) {
      case "about":
        return <AboutModalContent />;
      case "info":
        return <InfoModalContent />;
      case "projects":
        return <ProjectsModalContent />;
      case "experience":
        return <ExperienceModalContent />;
      case "skills":
        return <SkillsModalContent />;
      case "contact":
        return <ContactModalContent />;
      default:
        return null;
    }
  };

  return (
    <ModalBase title={title} rotate={rotate}>
      {renderContent()}
    </ModalBase>
  );
}
