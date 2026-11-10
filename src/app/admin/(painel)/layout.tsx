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
    /* A tarja à esquerda e a folha ao lado, como as páginas do site. Sem largura máxima na folha:
       o fio do SHEET_HEADER vai de borda a borda dela. No celular a folha sobe 24px sobre a faixa
       do menu, com os cantos de cima arredondados, e precisa ficar acima dela (z-[15]); no
       desktop fica abaixo (z-[5]), para receber a sombra da tarja. `data-page` pinta de preto o
       bounce do celular (globals.css). */
    <div className="flex min-h-screen flex-col bg-chrome font-inter text-ink lg:flex-row">
      <AdminNav />
      <main
        data-page="painel"
        className="relative z-[5] min-w-0 flex-1 bg-sheet px-5 py-6 max-lg:z-[15] max-lg:-mt-6 max-lg:rounded-t-[28px] lg:px-14 lg:py-10"
      >
        {children}
      </main>
    </div>
  );
}
