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

export function ModalManager() {
  const { activeModal } = useModal();
  const { isUV } = useUVMode();
  const { t } = useLanguage();

  if (!activeModal) return null;

  const mode = isUV ? "uv" : "normal";
  const title = t(`modal.${activeModal}.title.${mode}`);

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

  return <ModalBase title={title}>{renderContent()}</ModalBase>;
}
