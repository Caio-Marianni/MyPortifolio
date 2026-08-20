"use client";

import { CapaPage } from "@/components/capa/capa-page";
import { ReviewForm, type ReviewFormProps } from "@/components/reviews/review-form";
import { useLanguage } from "@/contexts/language-context";

/* A verificação da assinatura acontece no servidor, na page — aqui só decide qual das duas
   telas mostrar. Componente de cliente porque tudo nele é texto traduzido. */
export function ReviewInvite({ invite }: { invite: ReviewFormProps | null }) {
  const { language } = useLanguage();
  const pt = language === "pt";

  return (
    <CapaPage
      wordmark={pt ? "Avaliar" : "Review"}
      descriptor={pt ? "Convite pessoal" : "Personal invite"}
      stats={[pt ? "leva 1 minuto" : "takes 1 minute"]}
    >
      {invite ? (
        <ReviewForm {...invite} />
      ) : (
        <div className="max-w-[46ch]">
          <h2 className="font-makaio text-[clamp(28px,4.5vw,44px)] font-black uppercase leading-none tracking-[0.04em]">
            {pt ? "Link inválido" : "Invalid link"}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/70">
            {pt
              ? "Este link de avaliação não confere — pode ter sido copiado pela metade. Me chame e eu mando outro."
              : "This review link doesn't check out — it may have been copied halfway. Ping me and I'll send another."}
          </p>
        </div>
      )}
    </CapaPage>
  );
}
