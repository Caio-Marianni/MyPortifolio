import type { Viewport } from "next";
import { HomePage } from "@/components/site/home-page";
import { bestByProject } from "@/data/reviews";
import { getReviews } from "@/services/reviews";

/* Título, descrição e dados estruturados vêm do layout: a home é a página padrão do site. */

/* No celular o topo da página é a tarja preta: a barra do navegador emenda com ela, nos dois temas
   (o site fica sempre no claro, e a tarja do claro é --chrome #111111). */
export const viewport: Viewport = { themeColor: "#111111" };

/* mesmo ritmo da página de avaliações: depoimento novo aparece em até 5 min */
export const revalidate = 300;

export default async function Home() {
  /* o "já vi a intro" é lido antes da primeira pintura pelo themeScript do layout */
  return <HomePage reviews={bestByProject(await getReviews())} />;
}
