import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

/** Topo de cada tela do painel: título, uma linha de contexto e as ações da tela à direita.
    `back` é a tela de cima — a ficha do cliente volta pra lista, por exemplo. */
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
    <header className="mb-8 border-b border-ink/10 pb-6">
      {back && (
        <Link href={back.href} className="mb-3 inline-flex items-center gap-1.5 text-meta text-ink/60 hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[26px] font-semibold leading-tight tracking-tight">{title}</h1>
          {description && <div className="mt-1.5 text-ui text-ink/60">{description}</div>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  );
}
