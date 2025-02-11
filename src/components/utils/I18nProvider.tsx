"use client";

import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { notFound } from "next/navigation";

export default async function I18nProvider({
  locale,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
  let messages;
  try {
    // Utiliza import() para carregar o JSON dinamicamente
    const messagesModule = await import(`@/messages/${locale}.json`);
    messages = messagesModule.default;
  } catch (error) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
