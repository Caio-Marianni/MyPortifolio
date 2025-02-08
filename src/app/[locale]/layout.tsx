import { ReactNode } from "react";
import I18nProvider from "@/components/I18nProvider";
import ThemeProvider from "@/components/ThemeProvider";

export default function LocaleLayout({ children, params }: { children: ReactNode; params: { locale: string } }) {
  return (
    <html lang={params.locale}>
      <body>
        <ThemeProvider>
          <I18nProvider locale={params.locale}>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
