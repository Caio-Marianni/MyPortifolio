import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { MessageCircle } from "lucide-react";
import { FIELD, LABEL } from "@/components/ui/form-styles";
import { Badge, type Tone } from "@/components/admin/badge";
import { CopyField } from "@/components/admin/copy-field";
import { DeleteConfirm } from "@/components/admin/delete-confirm";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { PageHeader } from "@/components/admin/page-header";
import { ReviewEditor } from "@/components/admin/review-editor";
import { BUTTON, BUTTON_SOLID, CARD, CARD_TITLE } from "@/components/admin/styles";
import { Stars } from "@/components/ui/brand-marks";
import { ReviewPhoto, ReviewShots } from "@/components/reviews/review-photo";
import { LIMITS, TRACKS, TRACK_LABEL, type ReviewRecord, type Status, type Track } from "@/data/reviews";
import { allProjects } from "@/data/projects";
import { requireAdmin } from "@/services/admin-session";
import { inviteLink } from "@/services/invite";
import { listAll } from "@/services/reviews";
import { decide, remove } from "./actions";

/* Avaliações das duas trilhas — web e thumbnails. Tudo aqui é componente de servidor com
   `<form action={...}>`: moderar funciona antes do JS carregar, e não há estado no cliente pra
   sincronizar com o banco. */
export const metadata: Metadata = { title: "Avaliações" };

const PAGE = "/admin/avaliacoes";

const STATUS_LABEL: Record<Status, string> = {
  pending: "Pendente",
  approved: "No site",
  rejected: "Recusada",
};

const STATUS_TONE: Record<Status, Tone> = {
  pending: "accent",
  approved: "ok",
  rejected: "neutral",
};

/* Botão pra cada destino diferente do estado atual: a mesma fileira serve às três situações,
   sem um `if` por status. */
const MOVES: { status: Status; label: string }[] = [
  { status: "approved", label: "Publicar" },
  { status: "pending", label: "Voltar pra fila" },
  { status: "rejected", label: "Recusar" },
];

/* Formulário GET, não server action: os campos viram a própria URL da tela, o servidor assina
   e devolve a página com o link pronto. Sem estado e sem ida e volta de JavaScript — e o
   endereço resultante é recarregável, então F5 não perde o link gerado. */
