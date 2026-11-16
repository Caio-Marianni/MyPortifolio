import type { ReactNode } from "react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { CaretDownIcon } from "@phosphor-icons/react/ssr";

/* As peças dos formulários em janela (Modal) do painel: os campos agrupados em cards — o creme
   dos cards com os campos brancos dentro —, cada um com o ícone e o título do grupo. O padrão
   saiu do "Novo cliente" e vale pra todos: plano, projeto, parcela, conta, documento. */

export const CARD_BOX = "rounded-lg border border-ink/10 bg-paper";

const COLUMNS = { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3" };

function CardTitle({ icon: Icon, title, hint }: { icon: PhosphorIcon; title: string; hint?: string }) {
  return (
    <span className="flex items-baseline gap-2">
      <Icon className="h-4 w-4 shrink-0 self-center text-ink/45" aria-hidden weight="bold" />
      <span className="text-meta font-semibold uppercase tracking-[0.06em] text-ink/70">{title}</span>
      {hint && <span className="text-meta text-ink/45">{hint}</span>}
    </span>
  );
}

/** Um grupo de campos: <fieldset> sem a moldura do navegador, a <legend> vira o título do card. */
export function FormCard({
  icon,
  title,
  hint,
  columns = 2,
  children,
}: {
  icon: PhosphorIcon;
  title: string;
  hint?: string;
  columns?: keyof typeof COLUMNS;
  children: ReactNode;
}) {
  return (
    <fieldset className={`min-w-0 p-4 ${CARD_BOX}`}>
      <legend className="float-left mb-4 w-full">
        <CardTitle icon={icon} title={title} hint={hint} />
      </legend>
      <div className={`clear-left grid gap-4 ${COLUMNS[columns]}`}>{children}</div>
    </fieldset>
  );
}

/** O grupo opcional (anotações, o que o plano inclui): recolhido, abre pelo título. `open` quando
    já tem algo escrito. */
export function FormCardDetails({ icon, title, hint, open = false, children }: { icon: PhosphorIcon; title: string; hint?: string; open?: boolean; children: ReactNode }) {
  return (
    <details className={`group ${CARD_BOX}`} open={open}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4 [&::-webkit-details-marker]:hidden">
        <CardTitle icon={icon} title={title} hint={hint} />
        <CaretDownIcon className="h-4 w-4 text-ink/45 group-open:rotate-180" aria-hidden weight="bold" />
      </summary>
      <div className="px-4 pb-4">{children}</div>
    </details>
  );
}
