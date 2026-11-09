import { WHATSAPP_URL } from "@/components/contact/contact-channels";
import { useLanguage } from "@/contexts/language-context";

/** link e rótulo do WhatsApp, com a mensagem pronta no idioma da página */
export function useWhatsapp() {
  const { language } = useLanguage();
  const pt = language === "pt";
  return {
    href: `${WHATSAPP_URL}?text=${encodeURIComponent(pt ? "Oi Caio, vim pelo seu site." : "Hi Caio, I found you through your website.")}`,
    label: pt ? "Fale comigo" : "Get in touch",
  };
}
