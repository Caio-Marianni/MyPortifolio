"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ExternalLink, FileText, LayoutDashboard, LogOut, QrCode, Star, Users } from "lucide-react";
import { LogoMark, RATING_FONT } from "@/components/ui/brand-marks";
import { CV_3D, ON_CHROME_FOCUS } from "@/components/ui/styles";
import { ThemeSwitch } from "@/components/ui/switches";
import { TarjaRelief } from "@/components/ui/tarja-relief";
import { logout } from "@/app/admin/actions";

/* Menu do painel: a tarja do site, com o mesmo relevo e a mesma sombra sobre a folha. Cliente
   só por causa do `usePathname`, que marca a tela atual. Na tela larga é a coluna da esquerda;
   no celular a mesma lista vira uma faixa que rola de lado — nada de menu sanduíche pra abrir e
   fechar. */

const LINKS = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/documentos", label: "Documentos", icon: FileText },
  { href: "/admin/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/admin/avaliacoes", label: "Avaliações", icon: Star },
  { href: "/admin/qr", label: "QR code", icon: QrCode },
];

/* /admin é prefixo de tudo, então só vale exato; as outras valem também nas subpáginas */
const isActive = (pathname: string, href: string) =>
  href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

const ITEM = `flex shrink-0 items-center gap-3 px-3 py-2.5 text-ui transition-colors ${ON_CHROME_FOCUS}`;

/* a tela atual leva o fio laranja: à esquerda na coluna, embaixo na faixa do celular */
const ACTIVE = "bg-chrome-ink/10 font-semibold text-chrome-ink shadow-[inset_0_-2px_0_rgb(var(--accent))] lg:shadow-[inset_2px_0_0_rgb(var(--accent))]";
const IDLE = "text-chrome-ink/65 hover:bg-chrome-ink/5 hover:text-chrome-ink";

export function AdminNav() {
  const pathname = usePathname();

  return (
    /* `max-lg:pb-9`: a folha sobe 24px por cima da faixa no celular, então ela deixa a folga */
    <aside className="relative isolate z-10 flex shrink-0 flex-col overflow-hidden bg-chrome text-chrome-ink shadow-[0_10px_24px_rgba(0,0,0,0.25)] max-lg:pb-9 lg:sticky lg:top-0 lg:h-screen lg:w-[280px] lg:shadow-[12px_0_28px_rgba(0,0,0,0.22)]">
      <TarjaRelief />

      <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-6 lg:px-7 lg:pb-8 lg:pt-10">
        <Link href="/admin" className={`flex items-center gap-3 ${ON_CHROME_FOCUS}`}>
          <span className="h-8 w-8">
            <LogoMark />
          </span>
          {/* Ricko, como os títulos das páginas e o login */}
          <span className={`${RATING_FONT} text-[26px] uppercase leading-none`}>Painel</span>
        </Link>
        <span className="flex items-center gap-4 text-ui lg:hidden">
          <ThemeSwitch />
          <form action={logout} className="flex">
            <button type="submit" aria-label="Sair" className={`opacity-60 transition-opacity hover:opacity-100 ${ON_CHROME_FOCUS}`}>
              <LogOut className="h-[1.2em] w-[1.2em]" strokeWidth={2.5} aria-hidden />
            </button>
          </form>
        </span>
      </div>

      <nav aria-label="Painel" className="flex gap-1 overflow-x-auto px-3 pb-1 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-4 lg:pb-0">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`${ITEM} ${active ? ACTIVE : IDLE}`}>
              <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* o pé da tarja: fio, a tecla creme e, embaixo, as ações discretas */}
      <div className="mx-7 hidden flex-col gap-4 border-t border-chrome-ink/15 pb-10 pt-5 lg:flex">
        <a href="/" target="_blank" rel="noopener noreferrer" className={`${CV_3D} ${ON_CHROME_FOCUS}`}>
          Ver site
          <ExternalLink className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
        </a>
        <div className="flex items-center justify-between text-ui">
          <form action={logout}>
            <button type="submit" className={`flex items-center gap-2 text-chrome-ink/65 transition-colors hover:text-chrome-ink ${ON_CHROME_FOCUS}`}>
              <LogOut className="h-4 w-4" strokeWidth={2} aria-hidden />
              Sair
            </button>
          </form>
          <ThemeSwitch />
        </div>
      </div>
    </aside>
  );
}
