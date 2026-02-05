import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato comigo para discutir projetos, oportunidades ou apenas para trocar uma ideia sobre desenvolvimento web.",
  openGraph: {
    title: "Contato | Caio Marianni",
    description:
      "Entre em contato comigo para discutir projetos, oportunidades ou apenas para trocar uma ideia sobre desenvolvimento web.",
    url: "https://www.caiomarianni.com.br/contact",
  },
  alternates: {
    canonical: "https://www.caiomarianni.com.br/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
