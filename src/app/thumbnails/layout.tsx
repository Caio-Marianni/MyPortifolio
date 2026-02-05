import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thumbnails",
  description:
    "Galeria de thumbnails e designs criados para diversos projetos. Arte digital e design gráfico para YouTube, redes sociais e mais.",
  openGraph: {
    title: "Thumbnails | Caio Marianni",
    description:
      "Galeria de thumbnails e designs criados para diversos projetos. Arte digital e design gráfico.",
    url: "https://www.caiomarianni.com.br/thumbnails",
  },
  alternates: {
    canonical: "https://www.caiomarianni.com.br/thumbnails",
  },
};

export default function ThumbnailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
