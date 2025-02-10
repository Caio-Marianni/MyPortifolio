"use client";

import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { notFound } from "next/navigation";

export default function I18nProvider({ locale, children }: { locale: string; children: ReactNode }) {
  let messages;
  try {
    messages = require(`@/message/${locale}.json`);
    // messages = require(`@/messges/${locale}.json`);
  } catch (error) {
    notFound(); // Caso não encontre o idioma, redireciona para 404
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
