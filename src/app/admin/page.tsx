import type { Metadata } from "next";
import { LogIn, LogOut } from "lucide-react";
import { CapaPage } from "@/components/capa/capa-page";
import { FIELD, LABEL } from "@/components/capa/capa-contact-form";
import { Stars } from "@/components/ui/brand-marks";
import { TRACK_LABEL, type ReviewRecord, type Status } from "@/data/reviews";
import { cookies } from "next/headers";
import { COOKIE, MAX_TRIES, WINDOW_MINUTES, validSession } from "@/services/admin";
import { listAll } from "@/services/reviews";
import { decide, login, logout } from "./actions";

/* Painel só seu: em português e fora do índice. Tudo aqui é componente de servidor com
   `<form action={...}>` — moderar funciona mesmo antes do JS carregar, e não há um byte de
   estado no cliente pra sincronizar com o banco. */
export const metadata: Metadata = {
  title: "Moderar",
  robots: { index: false, follow: false },
};

const STATUS_LABEL: Record<Status, string> = {
  pending: "Pendente",
  approved: "No site",
  rejected: "Recusada",
};

const STATUS_STYLE: Record<Status, string> = {
  pending: "bg-[#FF5500] text-white",
  approved: "bg-[#101010] text-[#F1ECE5]",
  rejected: "bg-[#101010]/10 text-[#101010]/50",
};

/* Botão pra cada destino diferente do estado atual: a mesma fileira serve às três situações,
   sem um `if` por status. */
const MOVES: { status: Status; label: string }[] = [
  { status: "approved", label: "Publicar" },
  { status: "pending", label: "Voltar pra fila" },
  { status: "rejected", label: "Recusar" },
];

const BUTTON =
  "rounded-full border border-[#101010]/25 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors hover:border-[#101010] hover:bg-[#101010] hover:text-[#F1ECE5] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#101010]";

/* Uma mensagem por motivo, e nenhuma delas diz qual metade errou: quem tenta adivinhar não
   ganha pista, e você sabe na hora se foi digitação, tranca ou banco fora do ar. */
const ERROS: Record<string, string> = {
  credenciais: "Usuário ou senha incorretos.",
  bloqueado: `Errou ${MAX_TRIES} vezes. Espere ${WINDOW_MINUTES} minutos antes de tentar de novo.`,
  banco: "Não consegui falar com o banco. Confira a DATABASE_URL.",
};

function Login({ erro }: { erro?: string }) {
  return (
    /* autoComplete off nos dois campos: o gerenciador de senhas preencheria o usuário, que
       precisa ficar vazio, e o login falharia sem você entender por quê. */
    <form action={login} autoComplete="off" className="flex max-w-[360px] flex-col gap-5">
      <div>
        <label htmlFor="user" className={LABEL}>
          Usuário
        </label>
        <input type="text" id="user" name="user" autoComplete="off" className={FIELD} />
      </div>

      <div>
        <label htmlFor="password" className={LABEL}>
          Senha
        </label>
        <input type="password" id="password" name="password" required autoComplete="off" className={FIELD} />
      </div>

      {erro && ERROS[erro] && (
        <p role="alert" className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#B3261E]">
          {ERROS[erro]}
        </p>
      )}

      <button
        type="submit"
        className="flex items-center gap-2 self-start rounded-full bg-[#101010] px-7 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#F1ECE5] transition-opacity hover:opacity-80"
      >
        Entrar
        <LogIn className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
      </button>
    </form>
  );
}

function Card({ review }: { review: ReviewRecord }) {
  const meta = [review.company, TRACK_LABEL[review.track], review.email, `convite: ${review.invite}`, review.createdAt];

  return (
    <article className="flex flex-col gap-4 border border-[#101010]/15 p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <span className={`rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] ${STATUS_STYLE[review.status]}`}>
          {STATUS_LABEL[review.status]}
        </span>
        <Stars count={review.rating} className="text-[15px] text-[#FF5500]" />
      </header>

      <blockquote className="text-[15px] leading-relaxed text-[#101010]/80">{review.comment}</blockquote>

      <div>
        <p className="font-makaio text-[20px] font-black uppercase leading-none tracking-[0.04em]">{review.name}</p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#101010]/45">
          {meta.filter(Boolean).join(" · ")}
        </p>
      </div>

      <form action={decide} className="flex flex-wrap gap-2 pt-1">
        <input type="hidden" name="id" value={review.id} />
        {MOVES.filter((move) => move.status !== review.status).map((move) => (
          <button key={move.status} type="submit" name="status" value={move.status} className={BUTTON}>
            {move.label}
          </button>
        ))}
      </form>
    </article>
  );
}

export default async function AdminPage({ searchParams }: { searchParams: { erro?: string } }) {
  if (!validSession(cookies().get(COOKIE)?.value)) {
    return (
      <CapaPage wordmark="Moderar" descriptor="Área restrita">
        <Login erro={searchParams.erro} />
      </CapaPage>
    );
  }

  let reviews: ReviewRecord[] = [];
  let erro: string | null = null;
  try {
    reviews = await listAll();
  } catch (error) {
    console.error("[admin] falha ao ler avaliações:", error);
    erro = "Não consegui falar com o banco. Confira DATABASE_URL.";
  }

  const pendentes = reviews.filter((review) => review.status === "pending").length;

  return (
    <CapaPage
      wordmark="Moderar"
      descriptor="Área restrita"
      stats={[`${reviews.length} no total`, `${pendentes} aguardando você`]}
    >
      <form action={logout} className="mb-8">
        <button type="submit" className={`${BUTTON} inline-flex items-center gap-2`}>
          Sair
          <LogOut className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
        </button>
      </form>

      {erro && (
        <p role="alert" className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#B3261E]">
          {erro}
        </p>
      )}

      {!erro && reviews.length === 0 && (
        <p className="text-[15px] leading-relaxed text-[#101010]/55">
          Nenhuma avaliação ainda. Gere um link com <code className="font-mono">npm run invite</code> e mande pro cliente.
        </p>
      )}

      {/* A consulta já devolve as pendentes em cima; a ordem da lista é a ordem da fila. */}
      <div className="grid gap-4 lg:grid-cols-2">
        {reviews.map((review) => (
          <Card key={review.id} review={review} />
        ))}
      </div>
    </CapaPage>
  );
}
