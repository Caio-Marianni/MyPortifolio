import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/services/admin-session";

/* Casca do painel: menu à esquerda e a tela à direita, sem nada do site em volta — nem troca de
   idioma, nem faixa de contato. Painel é só em português e fora do índice.

   A sessão é conferida aqui e de novo em cada página e action: layout não roda outra vez a cada
   navegação, então sozinho ele não é tranca. */
export const metadata: Metadata = {
  title: { template: "%s · Painel", default: "Painel" },
  robots: { index: false, follow: false },
};

export default async function PainelLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-surface font-inter text-ink lg:flex">
      <AdminNav />
      <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-[1200px]">{children}</div>
      </main>
    </div>
  );
}
