import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ReactNode } from "react";
import ThemeProvider from "@/components/utils/ThemeProvider";
import "./globals.css"

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  // Aguarda a resolução dos parâmetros
  const { locale } = await params;

  // Valida o locale
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Carrega as mensagens (pode ser ajustado para carregar as mensagens de acordo com o locale)
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

// Look for the SEO improvemt