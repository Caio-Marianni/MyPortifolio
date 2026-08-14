"use client";

import { ArrowUpRight } from "lucide-react";
import { CapaPage } from "@/components/capa/capa-page";
import { CapaContactForm } from "@/components/capa/capa-contact-form";
import { useLanguage } from "@/contexts/language-context";

/* Índice de canais: rótulo à esquerda, identidade à direita — a mesma micro-tipografia do rail. */
const CHANNELS = [
  { label: "E-mail", value: "caiomarianni@gmail.com", href: "mailto:caiomarianni@gmail.com" },
  { label: "WhatsApp", value: "+55 62 98116-0081", href: "https://wa.me/5562981160081" },
  { label: "Discord", value: "marinomad", href: "https://discord.com/users/marinomad" },
  { label: "GitHub", value: "Caio-Marianni", href: "https://github.com/Caio-Marianni" },
  { label: "LinkedIn", value: "caio-marianni", href: "https://www.linkedin.com/in/caio-marianni/" },
  { label: "Upwork", value: "caio m.", href: "https://www.upwork.com/freelancers/~01e15c653dfbed2b29" },
];

export default function CapaContactPage() {
  const { t, language } = useLanguage();
  const pt = language === "pt";

  return (
    <CapaPage
      wordmark={pt ? "Contato" : "Contact"}
      script={pt ? "Vamos" : "Let's"}
      descriptor={t("contact.subtitle")}
      stats={[pt ? "Freelance aberto" : "Open for freelance", pt ? "Remoto" : "Remote"]}
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="max-w-md text-[14px] leading-[1.6] text-[#101010]/60">{t("contact.description")}</p>

          <ul className="mt-10 border-t border-[#101010]/15">
            {CHANNELS.map((channel) => (
              <li key={channel.label}>
                <a
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 border-b border-[#101010]/15 py-4 font-jetbrains-mono text-[11px] uppercase tracking-[0.16em] transition-colors hover:bg-[#101010]/[0.04] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-[#101010]"
                >
                  <span className="w-24 shrink-0 text-[#101010]/45">{channel.label}</span>
                  <span className="truncate normal-case tracking-[0.06em]">{channel.value}</span>
                  <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-[#101010]/40" strokeWidth={2.5} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <CapaContactForm />
      </div>
    </CapaPage>
  );
}
