import "./globals.css";
import { ReactNode } from "react";
import ThemeProvider from "@/components/utils/theme-provider";
import { LanguageProvider } from "@/components/utils/language-provider";

export const metadata = {
  title: "Meu Portfólio",
  description: "Bem-vindo ao meu portfólio pessoal.",
};

export default async function LocaleLayout({ children}: { children: ReactNode}) {

  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
