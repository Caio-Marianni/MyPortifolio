"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";
import { BrandedMark, Stars } from "@/components/ui/brand-marks";
import { useLanguage } from "@/contexts/language-context";
import { useHappyClients, useRating } from "@/contexts/reviews-context";
import { useCountUp } from "@/hooks/use-count-up";
import { useIntro } from "@/hooks/use-intro";
import { usePointerShift } from "@/hooks/use-pointer-shift";
import { ProjectShowcase } from "@/components/site/project-showcase";
import type { Review } from "@/data/reviews";
import { ThumbStrip } from "@/components/site/thumb-strip";
import { useWhatsapp } from "@/hooks/use-whatsapp";
import { CONTACT_3D, ON_CHROME_FOCUS, ON_CHROME_LINK } from "@/components/ui/styles";
import { SheetFooter, Tarja, TarjaSheet, WhatsAppIcon } from "@/components/site/tarja";

/* A home, na "tarja lateral": a faixa preta da marca vira a coluna da pessoa (foto, nome, nota,
   contato) e a área creme fica inteira para o trabalho. Abaixo de lg a tarja vira o topo da página. */

/* Retrato recortado (public/caio-portrait.webp: cores da image.jpg com a máscara da image.png, em 5:4 pelo topo) com o
   monograma marcado a ferro atrás. Hierarquia: rosto, depois nome, e a marca como textura.
   - a marca fica centrada atrás da cabeça, menor, com as pontas aparecendo dos dois lados;
   - a foto encosta no topo; a sombra do cabeçalho segura o logo e o PT/EN sobre o cabelo;
   - o peito desce até o nome, que fica por cima da camiseta: rosto e nome numa peça só;
   - uma luz só, de contorno, vinda da esquerda — nada de halo em volta.
   Opaco e escurecido por `brightness`, não por opacidade: assim cobre o logo de verdade. */
function Portrait() {
  /* Só a marca acompanha o cursor (até 10px e 3°, devagar), a foto fica parada: duas camadas em
     velocidades diferentes dão a profundidade. Mesma receita da estrela das avaliações.
     `will-change-transform` dá camada própria à marca: os filtros de queimado (turbulência,
     deslocamento, blur) são desenhados uma vez e o movimento só desliza a camada, em vez de
     recalcular os filtros a cada movimento do mouse. */
  const mark = usePointerShift<HTMLSpanElement>();
  return (
    <div className="absolute inset-x-0 top-0 -z-10 h-[60%] lg:h-[54%]" aria-hidden>
      <span
        ref={mark}
        className="absolute left-[48%] top-[6%] h-[92%] sm:left-[calc(100%-350px)] lg:left-[48%] will-change-transform transition-transform duration-700 ease-out [transform:translate(calc(-50%+var(--px,0)*10px),calc(var(--py,0)*8px))_rotate(calc(var(--px,0)*3deg))]"
      >
        <BrandedMark className="h-full w-auto" />
      </span>
      {/* Caixa na proporção da foto (5:4): o tamanho sai da largura, então o corpo aparece até o
        degradê. A máscara só apaga o fim da camiseta, curta, para o corpo aparecer inteiro.
        Do sm ao lg a tarja é o topo da página em largura cheia e 125% dela virava um rosto de
        1000px+: lá a foto trava em 600px e encosta na direita, deixando o nome à esquerda. A cabeça
        fica a ~350px da borda direita, e a marca centra ali. O degradê da camiseta sobe mais: com a
        tarja larga o corte reto da foto aparecia inteiro. */}
      <div className="absolute left-[5%] top-10 aspect-[5/4] w-[125%] sm:left-auto sm:right-0 sm:w-[600px] lg:left-[5%] lg:right-auto lg:w-[125%] [mask-image:linear-gradient(to_bottom,black_90%,transparent)] sm:[mask-image:linear-gradient(to_bottom,black_65%,transparent)] lg:[mask-image:linear-gradient(to_bottom,black_90%,transparent)]">
        <Image
          src="/caio-portrait.webp"
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 1024px) 550px, 125vw"
          className="object-cover brightness-[0.85] drop-shadow-[-3px_-1px_5px_rgba(237,231,222,0.07)]"
        />
      </div>
    </div>
  );
}

/* quando o nome e a nota começam a subir na intro: o `[animation-delay:950ms]` logo abaixo */
const INTRO_CONTENT_MS = 950;

