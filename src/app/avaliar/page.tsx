import type { Metadata } from "next";
import { ReviewInvite } from "@/components/reviews/review-invite";
import type { ReviewFormProps } from "@/components/reviews/review-form";
import { TRACKS, type Track } from "@/data/reviews";
import { verifyInvite } from "@/services/invite";

/* Página de link, não de site: fora do sitemap e fora do índice. O portão é a assinatura,
   não o segredo da URL — noindex só evita que o convite de um cliente apareça na busca. */
export const metadata: Metadata = {
  title: "Avaliar",
  robots: { index: false, follow: false },
};

type Params = { searchParams: Record<string, string | string[] | undefined> };

const param = (searchParams: Params["searchParams"], key: string): string => {
  const value = searchParams[key];
  return typeof value === "string" ? value : "";
};

export default function AvaliarPage({ searchParams }: Params) {
  /* `c` é o identificador do convite e `k` a assinatura dele. O resto do link é sugestão que
     o contratante pode corrigir — por isso não entra na conta da assinatura. */
  const invite = param(searchParams, "c");
  const track = param(searchParams, "t");

  const prefill: ReviewFormProps | null = verifyInvite(invite, param(searchParams, "k"))
    ? {
        invite,
        token: param(searchParams, "k"),
        name: param(searchParams, "n"),
        company: param(searchParams, "e"),
        track: TRACKS.includes(track as Track) ? (track as Track) : "web",
      }
    : null;

  return <ReviewInvite invite={prefill} />;
}
