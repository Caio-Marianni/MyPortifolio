// Exemplo de interface, ajuste conforme os dados reais
interface RequestData {
  userId: string;
  // outras propriedades...
}

export default getRequestConfig(async ({ requestLocale }: { requestLocale: Promise<string> }) => {
  let locale = await requestLocale;
  const routing = {
    locales: ['en', 'es', 'fr'], // Example locales
    defaultLocale: 'en'
  };

  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }
  const messagesModule = await import(`../../messages/${locale}.json`);
  const messages = messagesModule.default;

  return {
    locale,
    messages,
  };
});
function getRequestConfig(arg0: ({ requestLocale }: { requestLocale: Promise<string>; }) => Promise<{ locale: string; messages: any; }>) {
  throw new Error("Function not implemented.");
}

