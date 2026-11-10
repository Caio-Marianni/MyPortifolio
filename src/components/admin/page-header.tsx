import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { RATING_FONT } from "@/components/ui/brand-marks";
import { SHEET_HEADER } from "@/components/ui/styles";

/** Topo de cada tela do painel: título, uma linha de contexto e as ações da tela à direita.
    `back` é a tela de cima — a ficha do cliente volta pra lista, por exemplo.
    Desenho das páginas do site: título em Ricko, a linha de contexto na voz mono e o fio do
    SHEET_HEADER de borda a borda da folha. */
export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="mb-8">
      {back && (
        <Link href={back.href} className="mb-4 inline-flex items-center gap-1.5 text-meta font-semibold text-ink/60 hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
          {back.label}
        </Link>
      )}
      <div className={SHEET_HEADER}>
        <div className="min-w-0">
          {/* Ricko tem um peso só: sem `font-bold`, que o navegador sintetizaria */}
          <h1 className={`${RATING_FONT} break-words text-[clamp(36px,5vw,56px)] uppercase leading-[0.9]`}>{title}</h1>
          {description && <div className="mt-2 font-mono text-meta tracking-[0.06em] text-ink/60">{description}</div>}
        </div>
        {/* `pt-2` e não margem: com `items-baseline` o padding some ao lado do título e só aparece
            quando as ações quebram para baixo dele, no celular */}
        {actions && <div className="flex flex-wrap items-center gap-2 pt-2">{actions}</div>}
      </div>
    </header>
  );
}
