import Link from "next/link";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { ArrowLeftIcon } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";
import { ICON_BUTTON } from "@/components/ui/styles";

/** Topo de cada tela do painel, numa linha só: ícone (cheio, como o da aba do trilho) e título,
    uma barrinha e uma frase curta (`description`: a data, a situação do cliente, o que a tela
    é). À direita as ações: o filtro da lista (FilterMenu) e a de criar algo em verde (BUTTON_ADD). `icon` é o mesmo do trilho, pra tela e menu se
    reconhecerem; as telas de dentro (ficha, documento) usam `back`, a seta pra tela de cima, e
    `leading` no lugar do ícone (a logo do cliente na ficha). `subtitle` é a linha miúda embaixo do
    título (o site do cliente).
    Números e detalhes não moram aqui: vão nos blocos da tela. */
export function PageHeader({
  title,
  icon: Icon,
  leading,
  subtitle,
  description,
  actions,
  back,
}: {
  title: string;
  icon?: PhosphorIcon;
  leading?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="mb-6">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {back && (
            <Link href={back.href} aria-label={`Voltar para ${back.label}`} title={back.label} className={`-ml-2 ${ICON_BUTTON}`}>
              <ArrowLeftIcon className="h-4 w-4" aria-hidden weight="bold" />
            </Link>
          )}
          {leading}
          {Icon && <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden weight="fill" />}
          <div className="min-w-0">
            <h1 className="break-words text-[18px] font-bold leading-tight">{title}</h1>
            {subtitle && <div className="truncate text-meta text-ink/55">{subtitle}</div>}
          </div>
        </div>
        {description && <span aria-hidden className="h-6 w-px shrink-0 bg-ink/20" />}
        {description && <div className="min-w-0 font-mono text-meta tracking-[0.06em] text-ink/60">{description}</div>}
        {actions && <div className="ml-auto flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
