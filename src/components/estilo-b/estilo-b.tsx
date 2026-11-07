"use client";

import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";
import { Stars } from "@/components/ui/brand-marks";
import { useLanguage } from "@/contexts/language-context";
import { useHappyClients, useRating } from "@/contexts/reviews-context";
import { ProjectShowcase, type ProjectReview } from "@/components/estilo-b/project-showcase";
import { BrandedMark, ON_CHROME_LINK, Tarja, TarjaSheet } from "@/components/estilo-b/tarja";

/* Estilo B, a "tarja lateral": a faixa preta da marca vira a coluna da pessoa (foto, nome, nota,
   contato) e a área creme fica inteira para o trabalho. Abaixo de lg a tarja vira o topo da página. */

/* Retrato recortado (public/portrait-cutout.webp, fundo removido da image.webp) com o
   monograma marcado a ferro atrás. Hierarquia: rosto, depois nome, e a marca como textura.
   - a marca fica centrada atrás da cabeça, menor, com as pontas aparecendo dos dois lados;
   - a foto encosta no topo; a sombra do cabeçalho segura o logo e o PT/EN sobre o cabelo;
   - o peito desce até o nome, que fica por cima da camiseta: rosto e nome numa peça só;
   - uma luz só, de contorno, vinda da esquerda — nada de halo em volta.
   Opaco e escurecido por `brightness`, não por opacidade: assim cobre o logo de verdade. */
const PORTRAIT = (
  <div className="absolute inset-x-0 top-0 -z-10 h-[60%] lg:h-[54%]" aria-hidden>
    <BrandedMark className="absolute left-[48%] top-[6%] h-[92%] w-auto -translate-x-1/2" />
    {/* Caixa na proporção da foto (5:4): o tamanho sai da largura, então o corpo aparece até o
        degradê. A máscara só apaga o fim da camiseta, curta, para o corpo aparecer inteiro. */}
    <div className="absolute left-[5%] top-10 aspect-[5/4] w-[125%] [mask-image:linear-gradient(to_bottom,black_90%,transparent)]">
      <Image
        src="/portrait-cutout.webp"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 550px, 125vw"
        className="object-cover brightness-[0.85] drop-shadow-[-3px_-1px_5px_rgba(237,231,222,0.07)]"
      />
    </div>
  </div>
);

export function EstiloB({ reviews }: { reviews: Record<number, ProjectReview> }) {
  const { language } = useLanguage();
  const pt = language === "pt";
  const rating = useRating();
  const happy = useHappyClients();

  return (
    <main data-page="estilo-b" className="theme-light flex min-h-screen flex-col bg-chrome font-inter text-ink lg:flex-row">
      <Tarja backdrop={PORTRAIT}>
        <div className="mt-56 lg:mt-auto">
          <h1 className="font-makaio text-[clamp(48px,20vw,112px)] font-black uppercase leading-[0.95] tracking-display">
            Caio
            <br />
            Marianni
          </h1>
          {rating && (
            <p className="mt-4 text-ui">
              {/* ponytail: aponta para a proposta de avaliações; volta a ser /reviews quando o Estilo B virar a home */}
              <Link href="/estilo-b/avaliacoes" className={`inline-flex items-center gap-1.5 text-chrome-ink ${ON_CHROME_LINK}`}>
                <strong>{rating.value}</strong>
                <Stars count={rating.stars} className="text-accent" />
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

      <TarjaSheet>
        <ProjectShowcase reviews={reviews} language={language} />
      </TarjaSheet>
    </main>
  );
}
