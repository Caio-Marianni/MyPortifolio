"use client";

import { Moon, Sun } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useTheme } from "@/contexts/theme-context";

/** PT / EN: rótulos fixos, só a opacidade muda. Tamanho em `em` — herda de quem envolve.
    Um botão só, não dois: clicar em qualquer ponto intercala os dois idiomas. O nome acessível
    vai no idioma de destino, então diz o que o clique faz sem precisar de chave de tradução. */
export function LangSwitch() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={language === "pt" ? "Switch to English" : "Mudar para português"}
      className="group flex items-center gap-[0.5em] font-bold focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current"
    >
      {(["pt", "en"] as const).map((code, i) => (
        <span key={code} className="flex items-center gap-[0.5em]">
          {i > 0 && <span className="opacity-30">/</span>}
          <span className={`transition-opacity ${language === code ?"opacity-100" : "opacity-40 group-hover:opacity-70"}`}>{code.toUpperCase()}</span>
        </span>
      ))}
    </button>
  );
}

/** Sol/lua no mesmo corpo do LangSwitch ao lado, medido em `em` para herdar de quem envolve.
    Quem troca o ícone é o CSS, não o estado: os dois são renderizados e o `dark:` esconde um.
    Isso resolve de graça o problema que o LangSwitch não tem — o servidor não sabe o tema do
    visitante, então qualquer ícone escolhido em JS erraria no primeiro render e piscaria.
    O nome acessível não cita o tema atual pelo mesmo motivo: diz o que o clique faz, e vale
    nos dois sentidos. */
export function ThemeSwitch() {
  const { toggleTheme } = useTheme();
  const { language } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={language === "pt" ? "Alternar tema claro e escuro" : "Toggle light and dark theme"}
      className="opacity-50 transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current"
    >
      <Moon className="h-[1.35em] w-[1.35em] dark:hidden" strokeWidth={2.5} aria-hidden />
      <Sun className="hidden h-[1.35em] w-[1.35em] dark:block" strokeWidth={2.5} aria-hidden />
    </button>
  );
}
