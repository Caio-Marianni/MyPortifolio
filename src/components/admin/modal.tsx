"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { XIcon } from "@phosphor-icons/react/ssr";
import { CARD_TITLE, ICON_BUTTON } from "@/components/ui/styles";

/* Janela do painel: um <dialog> nativo aberto com `showModal()` — foco preso dentro, Esc fecha,
   fundo escurecido e a página atrás parada, sem empurrar o layout. Quem abre é a URL (`?novo`),
   como os formulários da ficha: o erro da action volta pra mesma URL e a janela reabre com ele.

   Abre subindo de baixo, com o fundo escurecendo junto, e fecha ao contrário: desce e some, o
   fundo clareia. Fechar — Esc, XIcon, clique no fundo ou o "Cancelar" (o link marcado com
   `data-modal-close`, ModalActions) — toca a saída primeiro e só no fim troca a URL pra
   `closeHref`. Nesse fim a janela sai do primeiro plano (`dialog.close()`), então a página já
   volta a responder enquanto o servidor devolve a tela sem ela. Salvar não passa por aqui: a
   action redireciona e a janela some com a tela nova. */

/* `sm`: a confirmação de excluir, só uma frase e dois botões */
const WIDTH = { md: "max-w-[720px]", sm: "max-w-[440px]" };

/** a duração da saída (`animate-modal-out`, tailwind.config.ts) */
const EXIT_MS = 180;

export function Modal({ title, closeHref, size = "md", children }: { title: string; closeHref: string; size?: keyof typeof WIDTH; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const close = () => {
    if (closing) return;
    setClosing(true);
    /* quem pediu menos movimento não vê a saída, então não há o que esperar */
    const wait = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : EXIT_MS;
    window.setTimeout(() => {
      ref.current?.close();
      router.replace(closeHref, { scroll: false });
    }, wait);
  };

  /* O "Cancelar" é um <Link> pro mesmo `closeHref`: pego o clique na descida (captura), antes do
     Link navegar, pra ele também sair animado. Ctrl/⌘ + clique segue sendo link comum. */
  const onClickCapture = (event: MouseEvent<HTMLDialogElement>) => {
    const link = (event.target as Element).closest("a[data-modal-close]");
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    event.stopPropagation();
    close();
  };

  return (
    <dialog
      ref={ref}
      aria-label={title}
      /* o Esc dispara `cancel`: o navegador fecharia sozinho, sem a saída; quem fecha é o `close` */
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClickCapture={onClickCapture}
      /* clique no fundo: o alvo é o próprio <dialog> só quando cai fora do painel */
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      className={`m-auto max-h-[90dvh] w-[calc(100%-24px)] ${WIDTH[size]} overflow-y-auto rounded-xl border border-ink/10 bg-sheet p-0 text-ink shadow-[0_24px_60px_-12px_rgb(0_0_0/0.45)] backdrop:bg-black/50 ${
        closing
          ? "animate-modal-out backdrop:animate-backdrop-out motion-reduce:animate-none motion-reduce:backdrop:animate-none"
          : "open:animate-modal-in open:backdrop:animate-fade-in motion-reduce:open:animate-none motion-reduce:open:backdrop:animate-none"
      }`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-5 py-3 md:px-6">
        <h2 className={CARD_TITLE}>{title}</h2>
        <button type="button" onClick={close} aria-label="Fechar" title="Fechar" className={`-mr-2 ${ICON_BUTTON}`}>
          <XIcon className="h-4 w-4" aria-hidden weight="bold" />
        </button>
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </dialog>
  );
}
