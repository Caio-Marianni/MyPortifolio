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
    /* O fundo laranja escuro (com grão) atrás e a folha à frente — o laranja também é o que
       aparece nos cantos arredondados dela. a folha tem os cantos da esquerda arredondados e joga
       sombra sobre a tarja. Sem largura máxima na folha. No celular a folha sobe 24px sobre a faixa do menu, com os cantos de cima
       arredondados, e fica acima dela (z-[15]).
       No desktop a pilha é ao contrário de propósito: o menu fica acima (z-10), mas com fundo
       transparente — o laranja é o deste wrapper —, então a sombra da folha passa por baixo dela e
       aparece, e a aba da tela atual (AdminNav), branca, cobre a emenda e se funde com a folha.
       `data-page` pinta de preto o bounce do celular (globals.css). */
    <div className="painel relative isolate flex min-h-screen flex-col bg-rail font-inter text-ink lg:flex-row">
      {/* o grão do site sobre o laranja; `fixed` pra cobrir a tela inteira enquanto ela rola */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-[url('/assets/images/noise.webp')] opacity-[0.16] mix-blend-screen" />
      <AdminNav />
      <main
        data-page="painel"
        className="relative z-[5] min-w-0 flex-1 bg-sheet px-5 py-6 max-lg:z-[15] max-lg:-mt-6 max-lg:rounded-t-[28px] max-lg:shadow-[0_-4px_12px_-4px_rgb(0_0_0/0.3)] lg:rounded-l-[28px] lg:px-12 lg:py-7 lg:shadow-[-4px_0_14px_-4px_rgb(0_0_0/0.3)]"
      >
        {/* o conteúdo para em 1240px e fica no meio: em monitor largo, linha de lista com 2000px
            de ponta a ponta separava o nome do valor demais pra ler */}
        <div className="mx-auto w-full max-w-[1240px]">{children}</div>
      </main>
    </div>
  );
}
