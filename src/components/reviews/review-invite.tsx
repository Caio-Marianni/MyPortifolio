"use client";

import { RATING_FONT } from "@/components/ui/brand-marks";
import { SHEET_HEADER, SHEET_TITLE } from "@/components/ui/styles";
import { MarkBackdrop, Tarja, TarjaSheet } from "@/components/site/tarja";
import { ReviewForm, type ReviewFormProps } from "@/components/reviews/review-form";
import { useLanguage } from "@/contexts/language-context";

/* O convite de avaliação no site: a tarja com a estrela das avaliações e o título, a folha com o
   formulário. Sem contato nem caminho de volta pelo logo — é uma tarefa só (ver `noContact`).
   A verificação da assinatura acontece no servidor, na page; aqui só decide qual das duas telas
   mostrar. Componente de cliente porque tudo nele é texto traduzido. */
export function ReviewInvite({ invite }: { invite: ReviewFormProps | null }) {
  const { language } = useLanguage();
  const pt = language === "pt";

  return (
    <main data-page="avaliar" className="theme-light flex min-h-screen flex-col bg-chrome font-inter text-ink lg:flex-row">
      <Tarja noContact backdrop={<MarkBackdrop />}>
        <div className="mt-40 flex flex-col gap-3 lg:mt-auto">
          <h1 className={`${RATING_FONT} text-[clamp(44px,14vw,72px)] font-bold uppercase leading-[0.9]`}>{pt ? "Avaliar" : "Review"}</h1>
          <p className="font-mono text-meta tracking-[0.06em] text-chrome-ink/60">{pt ? "Convite pessoal · leva 1 minuto" : "Personal invite · takes 1 minute"}</p>
        </div>
      </Tarja>

      <TarjaSheet noContact>
        <section aria-labelledby="avaliar" className="flex flex-col">
          <div className={SHEET_HEADER}>
            <h2 id="avaliar" className={SHEET_TITLE}>
              {invite ? (pt ? "Sua avaliação" : "Your review") : pt ? "Link inválido" : "Invalid link"}
            </h2>
          </div>
          <div className="pt-6">
            {invite ? (
              <ReviewForm {...invite} />
            ) : (
              <p className="max-w-[46ch] text-body leading-relaxed text-ink/70">
                {pt
                  ? "Este link de avaliação não confere — pode ter sido copiado pela metade. Me chame e eu mando outro."
                  : "This review link doesn't check out — it may have been copied halfway. Ping me and I'll send another."}
              </p>
            )}
          </div>
        </section>
      </TarjaSheet>
    </main>
  );
}
