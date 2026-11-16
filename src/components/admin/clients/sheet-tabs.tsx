"use client";

import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { FileTextIcon, KeyIcon, WalletIcon } from "@phosphor-icons/react/ssr";
import { SHEET_TABS, sheetTab, tabHref, type SheetTab } from "@/components/admin/clients/tabs";
import { ROW_FOCUS } from "@/components/ui/styles";

/* As abas da ficha do cliente. O servidor já manda as três montadas (`panels`) — os dados de
   todas vêm na mesma visita, que as contagens das abas precisam deles —, e trocar de aba só troca
   qual aparece, aqui no navegador: instantâneo, sem ida ao servidor nem ao banco. A URL acompanha
   (`?aba=`, pelo `history.pushState`, que o Next sincroniza com o `useSearchParams`), então F5,
   voltar e link direto para a aba continuam valendo.

   A barra laranja embaixo da aba atual é uma peça só que desliza até a aba clicada. Posição e
   largura são medidas do link (cada aba tem uma largura), então vão em `style`: não há classe
   pronta pra um número que só existe depois de medir. Antes de medir — o primeiro paint, que vem
   do servidor — a aba atual pinta o próprio sublinhado, no mesmo lugar; medida a barra, ele sai.
   A barra só passa a deslizar depois da primeira medida, senão entraria deslizando do canto. */

const TAB: Record<SheetTab, { label: string; icon: PhosphorIcon }> = {
  financeiro: { label: "Financeiro", icon: WalletIcon },
  contas: { label: "Contas e acessos", icon: KeyIcon },
  documentos: { label: "Documentos", icon: FileTextIcon },
};

/** A aba que a URL diz agora — depois de um clique numa aba, é a nova. */
function useUrlTab(): SheetTab {
  return sheetTab(Object.fromEntries(useSearchParams().entries()));
}

/** Link que abre uma janela da ficha (Editar, Excluir cliente) a partir da aba em que você está:
    a janela fecha de volta nela. O endereço sai da URL atual, não da que o servidor viu — a aba
    pode ter trocado aqui no navegador desde então. */
export function TabLink({ page, query, className, children }: { page: string; query: string; className: string; children: ReactNode }) {
  const here = tabHref(page, useUrlTab());
  return (
    <Link href={`${here}${here.includes("?") ? "&" : "?"}${query}`} scroll={false} className={className}>
      {children}
    </Link>
  );
}

export function SheetTabs({
  page,
  info,
  panels,
}: {
  page: string;
  /** ao lado do nome: a contagem e o ponto vermelho de "precisa de você" */
  info: Partial<Record<SheetTab, { count?: string; alert?: boolean }>>;
  /** o conteúdo de cada aba, montado no servidor */
  panels: Record<SheetTab, ReactNode>;
}) {
  const fromUrl = useUrlTab();
  const [selected, setSelected] = useState(fromUrl);
  const [bar, setBar] = useState<{ left: number; width: number } | null>(null);
  const [sliding, setSliding] = useState(false);
  const links = useRef<Partial<Record<SheetTab, HTMLAnchorElement | null>>>({});

  /* a URL mudou por fora (voltar do navegador, action que voltou noutra aba): segue ela */
  useEffect(() => setSelected(fromUrl), [fromUrl]);

  /* mede antes de pintar, e de novo quando a largura muda (fonte que carregou, janela) */
  useLayoutEffect(() => {
    const measure = () => {
      const link = links.current[selected];
      if (link) setBar({ left: link.offsetLeft, width: link.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [selected]);

  /* liga a transição só depois que a barra já está no lugar */
  useEffect(() => {
    if (bar && !sliding) setSliding(true);
  }, [bar, sliding]);

  /* clique comum troca aqui mesmo; com Ctrl/⌘/Shift ou botão do meio, o navegador abre o link
     como sempre (outra aba, outra janela) */
  const choose = (tab: SheetTab) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (tab === selected) return;
    setSelected(tab);
    window.history.pushState(null, "", tabHref(page, tab));
  };

  return (
    <>
      <nav aria-label="Abas da ficha" className="sticky top-0 z-20 mb-6 flex gap-1 overflow-x-auto border-b border-ink/10 bg-sheet/95 backdrop-blur">
        {SHEET_TABS.map((tab) => {
          const { label, icon: Icon } = TAB[tab];
          const active = tab === selected;
          const extra = info[tab];
          return (
            <a
              key={tab}
              ref={(element) => {
                links.current[tab] = element;
              }}
              href={tabHref(page, tab)}
              onClick={choose(tab)}
              aria-current={active ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap px-3 py-3 text-ui transition-colors duration-200 ${ROW_FOCUS} ${
                active ? "font-semibold text-ink" : "text-ink/55 hover:text-ink"
              } ${active && !bar ? "shadow-[inset_0_-2px_0_rgb(var(--accent))]" : ""}`}
            >
              <Icon className="h-4 w-4" aria-hidden weight="bold" />
              {label}
              {extra?.count && <span className="font-mono text-meta font-normal text-ink/45">{extra.count}</span>}
              {extra?.alert && (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-danger" aria-hidden />
                  <span className="sr-only">(precisa de atenção)</span>
                </>
              )}
            </a>
          );
        })}
        {bar && (
          <span
            aria-hidden
            className={`pointer-events-none absolute bottom-0 left-0 h-[2px] bg-accent ${
              sliding ? "transition-[transform,width] duration-200 ease-out motion-reduce:transition-none" : ""
            }`}
            style={{ width: bar.width, transform: `translateX(${bar.left}px)` }}
          />
        )}
      </nav>

      {/* as três abas na página; só a escolhida aparece */}
      {SHEET_TABS.map((tab) => (
        <div key={tab} hidden={tab !== selected}>
          {panels[tab]}
        </div>
      ))}
    </>
  );
}
