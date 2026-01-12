import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
