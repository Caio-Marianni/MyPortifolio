"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "theme";

/* Cor da barra do navegador no celular: espelha o `--surface` de cada tema no globals.css.
   O layout já entrega as duas em <meta media="...">, o que resolve quem segue o sistema;
   isto aqui é para quem escolheu o contrário do SO. */
const BROWSER_CHROME: Record<Theme, string> = { light: "#F1ECE5", dark: "#121110" };

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  /* Mesmo motivo do LanguageProvider: nada de `return null` antes de montar — o provider
     envolve o site inteiro e isso deixaria todas as páginas sem HTML no servidor.
     Aqui nem faria diferença: quem decide o tema é o script do <head>, que roda antes do
     primeiro paint. Este efeito só lê o resultado dele. */
  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    setMounted(true);
  }, []);

  /* O guarda `mounted` não é decoração: no primeiro commit `theme` ainda é o "light" do
     useState, então rodar isto ali tiraria a classe `dark` que o script acabou de pôr —
     flash creme na cara de quem escolheu escuro, exatamente o que o script evita. */
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((meta) => meta.setAttribute("content", BROWSER_CHROME[theme]));
  }, [theme, mounted]);

  /* Sem preferência salva o site segue o SO — inclusive quando ele muda com a página aberta
     (agendamento noturno do celular). Com preferência salva, ela manda: por isso o storage
     só é escrito no clique, nunca no efeito acima. Gravar o valor do sistema no primeiro
     load transformaria todo visitante num override e mataria este listener. */
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (localStorage.getItem(STORAGE_KEY)) return;
      setTheme(query.matches ? "dark" : "light");
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  /* Sem o memo, `value` é objeto novo a cada render e toda a árvore re-renderiza a cada
     tecla digitada no formulário de contato. */
  const value = useMemo<ThemeContextType>(
    () => ({
      theme,
      toggleTheme: () => {
        const next = theme === "light" ? "dark" : "light";
        localStorage.setItem(STORAGE_KEY, next);
        setTheme(next);
      },
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
