"use client";

import { CapaPage } from "@/components/capa/capa-page";
import { CapaContactForm } from "@/components/capa/capa-contact-form";
import { ContactChannels } from "@/components/contact/contact-channels";
import { useLanguage } from "@/contexts/language-context";

export default function ContactPage() {
  const { t, language } = useLanguage();
  const pt = language === "pt";

  return (
    <CapaPage
      bleed
      wordmark={pt ? "Contato" : "Contact"}
      script={pt ? "Vamos" : "Let's"}
      descriptor={t("contact.subtitle")}
      stats={[pt ? "Freelance aberto" : "Open for freelance", pt ? "Remoto" : "Remote"]}
    >
      {/* Divisão dura ao meio: canais no preto, formulário no creme. Nenhum dos dois ganha —
          o contraste é o próprio layout, e o formulário fica no fundo claro, onde é mais
          confortável de preencher. Empilhado, a carta vem antes: quem chega pelo CTA quer
          escrever, os canais são a alternativa. Em duas colunas a ordem se inverte e o preto
          volta para a esquerda.
          Quem centra é a linha inteira, não cada coluna: com `align-content` no meio as duas
          colunas viram uma faixa da altura da mais alta, então elas começam na mesma linha e
          o conjunto é que fica no meio da página. `safe` devolve o alinhamento ao topo se a
          faixa não couber, senão o começo dela sumiria por cima da navbar.
          O preto de altura cheia é do `before`: metade esquerda da medida mais a sangria até
          a borda da viewport, que fora do SHELL a página é creme. */}
      <div className="relative isolate grid items-stretch lg:flex-1 lg:grid-cols-2 lg:[align-content:safe_center] lg:before:absolute lg:before:inset-y-0 lg:before:right-1/2 lg:before:-z-10 lg:before:w-screen lg:before:bg-[#101010]">
        <div className="bg-[#F1ECE5] px-6 py-14 md:px-10">
          <CapaContactForm />
        </div>

        <div className="bg-[#101010] px-6 py-14 text-[#F1ECE5] md:px-10 lg:order-first">
          <h2 className="font-makaio text-[clamp(32px,4vw,46px)] font-black uppercase leading-none tracking-wider">
            {t("contact.whereToFind")}
          </h2>

          <ContactChannels />
        </div>
      </div>
    </CapaPage>
  );
}