export function HomePage({ reviews }: { reviews: Record<number, Review> }) {
  const { language } = useLanguage();
  const pt = language === "pt";
  const rating = useRating();
  const happy = useHappyClients();
  const whatsapp = useWhatsapp();
  useIntro();
  /* Conta de 0.0 até a nota quando ela aparece: depois da intro, ou na hora se a intro já foi
     vista. Só o efeito lê esse atraso, então o servidor sem `document` não muda o HTML.
     ponytail: pular a intro no meio não adianta a contagem; ela só fica até 950ms atrasada. */
  /* congelado no primeiro render: senão trocar o idioma depois da intro mudava o atraso e recontava */
  const [countDelay] = useState(() => (typeof document !== "undefined" && document.documentElement.dataset.intro !== "off" ? INTRO_CONTENT_MS : 0));
  const score = useCountUp<HTMLElement>(rating ? Number(rating.value) : 0, 1, 800, countDelay);

  return (
    <main data-page="home" className="theme-light flex min-h-screen flex-col bg-chrome font-inter text-ink lg:flex-row">
      <Tarja backdrop={<Portrait />}>
        <div className="mt-56 animate-rise [animation-delay:950ms] motion-reduce:animate-none lg:mt-auto [[data-intro=off]_&]:animate-none">
          <h1 className="font-makaio text-[clamp(48px,20vw,112px)] font-black uppercase leading-[0.95] tracking-display">
            Caio
            <br />
            Marianni
            {/* a função dentro do título, para leitor de tela e busca: o nome sozinho não diz o que faço */}
            <span className="sr-only">{pt ? " — desenvolvedor fullstack e designer" : " — fullstack developer and designer"}</span>
          </h1>
          {rating && (
            /* as estrelas enchem junto com a contagem, empurradas pelo mesmo atraso da intro */
            <p className="mt-4 text-ui [--reveal-offset:950ms] [[data-intro=off]_&]:[--reveal-offset:0ms]">
              <Link href="/reviews" className={`-my-1 inline-flex items-center gap-1.5 py-1 text-chrome-ink ${ON_CHROME_LINK}`}>
                {/* Caixa de largura fixa: contando de 0.0 a 5.0 o número não empurra estrelas e clientes.
                    `tabular-nums` não resolve, a Inter carregada ignora o recurso; o valor mais largo
                    ("0.4") mede 1,66em, daí o piso de 1,7em. */}
                <strong ref={score} className="inline-block min-w-[1.7em]">
                  {rating.value}
                </strong>
                <Stars count={rating.stars} shine reveal className="text-accent" />
                {happy > 0 && (
                  <span className="ml-1.5 inline-flex items-center gap-1.5 text-chrome-ink/70">
                    <Users className="h-[1.15em] w-[1.15em]" strokeWidth={2} aria-hidden />
                    {happy} {pt ? (happy === 1 ? "cliente feliz" : "clientes felizes") : happy === 1 ? "happy client" : "happy clients"}
                  </span>
                )}
              </Link>
            </p>
          )}
        </div>
      </Tarja>

      {/* Fechamento revelado pela folha. No celular o botão fica de fora: o rodapé é mais baixo que a
          tela, então quando ele aparece a barra presa no pé da folha está logo acima — seriam dois
          laranjas iguais. */}
      <TarjaSheet
        footer={
          <SheetFooter
            id="cta"
            title={pt ? "Tem um projeto em mente?" : "Got a project in mind?"}
            text={pt ? "Me conta a ideia pelo WhatsApp e eu volto com os próximos passos." : "Tell me the idea on WhatsApp and I'll come back with next steps."}
          >
            <a href={whatsapp.href} target="_blank" rel="noopener noreferrer" className={`${CONTACT_3D} ${ON_CHROME_FOCUS} mt-2 max-lg:hidden`}>
              {whatsapp.label}
              <WhatsAppIcon className="h-[1.1em] w-[1.1em]" aria-hidden />
            </a>
          </SheetFooter>
        }
      >
        <div className="animate-rise [animation-delay:1020ms] motion-reduce:animate-none [[data-intro=off]_&]:animate-none">
          <ProjectShowcase reviews={reviews} language={language} />
          <ThumbStrip language={language} />
        </div>
      </TarjaSheet>

      {/* Intro "faixa partida", só CSS: a linha laranja risca a borda da tarja,
          a capa preta se abre para a direita e revela a folha; nome e projetos sobem em seguida.
          No celular a capa cobre a tela toda e desce. Fixa e sem clique: depois de aberta fica
          fora da tela. Com movimento reduzido no sistema ela nem aparece.
          Uma vez por sessão e pulável com clique/tecla/rolagem: `data-intro="off"` no <html>
          esconde a capa e tira o atraso do conteúdo — ver hooks/use-intro.ts. */}
      <div
        className="pointer-events-none fixed inset-0 z-20 animate-faixa-open-y bg-chrome motion-reduce:hidden lg:left-[440px] lg:animate-faixa-open-x [[data-intro=off]_&]:hidden"
        aria-hidden
      >
        <div className="absolute inset-y-0 left-0 hidden w-[3px] origin-top animate-faixa-line bg-accent lg:block" />
      </div>
    </main>
  );
}
