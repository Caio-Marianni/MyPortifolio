"use client";

import {
  User,
  Info,
  FolderOpen,
  Briefcase,
  Wrench,
  Mail,
} from "lucide-react";
import { NavIcon } from "./nav-icon";
import { UVToggle } from "./uv-toggle";
import { LanguageSwitch } from "./language-switch";
import { useLanguage } from "@/contexts/language-context";

const navItems = [
  { icon: User, section: "about" as const, labelKey: "nav.about" },
  { icon: Info, section: "info" as const, labelKey: "nav.info" },
  { icon: FolderOpen, section: "projects" as const, labelKey: "nav.projects" },
  { icon: Briefcase, section: "experience" as const, labelKey: "nav.experience" },
  { icon: Wrench, section: "skills" as const, labelKey: "nav.skills" },
  { icon: Mail, section: "contact" as const, labelKey: "nav.contact" },
];

export function Navbar() {
  const { t } = useLanguage();

  return (
    <nav
      className={`
        fixed top-4 left-1/2 -translate-x-1/2
        flex items-center gap-1
        px-4 py-2
        bg-[var(--bg-primary)]/90
        backdrop-blur-md
        border border-[var(--frame-color)]/20
        rounded-full
        shadow-xl
        z-50
        theme-transition
      `}
    >
      {/* Ícones de navegação */}
      {navItems.map((item) => (
        <NavIcon
          key={item.section}
          icon={item.icon}
          section={item.section}
          label={t(item.labelKey)}
        />
      ))}

      {/* Separador */}
      <div className="w-px h-8 bg-[var(--frame-color)]/20 mx-2" />

      {/* UV Toggle */}
      <UVToggle />

      {/* Language Switch */}
      <LanguageSwitch />
    </nav>
  );
}
