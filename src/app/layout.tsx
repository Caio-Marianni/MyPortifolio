import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-context";
import { LanguageProvider } from "@/contexts/language-context";

const baseUrl = "https://www.caiomarianni.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Caio Marianni | Portfolio",
    template: "%s | Caio Marianni",
  },
  description:
    "Desenvolvedor Front-end especializado em criar interfaces modernas e experiências web interativas. Confira meus projetos e entre em contato.",
  keywords: [
    "desenvolvedor front-end",
    "portfolio",
    "web developer",
    "React",
    "Next.js",
    "TypeScript",
    "UI/UX",
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
      "Desenvolvedor Front-end especializado em criar interfaces modernas e experiências web interativas.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Caio Marianni - Desenvolvedor Front-end",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caio Marianni | Portfolio",
    description:
      "Desenvolvedor Front-end especializado em criar interfaces modernas e experiências web interativas.",
    images: ["/og-image.png"],
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
    <html lang="pt-BR">
      <head>
        <link rel="dns-prefetch" href="//www.caiomarianni.com.br" />
        <link rel="preconnect" href="https://www.caiomarianni.com.br" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
