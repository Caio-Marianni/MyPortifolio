import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { QrGenerator } from "@/components/qr/qr-generator";
import { requireAdmin } from "@/services/admin-session";

export const metadata: Metadata = { title: "QR code" };

/* Ferramenta interna, agora atrás do login do painel. O gerador é todo escuro, então mora numa
   placa no preto do site em vez de ser repintado. */
export default async function QrPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="QR code" description="Cole uma URL e gere o QR code com o ícone do site no meio." />
      <div className="flex justify-center bg-chrome px-6 py-12 text-chrome-ink">
        <QrGenerator />
      </div>
    </>
  );
}
