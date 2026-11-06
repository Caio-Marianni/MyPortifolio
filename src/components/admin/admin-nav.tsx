"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ExternalLink, FileText, Inbox, LayoutDashboard, LogOut, QrCode, Star, Users } from "lucide-react";
import { LogoMark, ThemeSwitch } from "@/components/capa/capa-page";
import { logout } from "@/app/admin/actions";

/* Menu do painel. Cliente só por causa do `usePathname`, que marca a tela atual. Na tela larga
   é a coluna da esquerda; no celular a mesma lista vira uma faixa que rola de lado — nada de
   menu sanduíche pra abrir e fechar. */

const LINKS = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/documentos", label: "Documentos", icon: FileText },
  { href: "/admin/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/admin/avaliacoes", label: "Avaliações", icon: Star },
  { href: "/admin/mensagens", label: "Mensagens", icon: Inbox },
  { href: "/admin/qr", label: "QR code", icon: QrCode },
];

/* /admin é prefixo de tudo, então só vale exato; as outras valem também nas subpáginas */
const isActive = (pathname: string, href: string) =>
  href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

const ITEM =
  "flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-[13.5px] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-chrome-ink";

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="flex shrink-0 flex-col bg-chrome text-chrome-ink lg:sticky lg:top-0 lg:h-screen lg:w-60">
      <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-5 lg:pb-6">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="h-7 w-7">
            <LogoMark />
          </span>
          <span className="font-makaio text-[20px] uppercase leading-none tracking-[0.08em]">Painel</span>
        </Link>
        <span className="flex items-center gap-4 text-[14px] lg:hidden">
          <ThemeSwitch />
          <form action={logout} className="flex">
            <button type="submit" aria-label="Sair" className="opacity-60 transition-opacity hover:opacity-100">
              <LogOut className="h-[1.2em] w-[1.2em]" strokeWidth={2.5} aria-hidden />
            </button>
          </form>
        </span>
      </div>

      <nav aria-label="Painel" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`${ITEM} ${active ? "bg-chrome-ink/15 text-chrome-ink" : "text-chrome-ink/65 hover:bg-chrome-ink/5 hover:text-chrome-ink"}`}
            >
              <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden flex-col gap-1 border-t border-chrome-ink/10 px-3 py-4 lg:flex">
        <a href="/" target="_blank" rel="noopener noreferrer" className={`${ITEM} text-chrome-ink/65 hover:text-chrome-ink`}>
          <ExternalLink className="h-4 w-4" strokeWidth={2} aria-hidden />
          Ver site
        </a>
        <form action={logout}>
          <button type="submit" className={`${ITEM} w-full text-chrome-ink/65 hover:text-chrome-ink`}>
            <LogOut className="h-4 w-4" strokeWidth={2} aria-hidden />
            Sair
          </button>
        </form>
        <span className="px-3 pt-2 text-[14px]">
          <ThemeSwitch />
        </span>
      </div>
    </aside>
  );
}
