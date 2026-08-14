import type { Metadata } from "next";
import { QrGenerator } from "@/components/qr/qr-generator";

export const metadata: Metadata = {
  title: "QR Generator",
  robots: { index: false, follow: false },
};

/* Ferramenta interna, fora do índice: segue escura porque o gerador é todo escuro.
   Wrapper local desde que o PageContainer do tema antigo saiu. */
export default function QrPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl flex-col items-center justify-center gap-10">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight">QR Generator</h1>
          <p className="text-sm text-gray-500">Cole uma URL e gere seu QR code</p>
        </div>
        <QrGenerator />
      </div>
    </main>
  );
}
