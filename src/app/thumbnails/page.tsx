import type { Viewport } from "next";
import { ThumbnailsPage } from "@/components/site/thumbnails-page";

/* Título e descrição vêm do layout desta rota. No celular o topo é a tarja preta: a barra do
   navegador emenda com ela, como na home e nas avaliações. */
export const viewport: Viewport = { themeColor: "#111111" };

export default function Thumbnails() {
  return <ThumbnailsPage />;
}
