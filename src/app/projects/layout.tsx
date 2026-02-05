import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Confira meus projetos de desenvolvimento web. Aplicações modernas construídas com React, Next.js, TypeScript e mais.",
  openGraph: {
    title: "Projetos | Caio Marianni",
    description:
      "Confira meus projetos de desenvolvimento web. Aplicações modernas construídas com React, Next.js, TypeScript e mais.",
    url: "https://www.caiomarianni.com.br/projects",
  },
  alternates: {
    canonical: "https://www.caiomarianni.com.br/projects",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
