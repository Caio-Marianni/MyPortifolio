"use client";

import { memo } from "react";
import { Mail, Linkedin, Github } from "lucide-react";

interface ContactLink {
  icon: string;
  label: string;
  value: string;
  href: string;
}

interface ContactLinksProps {
  links: ContactLink[];
}

export const ContactLinks = memo(function ContactLinks({
  links,
}: ContactLinksProps) {
  const iconMap: Record<string, React.ReactNode> = {
    mail: <Mail size={20} />,
    linkedin: <Linkedin size={20} />,
    github: <Github size={20} />,
  };

  return (
    <div className="grid gap-3">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 rounded-lg bg-[var(--bg-primary)] border border-[var(--frame-color)]/20 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 transition-all duration-200 group"
        >
          <div className="p-2 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] group-hover:bg-[var(--accent)]/20 transition-colors duration-200">
            {iconMap[link.icon]}
          </div>
          <div className="flex-1">
            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
              {link.label}
            </p>
            <p className="text-[var(--text-primary)] font-medium">{link.value}</p>
          </div>
        </a>
      ))}
    </div>
  );
});
