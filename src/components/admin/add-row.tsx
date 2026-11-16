import Link from "next/link";
import type { ReactNode } from "react";
import { PlusIcon } from "@phosphor-icons/react/ssr";
import { FOCUS } from "@/components/ui/styles";

/* `small`: a de dentro de um item (nova parcela de um projeto), um degrau abaixo da da seção, para
   as duas não disputarem quando ficam uma embaixo da outra. Strings inteiras por tamanho, para
   nenhum `py-`/`text-` brigar na mesma classe. */
const SIZE = {
  normal: "py-3 text-ui",
  small: "py-2 text-meta",
};

/** O convite de um bloco vazio da ficha ("Novo plano", "Nova parcela"): a faixa tracejada que
    abre o formulário na janela. Com itens no bloco, quem cria é o "+" do título. `scroll={false}`:
    abrir não rola a ficha pro topo. */
export function AddRow({ href, small = false, children }: { href: string; small?: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      className={`group flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-ink/25 px-4 font-semibold text-ink/60 transition-colors hover:border-accent hover:bg-accent/[0.06] hover:text-ink ${SIZE[small ? "small" : "normal"]} ${FOCUS}`}
    >
      <PlusIcon className="h-4 w-4 text-ink/45 group-hover:text-accent" aria-hidden weight="bold" />
      {children}
    </Link>
  );
}
