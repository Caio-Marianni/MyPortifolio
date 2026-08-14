import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/language-context";

const baseUrl = "https://www.caiomarianni.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Caio Marianni | Portfolio",
    template: "%s | Caio Marianni",
  },
  description:
    "Desenvolvedor fullstack especializado em criar interfaces modernas, experiências web interativas e design visual. Confira meus projetos e entre em contato.",
  keywords: [
    "desenvolvedor fullstack",
    "portfolio",
    "web developer",
    "React",
    "Next.js",
    "TypeScript",
    "UI/UX",
    "design",
    "Caio Marianni",
  ],
  authors: [{ name: "Caio Marianni", url: baseUrl }],
  creator: "Caio Marianni",
  publisher: "Caio Marianni",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    alternateLocale: "en_US",
    url: baseUrl,
    siteName: "Caio Marianni Portfolio",
    title: "Caio Marianni | Portfolio",
    description:
      "Desenvolvedor fullstack especializado em criar interfaces modernas, experiências web interativas e design visual.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Caio Marianni | Portfolio",
    description:
      "Desenvolvedor fullstack especializado em criar interfaces modernas, experiências web interativas e design visual.",
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      "pt-BR": baseUrl,
      "en-US": `${baseUrl}/en`,
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  /* creme da página: a barra do navegador no celular emenda com o fundo */
  themeColor: "#F1ECE5",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "Caio Marianni",
    jobTitle: "Desenvolvedor Front-end",
    url: baseUrl,
    sameAs: [
      "https://github.com/Caio-Marianni",
      "https://linkedin.com/in/caio-mariann",
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Web Development",
      "UI/UX Design",
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Makaio é o título da primeira dobra — sem preload ele chega depois do primeiro paint. */}
        <link
          rel="preload"
          href="/assets/fonts/modern-condensed-font-makaio-2026-07-29-19-34-48-utc/Makaio/Makaio.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="//www.caiomarianni.com.br" />
        <link rel="preconnect" href="https://www.caiomarianni.com.br" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
