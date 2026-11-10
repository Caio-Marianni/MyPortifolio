import type { Metadata, Viewport } from "next";
import { PrivacyPage } from "@/components/site/privacy-page";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Quais dados o site coleta, para quê, e como pedir acesso ou exclusão.",
  alternates: { canonical: "https://www.caiomarianni.com.br/privacidade" },
};

export const viewport: Viewport = { themeColor: "#111111" };

export default function Privacidade() {
  return <PrivacyPage />;
}
