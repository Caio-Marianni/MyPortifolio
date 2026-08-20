import Image from "next/image";
import { reviewImage, type Review } from "@/data/reviews";

/* Foto do cliente, ou a inicial do nome quando ele não mandou nenhuma. Aparece em quatro
   telas — quadro de avaliações, ficha de projeto, painel — e cada uma pinta o próprio círculo,
   por isso tamanho e cores entram por `className` em vez de virarem variantes aqui dentro.

   `unoptimized` de propósito: a rota já entrega um JPEG de 256px feito no celular do cliente.
   Passar pelo otimizador do Next só somaria uma leitura do banco por medida pedida. */
export function ReviewPhoto({ review, className = "" }: { review: Review; className?: string }) {
  return (
    <span className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`}>
      {review.photo ? (
        <Image src={reviewImage(review.id)} alt="" fill unoptimized className="object-cover" />
      ) : (
        /* a inicial segue o corpo do nome: fonte do texto, não a Makaio. `uppercase` fica —
           é uma letra só, e sem ele um nome digitado em minúsculas viraria um "c" solto. */
        <span className="text-[0.9em] font-semibold uppercase leading-none" aria-hidden>
          {review.name.trim().charAt(0)}
        </span>
      )}
    </span>
  );
}

/* Uma coluna por foto, no máximo três (LIMITS.shots): em três colunas fixas uma foto sozinha
   saía com um terço da largura e dois vãos do lado. Classes inteiras porque o Tailwind lê o
   código-fonte — nome de classe montado em pedaços não é gerado. */
const SHOT_COLS = ["", "grid-cols-1", "grid-cols-2", "grid-cols-3"];

/** As fotos que o cliente anexou. Abrem em aba nova no tamanho cheio — o navegador já sabe
    mostrar imagem, então não há visualizador nenhum pra escrever aqui. */
export function ReviewShots({ review, label }: { review: Review; label: string }) {
  if (!review.shots) return null;

  return (
    <div className={`grid gap-1.5 ${SHOT_COLS[Math.min(review.shots, 3)]}`}>
      {Array.from({ length: review.shots }, (_, i) => (
        <a
          key={i}
          href={reviewImage(review.id, i)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label} ${i + 1}`}
          className="relative aspect-[4/3] overflow-hidden bg-ink/[0.07] transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-current"
        >
          <Image src={reviewImage(review.id, i)} alt="" fill unoptimized sizes="180px" className="object-cover" />
        </a>
      ))}
    </div>
  );
}
