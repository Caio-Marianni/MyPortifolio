import type { Metadata } from "next";
import { QrGenerator } from "@/components/qr/qr-generator";
import { PageContainer } from "@/components/ui/page-container";

export const metadata: Metadata = {
  title: "QR Generator",
  robots: { index: false, follow: false },
};

export default function QrPage() {
  return (
    <PageContainer showToggles={false}>
      <div className="flex flex-col items-center gap-10 min-h-[80vh] justify-center">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">QR Generator</h1>
          <p className="text-gray-500 text-sm">Cole uma URL e gere seu QR code</p>
        </div>
        <QrGenerator />
      </div>
    </PageContainer>
  );
}
