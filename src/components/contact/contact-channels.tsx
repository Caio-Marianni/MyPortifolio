"use client";

import { Briefcase, Gamepad2, Github, Linkedin, Mail, MessageCircle, type LucideIcon } from "lucide-react";

interface Channel {
  label: string;
  value: string;
  href: string;
  Icon: LucideIcon;
}

/* Índice de canais. lucide traz a marca real de GitHub e LinkedIn; para WhatsApp, Discord
   e Upwork não existe marca no pacote, então entram ícones semânticos — é por isso que o
   rótulo continua visível, um balão sozinho não diz "WhatsApp". */
const CHANNELS: Channel[] = [
  { label: "E-mail", value: "caiomarianni@gmail.com", href: "mailto:caiomarianni@gmail.com", Icon: Mail },
  { label: "WhatsApp", value: "+55 62 98116-0081", href: "https://wa.me/5562981160081", Icon: MessageCircle },
  { label: "Discord", value: "marinomad", href: "https://discord.com/users/marinomad", Icon: Gamepad2 },
  { label: "GitHub", value: "Caio-Marianni", href: "https://github.com/Caio-Marianni", Icon: Github },
  { label: "LinkedIn", value: "caio-marianni", href: "https://www.linkedin.com/in/caio-marianni/", Icon: Linkedin },
  { label: "Upwork", value: "caio m.", href: "https://www.upwork.com/freelancers/~01e15c653dfbed2b29", Icon: Briefcase },
];

/** Grade 3×2 de ladrilhos: rótulo e valor por cima, ícone da plataforma sangrando
    no canto como marca d'água — mesmo gesto do número em contorno do dossiê. */
export function ContactChannels() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-px border border-[#F1ECE5]/[0.16] bg-[#F1ECE5]/[0.16] sm:grid-cols-3">
      {CHANNELS.map(({ label, value, href, Icon }) => (
        <a
          key={label}
          href={href}
          /* mailto abre no cliente do próprio visitante; só os links http saem para outra aba */
          target={href.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="group/tile relative flex min-h-[84px] flex-col gap-1.5 overflow-hidden bg-[#101010] px-[15px] py-3.5 text-[#F1ECE5] transition-colors hover:bg-[#FF5500] hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-current"
        >
          <Icon
            className="pointer-events-none absolute -bottom-[14px] -right-[12px] h-[74px] w-[74px] opacity-[0.13] transition-[opacity,transform] group-hover/tile:scale-[1.06] group-hover/tile:opacity-[0.32]"
            strokeWidth={1.75}
            aria-hidden
          />

          <span className="relative font-jetbrains-mono text-[9.5px] uppercase tracking-[0.18em]">{label}</span>
          <span className="relative truncate text-[11px] tracking-[0.02em] text-[#F1ECE5]/45 transition-colors group-hover/tile:text-white/85">
            {value}
          </span>
        </a>
      ))}
    </div>
  );
}
