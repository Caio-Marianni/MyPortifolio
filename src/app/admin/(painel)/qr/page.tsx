import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { QrGenerator } from "@/components/qr/qr-generator";
import { requireAdmin } from "@/services/admin-session";

export const metadata: Metadata = { title: "QR code" };

/* Ferramenta interna, atrás do login do painel, nas mesmas peças das outras telas. */
export default async function QrPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="QR code" description="Cole uma URL e gere o QR code com o ícone do site no meio." />
      <QrGenerator />
    </>
  );
}
