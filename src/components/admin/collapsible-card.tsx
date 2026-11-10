"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { CARD_TITLE, ROW_FOCUS } from "@/components/ui/styles";

/* Bloco da ficha que recolhe pelo título: um <details> de verdade (teclado, leitor de tela e o
   abrir/fechar vêm do navegador), com o cabeçalho que resume o bloco — ícone, título, contagem e
   um resumo à direita — e o fio de borda a borda embaixo dele, como os cabeçalhos do site.

   A escolha fica no navegador (localStorage), por bloco e não por cliente: quem recolhe
   "Recebido" numa ficha quer ele recolhido nas outras. Ela vale do primeiro paint em diante —
   o servidor sempre manda aberto, e o efeito fecha se a pessoa tinha fechado.

   `forceOpen`: a URL aponta para dentro do bloco (formulário aberto, item que acabou de mudar).
   Aí ele abre mesmo que estivesse recolhido, senão a âncora e o formulário ficariam escondidos. */

const KEY = "painel:recolhido:";

export function CollapsibleCard({
  id,
  icon,
  title,
  count,
  summary,
  forceOpen = false,
  className = "",
  children,
}: {
  /** âncora do bloco e chave da escolha no navegador */
  id: string;
  icon: ReactNode;
  title: string;
  count?: number;
  summary?: ReactNode;
  forceOpen?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const details = ref.current;
    if (!details) return;
    if (forceOpen) {
      details.open = true;
      return;
    }
    try {
      if (localStorage.getItem(KEY + id) === "1") details.open = false;
    } catch {
      /* navegação restrita: sem lembrar, o bloco só fica aberto */
    }
  }, [id, forceOpen]);

  /* grava no clique do título (Enter e espaço também clicam), não no `toggle`: o `toggle` dispara
     também quando o efeito abre ou fecha sozinho, e aí uma abertura forçada apagaria a escolha */
  const remember = () => {
    try {
      localStorage.setItem(KEY + id, ref.current?.open ? "1" : "0");
    } catch {
      /* sem localStorage a escolha vale só até recarregar */
    }
  };

  return (
    <section id={id} className={`scroll-mt-24 bg-paper ${className}`}>
      <details ref={ref} open className="group">
        <summary
          onClick={remember}
          className={`flex cursor-pointer list-none items-center gap-2.5 px-5 py-4 transition-colors hover:bg-ink/[0.03] md:px-6 md:py-5 [&::-webkit-details-marker]:hidden ${ROW_FOCUS}`}
        >
          <span className="shrink-0 text-ink/45" aria-hidden>
            {icon}
          </span>
          <h2 className={`${CARD_TITLE} whitespace-nowrap`}>{title}</h2>
          {count !== undefined && <span className="font-mono text-meta text-ink/45">{count}</span>}
          <span className="ml-auto min-w-0 truncate text-right font-mono text-meta text-ink/65">{summary}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-ink/40 transition-transform duration-200 group-open:rotate-180" strokeWidth={2.25} aria-hidden />
        </summary>
        <div className="flex flex-col gap-4 border-t border-ink/10 px-5 pb-5 pt-5 md:px-6 md:pb-6">{children}</div>
      </details>
    </section>
  );
}
