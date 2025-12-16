"use client";

import {
  UserRound,
  FingerprintPattern,
  FolderOpen,
  Route,
  Puzzle,
  Send,
} from "lucide-react";
import { NavIcon } from "./nav-icon";
import { UVToggle } from "./uv-toggle";
import { LanguageSwitch } from "./language-switch";
import { useLanguage } from "@/contexts/language-context";

const navItems = [
  { icon: UserRound, section: "info" as const, labelKey: "nav.info", useFill: true },
  { icon: FingerprintPattern, section: "about" as const, labelKey: "nav.about", useFill: false },
  { icon: FolderOpen, section: "projects" as const, labelKey: "nav.projects", useFill: true },
  { icon: Route, section: "experience" as const, labelKey: "nav.experience", useFill: false },
  { icon: Puzzle, section: "skills" as const, labelKey: "nav.skills", useFill: true },
  { icon: Send, section: "contact" as const, labelKey: "nav.contact", useFill: true },
];

export function Navbar() {
  const { t } = useLanguage();

  return (
    <nav
      className={`
        fixed top-4 left-1/2 -translate-x-1/2
        flex items-center gap-1
        px-4 py-2
        bg-black/20
        bg-gradient-to-b from-white/10 via-black/0 to-black/0
        backdrop-blur-md
        border border-white/10
        rounded-full
        shadow-xl
        z-50
        theme-transition
        highlight-top
      `}
    >
      {/* Ícones de navegação */}
      {navItems.map((item) => (
        <NavIcon
          key={item.section}
          icon={item.icon}
          section={item.section}
          label={t(item.labelKey)}
          useFill={item.useFill}
        />
      ))}

      {/* Separador */}
      <div className="w-px h-8 bg-white/20 mx-2" />

      {/* UV Toggle */}
      <UVToggle />

      {/* Language Switch */}
      <LanguageSwitch />
    </nav>
  );
}
