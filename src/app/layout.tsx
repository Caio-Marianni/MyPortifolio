import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-context";
import { LanguageProvider } from "@/contexts/language-context";

export const metadata: Metadata = {
  title: "Caio Marianni | Portfolio",
  description: "I craft UI demos that explore the power of the web.",
  openGraph: {
    title: "Caio Marianni | Portfolio",
    description: "I craft UI demos that explore the power of the web.",
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
      <body>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
