import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { LogIn, LogOut, MessageCircle } from "lucide-react";
import { CapaPage } from "@/components/capa/capa-page";
import { FIELD, LABEL } from "@/components/capa/capa-contact-form";
import { CopyField } from "@/components/admin/copy-field";
import { Stars } from "@/components/ui/brand-marks";
import { LIMITS, TRACKS, TRACK_LABEL, type ReviewRecord, type Status, type Track } from "@/data/reviews";
import { COOKIE, MAX_TRIES, WINDOW_MINUTES, validSession } from "@/services/admin";
import { inviteLink } from "@/services/invite";
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

/* Formulário GET, não server action: os campos viram a própria URL do painel, o servidor
   assina e devolve a página com o link pronto. Sem estado e sem ida e volta de JavaScript —
   e o endereço resultante é recarregável, então F5 não perde o link gerado. */
function NovoConvite({
  nome,
  empresa,
  trilha,
  link,
}: {
  nome: string;
  empresa: string;
  trilha: Track;
  link: string | null;
}) {
  const mensagem =
    `Fala, ${nome}! Montei uma página de avaliações no meu site e queria muito a sua. ` +
    `Leva menos de um minuto — já deixei seus dados preenchidos, você só escolhe a nota e escreve duas linhas: ${link}`;

  return (
    <section className="mb-10 border border-[#101010]/15 p-6">
      <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#101010]/45">Novo convite</h2>

      <form method="GET" action="/admin" className="mt-5 flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="n" className={LABEL}>
              Nome do cliente
            </label>
            <input id="n" name="n" required defaultValue={nome} maxLength={LIMITS.name} className={FIELD} />
          </div>

          <div>
            <label htmlFor="e" className={LABEL}>
              Canal ou empresa
            </label>
            <input id="e" name="e" defaultValue={empresa} maxLength={LIMITS.company} className={FIELD} />
          </div>

          <div>
            <label htmlFor="t" className={LABEL}>
              Trabalho
            </label>
            <select id="t" name="t" defaultValue={trilha} className={FIELD}>
              {TRACKS.map((track) => (
                <option key={track} value={track}>
                  {TRACK_LABEL[track]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className={`${BUTTON} self-start`}>
          Gerar link
        </button>
      </form>

      {link && (
        <div className="mt-6 flex flex-col gap-4 border-t border-[#101010]/15 pt-5">
          <CopyField value={link} />

          {/* wa.me sem número: o WhatsApp abre com a mensagem escrita e você escolhe pra quem. */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(mensagem)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BUTTON} inline-flex items-center gap-2 self-start`}
          >
            Mandar no WhatsApp
            <MessageCircle className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
          </a>

          <p className="text-[13px] leading-relaxed text-[#101010]/55">
            O link não expira e vale pra quantas avaliações a pessoa mandar — todas chegam aqui como pendentes.
          </p>
        </div>
      )}
    </section>
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

type Params = { searchParams: { erro?: string; n?: string; e?: string; t?: string } };

export default async function AdminPage({ searchParams }: Params) {
  if (!validSession(cookies().get(COOKIE)?.value)) {
    return (
      <CapaPage wordmark="Moderar" descriptor="Área restrita">
        <Login erro={searchParams.erro} />
      </CapaPage>
    );
  }

  /* O link sai do host da requisição, não de uma constante: assim o painel de um deploy de
     preview gera link daquele preview, e o do localhost gera link local. */
  const nome = (searchParams.n ?? "").trim();
  const empresa = (searchParams.e ?? "").trim();
  const trilha = TRACKS.includes(searchParams.t as Track) ? (searchParams.t as Track) : "web";
  const cabecalhos = headers();
  const link = nome
    ? inviteLink(`${cabecalhos.get("x-forwarded-proto") ?? "http"}://${cabecalhos.get("host")}`, {
        name: nome,
        company: empresa,
        track: trilha,
      })
    : null;

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

      <NovoConvite nome={nome} empresa={empresa} trilha={trilha} link={link} />

      {erro && (
        <p role="alert" className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#B3261E]">
          {erro}
        </p>
      )}

      {!erro && reviews.length === 0 && (
        <p className="text-[15px] leading-relaxed text-[#101010]/55">
          Nenhuma avaliação ainda. Gere um convite aí em cima e mande pro cliente.
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
