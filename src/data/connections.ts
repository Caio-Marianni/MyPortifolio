import { ModalSection } from "@/contexts/modal-context";

/**
 * Define quais pontos estão conectados por linhas (barbantes)
 * Cada tupla representa uma conexão entre dois pontos
 */
export const connections: [ModalSection, ModalSection][] = [
  ["about", "info"],
  ["info", "projects"],
  ["about", "experience"],
  ["experience", "skills"],
  ["projects", "skills"],
  ["skills", "contact"],
  ["info", "experience"],
];
