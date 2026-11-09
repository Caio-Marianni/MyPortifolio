import type { Viewport } from "next";
import { EstiloBThumbnails } from "@/components/estilo-b/estilo-b-thumbnails";

/* Título e descrição vêm do layout desta rota. No celular o topo é a tarja preta: a barra do
   navegador emenda com ela, como na home e nas avaliações. */
export const viewport: Viewport = { themeColor: "#111111" };

export default function ThumbnailsPage() {
  return <EstiloBThumbnails />;
}
