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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
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
    /* Tema fixo: `dark` e `data-theme` direto no html, já que não há mais troca.
       Antes vinham de um provider client-side que só aplicava depois de montar. */
    <html lang="pt-BR" className="dark" data-theme="dark">
      <head>
        <link rel="preload" href="/assets/fonts/TulpenOne-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
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
