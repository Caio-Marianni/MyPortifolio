import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { PageHeader } from "@/components/admin/page-header";
import { InviteForm } from "@/components/admin/reviews/invite-form";
import { ReviewCard } from "@/components/admin/reviews/review-card";
import { ReviewEditor } from "@/components/admin/reviews/review-editor";
import { BUTTON_SOLID, CARD, CARD_TITLE } from "@/components/ui/styles";
import { TRACKS, type ReviewRecord, type Status, type Track } from "@/data/reviews";
import { allProjects } from "@/data/projects";
import { requireAdmin } from "@/services/admin-session";
import { inviteLink } from "@/services/invite";
import { listAll } from "@/services/reviews";

/* Avaliações das duas trilhas — web e thumbnails. Tudo aqui é componente de servidor com
   `<form action={...}>`: moderar funciona antes do JS carregar, e não há estado no cliente pra
   sincronizar com o banco. */
export const metadata: Metadata = { title: "Avaliações" };

const PAGE = "/admin/avaliacoes";

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
        <section className={`${CARD} mb-8 border-l-2 border-accent`}>
          <h2 className={`${CARD_TITLE} mb-5`}>Nova avaliação (WhatsApp, e-mail…)</h2>
          <ReviewEditor />
        </section>
      )}

      <InviteForm page={PAGE} nome={nome} empresa={empresa} trilha={trilha} projeto={projeto} link={link} />

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
        <p role="alert" className="text-ui text-danger">
          {erro}
        </p>
      )}

      {!erro && shown.length === 0 && (
        <p className="text-ui text-ink/60">
          {reviews.length === 0 ? "Nenhuma avaliação ainda. Gere um convite aí em cima e mande pro cliente." : "Nada neste filtro."}
        </p>
      )}

      {/* A consulta já devolve as pendentes em cima; a ordem da lista é a ordem da fila. */}
      <div className="grid gap-4 lg:grid-cols-2">
        {shown.map((review) => (
          <ReviewCard
            page={PAGE}
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
