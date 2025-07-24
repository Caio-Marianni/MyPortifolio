import "./globals.css";
import { ReactNode } from "react";
import ThemeProvider from "@/components/utils/ThemeProvider";
import { LanguageProvider } from "@/components/utils/LanguageProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LikeProvider } from "@/components/utils/LikeContext";
import DisplayScore from "@/components/ui/display-score";
import ScoreModal from "@/components/score-modal";

export const metadata = {
  title: "Caio Marianni",
  description: "Bem-vindo ao meu portfólio pessoal. Explore meus projetos, certificações e experiência profissional.",
  keywords: "portfólio, desenvolvimento, full stack, react, web, design, projetos, thumbs, capa de video, thumbnails, certificações, Caio Marianni de Morais",
  authors: [
    {
      name: "Caio Marianni de Morais",
      url: "https://caio-marianni-portfolio.vercel.app",
    },
  ],
  openGraph: {
    title: "Caio Marianni",
    description: "Bem-vindo ao meu portfólio pessoal. Explore meus projetos, certificações e experiência profissional.",
    url: "https://caio-marianni-portfolio.vercel.app",
    siteName: "Caio Marianni",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "https://caio-marianni-portfolio.vercel.app/assets/LogoOrange.webp",
        width: 1200,
        height: 630,
        alt: "Meu Portfólio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caio Marianni",
    description: "Bem-vindo ao meu portfólio pessoal. Explore meus projetos, certificações e experiência profissional.",
    creator: "@seu_twitter",
    images: ["https://caio-marianni-portfolio.vercel.app/assets/LogoOrange.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <SpeedInsights />
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <LikeProvider>
              {children}
              <ScoreModal />
              <DisplayScore />
            </LikeProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
