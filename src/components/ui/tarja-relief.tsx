import type { ReactNode } from "react";

/** Relevo da tarja, do fundo para a frente: hachura fina na diagonal do monograma (a placa
    gravada), luz rasante vindo do canto de baixo, o fundo de cada página (`backdrop`), sombra no
    topo, vinheta escurecendo as bordas, grão e a quina iluminada de 1px. Tudo atrás do conteúdo
    pelo `-z-10` — quem usa precisa ser `relative isolate overflow-hidden`. Mora em `ui/` porque o
    menu do painel também é tarja. */
export function TarjaRelief({ backdrop }: { backdrop?: ReactNode }) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[repeating-linear-gradient(-52deg,rgb(var(--chrome-ink)/0.018)_0_1px,transparent_1px_7px)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(110%_60%_at_0%_100%,rgb(var(--chrome-ink)/0.13),transparent_70%)]"
        aria-hidden
      />
      {backdrop}
      {/* sombra no topo: o que fica no alto (seletor de idioma sobre o cabelo) precisa de fundo escuro */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-chrome/85 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-0 -z-10 shadow-[inset_0_0_160px_rgb(0_0_0/0.85)]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[url('/assets/images/noise.webp')] opacity-[0.14] mix-blend-screen" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 shadow-[inset_0_-1px_0_rgb(var(--chrome-ink)/0.14)] lg:shadow-[inset_-1px_0_0_rgb(var(--chrome-ink)/0.14),inset_0_1px_0_rgb(var(--chrome-ink)/0.06)]"
        aria-hidden
      />
    </>
  );
}
