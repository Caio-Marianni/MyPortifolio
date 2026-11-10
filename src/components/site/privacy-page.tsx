"use client";

import { RATING_FONT, MONOGRAM } from "@/components/ui/brand-marks";
import { MarkBackdrop, Tarja, TarjaSheet, WhatsAppIcon } from "@/components/site/tarja";
import { CONTACT_3D, FOCUS } from "@/components/ui/styles";
import { useLanguage } from "@/contexts/language-context";
import { useWhatsapp } from "@/hooks/use-whatsapp";

type Text = { pt: string; en: string };

/* O que o site coleta de fato: GA4 (visitas e clique no WhatsApp) e o formulário de avaliação,
   que só abre por convite. Mudou o que se coleta, muda este texto e a data. */
const UPDATED: Text = { pt: "Atualizada em 10 de novembro de 2026", en: "Updated November 10, 2026" };

const SECTIONS: { title: Text; body: Text }[] = [
  {
    title: { pt: "Quem cuida dos dados", en: "Who handles the data" },
    body: {
      pt: "Este site é de Caio Marianni, desenvolvedor e designer em Goiás, Brasil. Dúvidas ou pedidos sobre seus dados: caiomarianni@gmail.com ou pelo WhatsApp, no fim desta página.",
      en: "This site belongs to Caio Marianni, a developer and designer in Goiás, Brazil. Questions or requests about your data: caiomarianni@gmail.com or WhatsApp, at the end of this page.",
    },
  },
  {
    title: { pt: "Estatísticas de visita", en: "Visit statistics" },
    body: {
      pt: "Usamos o Google Analytics para saber quantas pessoas visitam o site, de onde vieram, quais páginas viram, o tipo de aparelho, a região aproximada e se clicaram no WhatsApp. O Google usa cookies para isso. Não recebemos seu nome, e-mail ou telefone por essa via, e os dados não são usados para anúncios.",
      en: "We use Google Analytics to learn how many people visit the site, where they came from, which pages they viewed, device type, approximate region and whether they clicked WhatsApp. Google uses cookies for this. We don't receive your name, email or phone this way, and the data isn't used for ads.",
    },
  },
  {
    title: { pt: "Avaliações", en: "Reviews" },
    body: {
      pt: "Quem recebe um convite para avaliar o trabalho informa nome, empresa, nota, comentário e, se quiser, uma foto. Isso é publicado na página de avaliações depois de aprovado. Para alterar ou remover sua avaliação, é só pedir pelo e-mail acima.",
      en: "Clients invited to review the work provide name, company, rating, comment and, optionally, a photo. It's published on the reviews page after approval. To change or remove your review, just ask by email.",
    },
  },
  {
    title: { pt: "WhatsApp", en: "WhatsApp" },
    body: {
      pt: "O botão de contato abre uma conversa no WhatsApp. A conversa acontece lá, sob a política de privacidade do próprio WhatsApp.",
      en: "The contact button opens a WhatsApp chat. The conversation happens there, under WhatsApp's own privacy policy.",
    },
  },
  {
    title: { pt: "Seus direitos", en: "Your rights" },
    body: {
      pt: "Pela LGPD, você pode pedir acesso, correção ou exclusão dos seus dados pelo e-mail acima. Para não ser contado nas estatísticas, você pode bloquear cookies no navegador ou usar a extensão oficial de desativação do Google Analytics.",
      en: "Under Brazil's LGPD you can request access, correction or deletion of your data by email. To opt out of statistics, block cookies in your browser or use Google's official Analytics opt-out extension.",
    },
  },
];

export function PrivacyPage() {
  const { language } = useLanguage();
  const whatsapp = useWhatsapp();

  return (
    <main data-page="privacidade" className="theme-light flex min-h-screen flex-col bg-chrome font-inter text-ink lg:flex-row">
      <Tarja homeHref="/" backdrop={<MarkBackdrop path={MONOGRAM} />}>
        {/* como o 404 da página não encontrada: preenche a tarja e empurra os botões pro pé */}
        <p className={`${RATING_FONT} mt-40 text-[min(calc((100vw-40px)/2.6),150px)] font-bold leading-[0.8] tracking-[-0.04em] lg:mt-auto lg:text-[130px]`} aria-hidden>
          LGPD
        </p>
      </Tarja>

      <TarjaSheet>
        <article className="flex max-w-[64ch] flex-col gap-8 lg:my-auto">
          <header className="flex flex-col gap-2">
            <h1 className={`${RATING_FONT} text-[clamp(32px,4vw,44px)] font-bold uppercase leading-none`}>
              {language === "pt" ? "Política de privacidade" : "Privacy policy"}
            </h1>
            <p className="text-meta text-ink/55">{UPDATED[language]}</p>
          </header>
          {SECTIONS.map(({ title, body }) => (
            <section key={title.pt} className="flex flex-col gap-2">
              <h2 className="text-body font-semibold">{title[language]}</h2>
              <p className="text-body leading-relaxed text-ink/70">{body[language]}</p>
            </section>
          ))}
          <section className="flex flex-col items-start gap-3 border-t border-ink/10 pt-8">
            <p className="text-body leading-relaxed text-ink/70">
              {language === "pt" ? "Ficou alguma dúvida sobre seus dados? Fale comigo direto:" : "Any question about your data? Talk to me directly:"}
            </p>
            <a href={whatsapp.href} target="_blank" rel="noopener noreferrer" className={`${CONTACT_3D} ${FOCUS}`}>
              WhatsApp
              <WhatsAppIcon className="h-[1.1em] w-[1.1em]" aria-hidden />
            </a>
          </section>
        </article>
      </TarjaSheet>
    </main>
  );
}
