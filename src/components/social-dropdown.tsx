"use client";

import { useState } from "react";
import { Github, Linkedin, Mail, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";

export function SocialDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const socialLinks = [
    {
      name: "Gmail",
      icon: Mail,
      href: "mailto:caiomarianni@gmail.com",
      showInLight: true,
      showInDark: true,
    },
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/Caio-Marianni",
      showInLight: true,
      showInDark: false,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/in/caio-marianni/",
      showInLight: true,
      showInDark: false,
    },
    {
      name: "Upwork",
      icon: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-.93.913-2.487 2.839-2.487 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
        </svg>
      ),
      href: theme === "light" ? "https://www.upwork.com/freelancers/~01e15c653dfbed2b29?s=1110580755057594368" : "https://www.upwork.com/freelancers/~01e15c653dfbed2b29?s=1017484851352698959",
      showInLight: true,
      showInDark: true,
    },
    {
      name: "Discord",
      icon: MessageCircle,
      href: "#",
      label: "marinomad",
      showInLight: true,
      showInDark: true,
    },
  ];

  const visibleLinks = socialLinks.filter((link) => (theme === "light" ? link.showInLight : link.showInDark));

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-mono tracking-wide text-gray-400 dark:text-blue-300/70 hover:text-black dark:hover:text-blue-200 transition-colors"
      >
        <span>Links sociais</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-64 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-blue-500/20 rounded-lg shadow-lg overflow-hidden z-10">
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-blue-500/10 transition-colors text-gray-900 dark:text-blue-100"
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{link.name}</span>
                  {link.label && <span className="text-xs text-gray-500 dark:text-blue-300/50">{link.label}</span>}
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
