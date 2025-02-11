"use client";

import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";

export default function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: string;
  messages: Record<string, any>; // ou defina um tipo mais específico para suas mensagens
  children: ReactNode;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
