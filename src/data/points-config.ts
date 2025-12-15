import { ModalSection } from "@/contexts/modal-context";

export interface PointConfig {
  id: ModalSection;
  label: {
    pt: string;
    en: string;
  };
  basePosition: { x: number; y: number };
  seed: number;
}

export const pointsConfig: PointConfig[] = [
  {
    id: "about",
    label: { pt: "Sobre mim", en: "About me" },
    basePosition: { x: 18, y: 22 },
    seed: 12345,
  },
  {
    id: "info",
    label: { pt: "Informações", en: "Info" },
    basePosition: { x: 52, y: 12 },
    seed: 67890,
  },
  {
    id: "projects",
    label: { pt: "Projetos", en: "Projects" },
    basePosition: { x: 78, y: 32 },
    seed: 11111,
  },
  {
    id: "experience",
    label: { pt: "Experiência", en: "Experience" },
    basePosition: { x: 28, y: 58 },
    seed: 22222,
  },
  {
    id: "skills",
    label: { pt: "Habilidades", en: "Skills" },
    basePosition: { x: 62, y: 68 },
    seed: 33333,
  },
  {
    id: "contact",
    label: { pt: "Contato", en: "Contact" },
    basePosition: { x: 82, y: 82 },
    seed: 44444,
  },
];
