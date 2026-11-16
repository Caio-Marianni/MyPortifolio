import type { ReactNode } from "react";
import { CARD_TITLE } from "@/components/ui/styles";

/** Bloco da ficha do cliente: cabeçalho com ícone, título, contagem e um resumo à direita, e a
    ação do bloco no canto (o "+" de criar). O cabeçalho é uma faixa de tom próprio (`paper-head`),
    como o das tabelas: título e conteúdo não se misturam. Não recolhe: a ficha é dividida em abas,
    então cada aba já mostra pouca coisa. `id` é a âncora para onde as actions voltam. */
export function SectionCard({
  id,
  icon,
  title,
  count,
  summary,
  action,
  className = "",
  children,
}: {
  id: string;
  icon: ReactNode;
  title: string;
  count?: number;
  summary?: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-24 overflow-hidden rounded-xl border border-ink/10 bg-paper ${className}`}>
      <header className="flex min-h-[52px] items-center gap-2.5 border-b border-ink/10 bg-paper-head px-5 py-2 md:px-6">
        <span className="shrink-0 text-ink/55" aria-hidden>
          {icon}
        </span>
        <h2 className={`${CARD_TITLE} whitespace-nowrap`}>{title}</h2>
        {count !== undefined && <span className="font-mono text-meta text-ink/45">{count}</span>}
        <span className="ml-auto min-w-0 truncate text-right font-mono text-meta text-ink/65">{summary}</span>
        {action && <span className="-mr-2 shrink-0">{action}</span>}
      </header>
      <div className="flex flex-col gap-4 p-5 md:p-6">{children}</div>
    </section>
  );
}
