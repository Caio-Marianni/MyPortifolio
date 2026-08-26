import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/language-context";
import { ReviewsProvider } from "@/contexts/reviews-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { getSummary } from "@/services/reviews";

import localFont from "next/font/local";

/* Os .woff2 saem daqui e não de /public por dois motivos que valem nota no PageSpeed:
   o Next os serve de /_next/static com cache imutável de 1 ano (em /public a resposta é
   `must-revalidate`, ou seja, ida ao servidor a cada visita), e o `adjustFontFallback`
   calcula um fallback com as métricas da fonte — é ele que zera o pulo de layout que o
   `font-display: swap` cobrava toda vez que a fonte real chegava.
   Os arquivos são recortes latinos: o Inter cheio pesava 133 KB, o recorte pesa 33 KB. */

export const inter = localFont({
  src: "../fonts/inter.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-inter",
  adjustFontFallback: "Arial",
});

export const makaio = localFont({
  src: "../fonts/makaio.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-makaio",
  adjustFontFallback: "Arial",
});

/* Só a nota gigante e apagada do rail usa Ricko — decoração, nunca o LCP. Sem preload
   para não disputar banda com o retrato e o wordmark na primeira dobra. */
export const ricko = localFont({
  src: "../fonts/ricko.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-ricko",
  preload: false,
  adjustFontFallback: "Arial",
});

/* Verificado no HTML servido: <link rel="preload" as="font"> sai para Inter e Makaio, não
   para Ricko. Em build no Windows o manifesto de fontes do Next 14 sai vazio e os preloads
   somem — bug de separador de caminho lá dentro, não daqui; no build Linux do deploy eles
   voltam. Se o PageSpeed acusar fonte sem preload, olhar o SO do build antes deste arquivo. */
const fontVariables = `${inter.variable} ${makaio.variable} ${ricko.variable}`;

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
  /* Fundo da página em cada tema: a barra do navegador no celular emenda com ele.
     As duas entram no HTML do servidor, então quem segue o SO acerta antes de qualquer JS.
     Quem escolheu o contrário do SO é corrigido pelo ThemeProvider na hidratação. */
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F1ECE5" },
    { media: "(prefers-color-scheme: dark)", color: "#121110" },
  ],
  width: "device-width",
  initialScale: 1,
};

/* Roda antes do primeiro paint, e é isso que diferencia tema de idioma: trocar o idioma no
   primeiro frame só muda texto, trocar o tema é um flash creme na cara de quem pediu escuro.
   Sem valor salvo segue o SO; com valor salvo ele manda. try/catch porque localStorage
   lança em navegação restrita, e aí o site simplesmente fica no claro. */
const themeScript = `(function(){try{var s=localStorage.getItem("theme");document.documentElement.classList.toggle("dark",s==="dark"||(!s&&window.matchMedia("(prefers-color-scheme: dark)").matches))}catch(e){}})()`;

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

/* A média das avaliações entra no cabeçalho de todas as páginas, então é buscada aqui, uma
   vez por revalidação — sem isso cada página viraria um par servidor/cliente só pra ler o
   mesmo número. 5 min de ISR só conta com o banco ligado; no arquivo estático o deploy
   já é a atualização. */
export const revalidate = 300;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const summary = await getSummary();

  return (
    <html lang="pt-BR" translate="no" className={fontVariables}>
      <head>
        {/* Primeiro de tudo no <head>: script sem `async`/`defer` bloqueia o parser, que é
            justamente o que se quer aqui — a classe do tema tem que estar no <html> antes
            de o navegador pintar qualquer pixel. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* O site tem toggle PT/EN próprio — a barra de tradução do navegador só quebra o layout. */}
        <meta name="google" content="notranslate" />
        {/* Os preloads de Inter e Makaio agora saem do `next/font` (src/fonts/index.ts), com o
            hash do arquivo no href — escrever <link rel="preload"> aqui duplicaria o download.
            O preconnect para o próprio domínio também saiu: a conexão que serve este HTML já
            está aberta, e o Lighthouse conta preconnect ocioso como aviso. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <ReviewsProvider summary={summary}>{children}</ReviewsProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
