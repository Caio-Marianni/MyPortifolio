import Link from "next/link";
import { CheckIcon, XIcon } from "@phosphor-icons/react/ssr";
import { SubmitButton } from "@/components/admin/submit-button";
import { FOCUS } from "@/components/ui/styles";
import { undoPayment } from "@/app/admin/(painel)/clientes/[id]/actions";

/* O aviso do que a última ação fez (`?ok=`), no canto da tela: o item piscando mostra onde,
   este diz o quê — e é o que o leitor de tela ouve (`role="status"`). Some sozinho depois de uns
   segundos (`animate-notice`), mas para enquanto o mouse ou o foco estão nele, pra dar tempo de
   clicar no "Desfazer". Recebimento traz o "Desfazer", que é o erro mais fácil de cometer. */

const MESSAGES = {
  salvo: "Salvo.",
  recebido: "Recebimento registrado.",
  excluido: "Removido.",
  desfeito: "Recebimento desfeito.",
} as const;

export function ActionNotice({
  ok,
  undo,
  closeHref,
}: {
  ok?: string;
  /** campos do "Desfazer" (`clientId`, `id` do pagamento, `anchor` ou `voltar`); só no recebido */
  undo?: Record<string, string | number>;
  /** a mesma tela sem o aviso */
  closeHref: string;
}) {
  if (!ok || !Object.hasOwn(MESSAGES, ok)) return null;
  const key = ok as keyof typeof MESSAGES;

  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-4 z-30 flex animate-notice items-center gap-3 rounded-lg bg-fill py-3 pl-4 pr-2 text-ui text-fill-ink shadow-[0_14px_30px_-10px_rgb(0_0_0/0.5)] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] sm:left-auto sm:right-6 sm:bottom-6"
    >
      <CheckIcon className="h-4 w-4 shrink-0" aria-hidden weight="bold" />
      <span className="flex-1">{MESSAGES[key]}</span>
      {key === "recebido" && undo && (
        <form action={undoPayment}>
          {Object.entries(undo).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          <SubmitButton className={`inline-flex items-center gap-1.5 rounded px-1 font-semibold underline underline-offset-4 ${FOCUS}`}>
            Desfazer
          </SubmitButton>
        </form>
      )}
      <Link href={closeHref} scroll={false} aria-label="Fechar aviso" className={`rounded p-1.5 opacity-70 transition-opacity hover:opacity-100 ${FOCUS}`}>
        <XIcon className="h-4 w-4" aria-hidden weight="bold" />
      </Link>
    </div>
  );
}
