import type { Metadata } from "next";
import { QrGenerator } from "@/components/qr/qr-generator";

export const metadata: Metadata = {
  title: "QR Generator",
  robots: { index: false, follow: false },
};

/* Ferramenta interna, fora do índice: segue escura porque o gerador é todo escuro, mas no
   preto do site e não no preto puro — o cyan/cinza de antes era uma paleta que não existe
   em nenhuma outra página. Wrapper local desde que o PageContainer do tema antigo saiu. */
export default function QrPage() {
  return (
    <main className="min-h-screen bg-[#101010] px-6 py-16 text-[#F1ECE5]">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl flex-col items-center justify-center gap-10">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight">QR Generator</h1>
          <p className="text-sm text-[#F1ECE5]/45">Cole uma URL e gere seu QR code</p>
        </div>
        <QrGenerator />
      </div>
    </main>
  );
}
