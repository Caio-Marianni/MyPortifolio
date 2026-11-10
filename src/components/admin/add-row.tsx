import Link from "next/link";
import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { FOCUS } from "@/components/ui/styles";

/* `small`: a de dentro de um item (nova parcela de um projeto), um degrau abaixo da da seção, para
   as duas não disputarem quando ficam uma embaixo da outra. Strings inteiras por tamanho, para
   nenhum `py-`/`text-` brigar na mesma classe. */
const SIZE = {
  normal: "py-3 text-ui",
  small: "py-2 text-meta",
};

/** Adicionar, no fim da lista: a faixa tracejada fica onde o item novo vai entrar, e o formulário
    abre ali mesmo, no lugar dela. `scroll={false}`: abrir não rola a ficha pro topo. */
export function AddRow({ href, small = false, children }: { href: string; small?: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      className={`group flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-ink/25 px-4 font-semibold text-ink/60 transition-colors hover:border-accent hover:bg-accent/[0.06] hover:text-ink ${SIZE[small ? "small" : "normal"]} ${FOCUS}`}
    >
      <Plus className="h-4 w-4 text-ink/45 transition-[color,transform] group-hover:rotate-90 group-hover:text-accent" strokeWidth={2.5} aria-hidden />
      {children}
    </Link>
  );
}
