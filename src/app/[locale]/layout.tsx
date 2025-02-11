import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ReactNode } from "react";
import ThemeProvider from "@/components/utils/ThemeProvider";
import type { Locale } from "@/types";
import I18nProvider from "@/components/utils/I18nProvider";
import "./globals.css";

export const metadata = {
  title: "Meu Portfólio",
  description: "Bem-vindo ao meu portfólio pessoal.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messagesModule = await import(`../../../messages/${locale}.json`);
  const messages = messagesModule.default;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {/* Passa locale e messages para o provider client */}
          <I18nProvider locale={locale} messages={messages}>
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
