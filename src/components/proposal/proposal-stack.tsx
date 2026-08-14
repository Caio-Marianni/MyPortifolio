import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Stars, type ProposalContent } from "./proposal-slide";

/* Mobile: mesma matéria-prima do slide 16:9, composição outra.
   Nada de cqw aqui — sem container 16:9 as unidades de container colapsariam pra ~3px. */
export function ProposalStack({ image, wordmark, descriptor, script, registered, scriptFont = "font-comforter-brush", wordmarkFont = "", descriptorFont = "", tab, corner, rail, imagePosition, columns, children, overlay, priority }: ProposalContent) {
  /* O rail vertical vira faixa de três zonas, espelhando o desktop: credenciais à esquerda,
     avaliação ao centro, contexto à direita. `outerTop` (o relógio) fica de fora — com ele
     a faixa passa de 430px de conteúdo e quebra em duas linhas num aparelho de 390px. */
  const railLeft = rail?.outerBottom ?? [];
  const railRight = [...(rail?.innerTop ?? []), ...(rail?.innerBottom ?? [])];

  return (
    /* Coluna de altura de tela: tudo abaixo tem altura intrínseca e a foto absorve a sobra,
       então o bloco da marca cabe sem rolar em qualquer aparelho. */
    <section className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#F1ECE5] font-inter text-[#101010] [text-shadow:none]">
      {/* Navbar preta emendando na foto e na faixa: o topo vira um bloco escuro contínuo,
          sem a fresta de creme que aparecia entre a barra e o retrato. */}
      <div className="flex shrink-0 items-center justify-between bg-[#111111] px-5 py-3 text-[#F1ECE5]">
        {tab && <span className="flex h-7 w-7 items-center justify-center">{tab}</span>}
        {corner && <span className="text-[11px]">{corner}</span>}
      </div>

      {/* basis-0 + flex-1 nos dois blocos: foto e infos dividem o que sobra em 50/50.
          min-h segura a foto em telas muito baixas; o bloco de infos nunca encolhe abaixo do conteúdo. */}
      <div className="relative min-h-[200px] w-full flex-1 basis-0 overflow-hidden bg-[#1A1A1A]">
        {/* mesmo `sizes` do slide: as duas composições coexistem no DOM, e assim pedem a mesma
            variante ao otimizador — um download só, em vez de dois. */}
        <Image src={image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" priority={priority} className="object-cover" style={{ objectPosition: imagePosition }} />
        <div className="pointer-events-none absolute inset-0 bg-[url('/assets/images/noise.webp')] bg-repeat opacity-[0.22] mix-blend-overlay" aria-hidden />
      </div>

      {(railLeft.length > 0 || railRight.length > 0 || rail?.rating) && (
        /* flex-1 nos dois lados: o centro fica centrado de verdade, não importa o texto das pontas.
           Com justify-between a zona mais larga empurrava as estrelas pro lado. */
        <div className="flex shrink-0 items-center gap-3 overflow-hidden bg-[#111111] px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-white/70">
          <span className="flex flex-1 items-center gap-3">
            {railLeft.map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </span>

          {rail?.rating && (
            /* nota grande e cortada pela altura da faixa — é fundo, não informação a ler */
            <span className="relative flex shrink-0 items-center justify-center">
              <span className="absolute font-inter text-[42px] font-bold leading-none tracking-[-0.04em] text-white/[0.14]" aria-hidden>
                {rail.rating.value}
              </span>
              <Stars count={rail.rating.stars} className="relative text-white/75" />
            </span>
          )}

          <span className="flex flex-1 items-center justify-end gap-3">
            {railRight.map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </span>
        </div>
      )}

      {/* ponytail: mesmo andaime de outline do slide — apagar junto quando o layout fechar */}
      <div className="flex flex-1 basis-0 flex-col items-center justify-center px-5 py-8 [&_*]:outline [&_*]:outline-1 [&_*]:outline-[#101010]/30">
        <div className="relative w-fit">
          {script && (
            <span className={`absolute -top-[0.42em] left-[6%] ${scriptFont} leading-none text-[#B4ADA3]`} style={{ fontSize: `min(${(40 / wordmark.length).toFixed(2)}vw, 42px)` }}>
              {script}
            </span>
          )}

          <h1 className={`relative ${wordmarkFont} font-black uppercase tracking-widest`} style={{ fontSize: `min(${(85 / wordmark.length).toFixed(2)}vw, 90px)` }}>
            {wordmark}
            {registered && <span className="absolute -right-[0.62em] top-[0.05em] align-super text-[0.16em] font-normal tracking-normal">®</span>}
          </h1>

          <p className={`mt-[0.9em] text-center text-[13px] ${descriptorFont} font-medium uppercase tracking-[0.5em] [text-indent:0.5em]`}>{descriptor}</p>
        </div>

        {children && <div className="mt-7 flex justify-center text-[11px]">{children}</div>}

        {columns && (
          /* Caixas de medida fixa: grid de colunas iguais dentro de largura travada, mais min-h.
             Com `w-fit` a caixa acompanhava o texto e saltava ao trocar idioma ou frente.
             O link vai com `mt-auto`, então os dois CTAs alinham mesmo com stats de alturas diferentes. */
          <div className="mx-auto mt-8 grid w-full max-w-[360px] grid-cols-2 gap-3 text-[11px] font-bold uppercase tracking-[0.06em]">
            {columns.map((column) => (
              <div key={column.link.href} className="flex min-h-[7rem] flex-col items-start gap-[0.5em]">
                {column.stats.map((stat, i) => (
                  <span key={i} className="flex min-h-[1.3em] items-center leading-[1.35] text-[#101010]/55">
                    {stat}
                  </span>
                ))}
                <Link
                  href={column.link.href}
                  className="mt-auto flex w-full items-center justify-center gap-[0.5em] rounded-full bg-[#101010] px-3 py-[0.85em] text-[#F1ECE5] transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101010]"
                >
                  {column.link.label}
                  <ArrowUpRight className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {overlay}
    </section>
  );
}
