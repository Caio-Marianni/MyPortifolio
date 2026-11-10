import Script from "next/script";

/* GA4 do site. O ID de medição é público por natureza (sai no HTML), então fica aqui.
   Só em produção: o `next dev` não suja os números. /admin fica de fora — é só o Caio.
   O clique no WhatsApp é um listener só no documento, em vez de onClick em cada link:
   pega qualquer link pro wa.me, inclusive os que vierem depois. */
const GA_ID = "G-XJDLYWGRHV";

const init = `
if (!location.pathname.startsWith("/admin")) {
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag("js", new Date());
  gtag("config", "${GA_ID}");
  document.addEventListener("click", function (e) {
    var link = e.target instanceof Element && e.target.closest('a[href*="wa.me"]');
    if (link) gtag("event", "whatsapp_click", { link_url: link.href });
  });
}`;

export function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production") return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {init}
      </Script>
    </>
  );
}