function NovoConvite({
  nome,
  empresa,
  trilha,
  projeto,
  link,
}: {
  nome: string;
  empresa: string;
  trilha: Track;
  /** projeto publicado a que a avaliação pertence; vazio quando o trabalho não está no site */
  projeto: number | null;
  link: string | null;
}) {
  const mensagem =
    `Fala, ${nome}! Montei uma página de avaliações no meu site e queria muito a sua. ` +
    `Leva menos de um minuto — já deixei seus dados preenchidos, você só escolhe a nota e escreve duas linhas: ${link}`;

  return (
    <section className={`${CARD} mb-8`}>
      <h2 className={CARD_TITLE}>Novo convite</h2>

      <form method="GET" action={PAGE} className="mt-5 flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

          {/* Trilha e projeto ficam aqui, não no formulário do cliente: quem sabe de qual
              trabalho é a avaliação é você, na hora de mandar o link. */}
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

          <div>
            <label htmlFor="p" className={LABEL}>
              Projeto no site
            </label>
            <select id="p" name="p" defaultValue={projeto ?? ""} className={FIELD}>
              <option value="">— nenhum —</option>
              {allProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className={`${BUTTON_SOLID} self-start`}>
          Gerar link
        </button>
      </form>

      {link && (
        <div className="mt-6 flex flex-col gap-4 border-t border-ink/15 pt-5">
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

          <p className="text-[13px] leading-relaxed text-ink/65">
            O link não expira e vale pra quantas avaliações a pessoa mandar — todas chegam aqui como pendentes.
          </p>
        </div>
      )}
    </section>
  );
}

/* Mesma anatomia do quadro público e da ficha de projeto — foto, nome, nota e só então o texto —,
   pra que a avaliação tenha o mesmo peso nas três telas. O que é só seu (trilha, projeto, e-mail,
   convite, data) fica embaixo, longe da voz do cliente. */
function Card({ review, excluindo, editando }: { review: ReviewRecord; excluindo: boolean; editando: boolean }) {
  const projeto = allProjects.find((project) => project.id === review.project)?.title;
  const meta = [TRACK_LABEL[review.track], projeto, review.email, `convite: ${review.invite}`, review.createdAt];

  /* Editar troca o card inteiro pelo formulário, no mesmo lugar da lista: a decisão de
     publicar continua nos botões de baixo, depois de salvar. */
  if (editando) {
    return (
      <article className={`${CARD} flex flex-col gap-4 border-ink`}>
        <ReviewEditor review={review} />
      </article>
    );
  }

  return (
    <article className={`${CARD} flex flex-col gap-4`}>
      <header className="flex items-center gap-4">
        <ReviewPhoto review={review} className="h-12 w-12 bg-ink/[0.07] text-[19px] text-ink/60" />

        <span className="flex min-w-0 flex-col gap-1.5">
          <span className="text-[15px] leading-tight">
            <span className="font-semibold">{review.name}</span>
            {review.company && <span className="text-ink/60"> · {review.company}</span>}
          </span>

          <Stars count={review.rating} className="text-[13px] text-accent" />
        </span>

        <span className="ml-auto">
          <Badge tone={STATUS_TONE[review.status]}>{STATUS_LABEL[review.status]}</Badge>
        </span>
      </header>

      {review.comment ? (
        <blockquote className="text-[15px] leading-relaxed text-ink/80">{review.comment}</blockquote>
      ) : (
        <p className="text-[15px] italic leading-relaxed text-ink/60">Só a nota, sem comentário.</p>
      )}

      {/* As imagens só carregam aqui porque você tem sessão: a rota serve pendente e recusada
          apenas pra quem tem o cookie do painel. */}
      <ReviewShots review={review} label="Foto do projeto" />

      <p className="text-[13px] leading-tight text-ink/60">{meta.filter(Boolean).join(" · ")}</p>

      {excluindo ? (
        <DeleteConfirm action={remove} fields={{ id: review.id }} message="Some com texto e fotos. Não dá pra desfazer." cancelHref={PAGE} />
      ) : (
        <form action={decide} className="flex flex-wrap items-center gap-2 pt-1">
          <input type="hidden" name="id" value={review.id} />
          {MOVES.filter((move) => move.status !== review.status).map((move) => (
            <button key={move.status} type="submit" name="status" value={move.status} className={BUTTON}>
              {move.label}
            </button>
          ))}

          <Link href={`${PAGE}?editar=${review.id}`} className={`${BUTTON} ml-auto`}>
            Editar
          </Link>

          <Link href={`${PAGE}?excluir=${review.id}`} className={`${BUTTON} text-danger`}>
            Excluir
          </Link>
        </form>
      )}
    </article>
  );
}

type Params = {
  searchParams: Promise<{ ver?: string; n?: string; e?: string; t?: string; p?: string; excluir?: string; editar?: string; nova?: string }>;
};

export default async function AvaliacoesPage(props: Params) {
  await requireAdmin();
  const searchParams = await props.searchParams;

  /* O link sai do host da requisição, não de uma constante: assim o painel de um deploy de
     preview gera link daquele preview, e o do localhost gera link local. */
  const nome = (searchParams.n ?? "").trim();
  const empresa = (searchParams.e ?? "").trim();
  const trilha = TRACKS.includes(searchParams.t as Track) ? (searchParams.t as Track) : "web";
  const escolhido = Number(searchParams.p);
  const projeto = allProjects.some((project) => project.id === escolhido) ? escolhido : null;
  const cabecalhos = await headers();
  const link = nome
    ? inviteLink(`${cabecalhos.get("x-forwarded-proto") ?? "http"}://${cabecalhos.get("host")}`, {
        name: nome,
        company: empresa,
        track: trilha,
        project: projeto,
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

  const ver = (["pending", "approved", "rejected"] as const).find((status) => status === searchParams.ver) ?? "todas";
  const shown = ver === "todas" ? reviews : reviews.filter((review) => review.status === ver);
  const count = (status: Status) => reviews.filter((review) => review.status === status).length;

  return (
    <>
      <PageHeader
        title="Avaliações"
        description="Web e thumbnails. O que você publica aqui aparece no site."
        actions={
          searchParams.nova === undefined && (
            <Link href={`${PAGE}?nova`} className={BUTTON_SOLID}>
              Nova avaliação
            </Link>
          )
        }
      />

      {/* Avaliação que chegou por fora do site: o mesmo editor, vazio. */}
      {searchParams.nova !== undefined && (
        <section className={`${CARD} mb-8 border-ink`}>
          <h2 className={`${CARD_TITLE} mb-5`}>Nova avaliação (WhatsApp, e-mail…)</h2>
          <ReviewEditor />
        </section>
      )}

      <NovoConvite nome={nome} empresa={empresa} trilha={trilha} projeto={projeto} link={link} />

      <FilterTabs
        base={PAGE}
        current={ver}
        options={[
          { value: "todas", label: "Todas", count: reviews.length },
          { value: "pending", label: "Pendentes", count: count("pending") },
          { value: "approved", label: "No site", count: count("approved") },
          { value: "rejected", label: "Recusadas", count: count("rejected") },
        ]}
      />

      {erro && (
        <p role="alert" className="text-[13px] text-danger">
          {erro}
        </p>
      )}

      {!erro && shown.length === 0 && (
        <p className="text-[14px] text-ink/60">
          {reviews.length === 0 ? "Nenhuma avaliação ainda. Gere um convite aí em cima e mande pro cliente." : "Nada neste filtro."}
        </p>
      )}

      {/* A consulta já devolve as pendentes em cima; a ordem da lista é a ordem da fila. */}
      <div className="grid gap-4 lg:grid-cols-2">
        {shown.map((review) => (
          <Card
            key={review.id}
            review={review}
            excluindo={searchParams.excluir === String(review.id)}
            editando={searchParams.editar === String(review.id)}
          />
        ))}
      </div>
    </>
  );
}
