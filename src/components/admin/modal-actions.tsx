import Link from "next/link";
import type { ReactNode } from "react";
import { BUTTON } from "@/components/ui/styles";

/** O rodapé de todo formulário em janela (Modal): Cancelar e a ação, à direita, presos embaixo
    da janela — o <dialog> é quem rola, então o botão fica sempre à vista. As margens negativas
    desfazem o padding do corpo da janela. `hint`: uma dica curta à esquerda (atalho).
    `data-modal-close`: o Modal pega esse clique e fecha com a animação de saída. */
export function ModalActions({ cancelHref, hint, children }: { cancelHref: string; hint?: string; children: ReactNode }) {
  return (
    <div className="sticky bottom-0 -mx-5 -mb-5 flex flex-wrap items-center gap-2 border-t border-ink/10 bg-sheet px-5 py-3 md:-mx-6 md:-mb-6 md:px-6">
      {hint && <span className="text-meta text-ink/45 max-sm:hidden">{hint}</span>}
      <span className="ml-auto flex gap-2">
        <Link href={cancelHref} scroll={false} data-modal-close className={BUTTON}>
          Cancelar
        </Link>
        {children}
      </span>
    </div>
  );
}
