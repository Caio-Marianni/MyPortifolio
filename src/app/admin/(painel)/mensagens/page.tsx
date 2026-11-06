import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Badge } from "@/components/admin/badge";
import { DeleteConfirm } from "@/components/admin/delete-confirm";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { PageHeader } from "@/components/admin/page-header";
import { BUTTON, CARD } from "@/components/admin/styles";
import { requireAdmin } from "@/services/admin-session";
import { listMessages, type Message } from "@/services/contact";
import { removeMessage, toggleAnswered } from "./actions";

export const metadata: Metadata = { title: "Mensagens" };

const PAGE = "/admin/mensagens";

const FILTERS = {
  novas: (message: Message) => !message.answered,
  respondidas: (message: Message) => message.answered,
  todas: () => true,
};
type Filter = keyof typeof FILTERS;

/* Mensagens do formulário de contato. Responder é pelo e-mail — o botão já abre com o assunto —,
   e a respondida sai da caixa de entrada sem sumir do histórico. */
function MessageItem({ message, excluindo }: { message: Message; excluindo: boolean }) {
  return (
    <li className="flex flex-col gap-3 py-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[15px] font-semibold">{message.name}</span>
        <span className="text-[13px] text-ink/60">{message.email}</span>
        <span className="text-[13px] text-ink/50">{message.createdAt}</span>
        {!message.answered && <Badge tone="accent">Nova</Badge>}
      </div>

      <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink/85">{message.message}</p>

      {excluindo ? (
        <DeleteConfirm action={removeMessage} fields={{ id: message.id }} message="Some de vez." cancelHref={PAGE} />
      ) : (
        <form action={toggleAnswered} className="flex flex-wrap items-center gap-2">
          <input type="hidden" name="id" value={message.id} />
          <input type="hidden" name="answered" value={message.answered ? "0" : "1"} />
          <a
            href={`mailto:${message.email}?subject=${encodeURIComponent("Re: contato pelo site")}`}
            className={`${BUTTON} inline-flex items-center gap-2`}
          >
            Responder
            <Mail className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
          </a>
          <button type="submit" className={BUTTON}>
            {message.answered ? "Reabrir" : "Marcar respondida"}
          </button>
          <Link href={`${PAGE}?excluir=${message.id}`} className={`${BUTTON} ml-auto text-danger`}>
            Excluir
          </Link>
        </form>
      )}
    </li>
  );
}

type Params = { searchParams: Promise<{ ver?: string; excluir?: string }> };

export default async function MensagensPage(props: Params) {
  await requireAdmin();
  const searchParams = await props.searchParams;
  const ver: Filter = searchParams.ver && searchParams.ver in FILTERS ? (searchParams.ver as Filter) : "novas";

  const messages = await listMessages().catch((error: unknown) => {
    console.error("[admin] falha ao ler mensagens:", error);
    return null;
  });
  const all = messages ?? [];
  const shown = all.filter(FILTERS[ver]);

  return (
    <>
      <PageHeader title="Mensagens" description="O que chegou pelo formulário de contato do site." />

      <FilterTabs
        base={PAGE}
        current={ver}
        options={[
          { value: "novas", label: "Novas", count: all.filter(FILTERS.novas).length },
          { value: "respondidas", label: "Respondidas", count: all.filter(FILTERS.respondidas).length },
          { value: "todas", label: "Todas", count: all.length },
        ]}
      />

      {messages === null ? (
        <p role="alert" className="text-[13px] text-danger">
          Não consegui ler as mensagens. A tabela foi criada? Rode `npm run migrate`.
        </p>
      ) : shown.length === 0 ? (
        <p className="text-[14px] text-ink/60">{ver === "novas" ? "Caixa de entrada vazia." : "Nada por aqui."}</p>
      ) : (
        <ul className={`${CARD} divide-y divide-ink/10 py-0 md:py-0`}>
          {shown.map((message) => (
            <MessageItem key={message.id} message={message} excluindo={searchParams.excluir === String(message.id)} />
          ))}
        </ul>
      )}
    </>
  );
}
