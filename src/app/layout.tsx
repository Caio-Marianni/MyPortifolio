import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UVModeProvider } from "@/contexts/uv-mode-context";
import { ModalProvider } from "@/contexts/modal-context";
import { AudioProvider } from "@/contexts/audio-context";
import { LanguageProvider } from "@/contexts/language-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Caio Marianni | Portfolio",
  description: "Portfolio interativo - Desenvolvedor & Designer",
  openGraph: {
    title: "Caio Marianni | Portfolio",
    description: "Portfolio interativo - Desenvolvedor & Designer",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <LanguageProvider>
          <AudioProvider>
            <UVModeProvider>
              <ModalProvider>{children}</ModalProvider>
            </UVModeProvider>
          </AudioProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
