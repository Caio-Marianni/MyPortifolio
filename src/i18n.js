import { createI18n } from 'vue-i18n';

// Carregue os arquivos de tradução
import en from './locales/en.json';
import pt from './locales/pt.json';

// Configuração do Vue I18n
const i18n = createI18n({
  locale: 'en', // Idioma padrão
  fallbackLocale: 'en', // Idioma de fallback caso uma tradução não esteja disponível
  messages: {
    en, // Traduções em inglês
    pt, // Traduções em português
  },
});

export default i18n;