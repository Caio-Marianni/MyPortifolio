import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogIn } from "lucide-react";
import { MarkBackdrop } from "@/components/site/tarja";
import { LogoMark, MONOGRAM, RATING_FONT } from "@/components/ui/brand-marks";
import { BUTTON_SOLID, FIELD, LABEL } from "@/components/ui/styles";
import { TarjaRelief } from "@/components/ui/tarja-relief";
import { MAX_TRIES, WINDOW_MINUTES } from "@/services/admin";
import { isAdmin } from "@/services/admin-session";
import { login } from "../actions";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

/* Uma mensagem por motivo, e nenhuma delas diz qual metade errou: quem tenta adivinhar não
   ganha pista, e você sabe na hora se foi digitação, tranca ou banco fora do ar. */
const ERROS: Record<string, string> = {
  credenciais: "Usuário ou senha incorretos.",
  bloqueado: `Errou ${MAX_TRIES} vezes. Espere ${WINDOW_MINUTES} minutos antes de tentar de novo.`,
  banco: "Não consegui falar com o banco. Confira a DATABASE_URL.",
};

type Params = { searchParams: Promise<{ erro?: string }> };

export default async function LoginPage(props: Params) {
  if (await isAdmin()) redirect("/admin");
  const { erro } = await props.searchParams;

  return (
    /* A tela inteira é tarja — relevo e o monograma marcado a ferro na borda direita — e o login
       é um card creme por cima, com a sombra dos diálogos do site. O monograma vai numa caixa da
       largura da tarja porque o MarkBackdrop se posiciona em % dela. */
    <main data-page="login" className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-chrome px-5 font-inter text-ink">
      <TarjaRelief
        backdrop={
          <div className="absolute inset-y-0 right-0 w-[440px] max-w-full" aria-hidden>
            <MarkBackdrop path={MONOGRAM} />
          </div>
        }
      />
      <div className="w-full max-w-[380px] rounded-2xl bg-paper p-8 shadow-[0_24px_60px_-12px_rgb(0_0_0/0.5)]">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-9 w-9">
            <LogoMark />
          </span>
          <span>
            <span className={`block ${RATING_FONT} text-[34px] uppercase leading-[0.9]`}>Painel</span>
            <span className="font-mono text-meta tracking-[0.06em] text-ink/60">área restrita</span>
          </span>
        </div>

        {/* autoComplete off nos dois campos: o gerenciador de senhas preencheria o usuário, que
            precisa ficar vazio, e o login falharia sem você entender por quê. */}
        <form action={login} autoComplete="off" className="flex flex-col gap-5">
          <div>
            <label htmlFor="user" className={LABEL}>
              Usuário
            </label>
            <input type="text" id="user" name="user" autoComplete="off" className={FIELD} />
          </div>

          <div>
            <label htmlFor="password" className={LABEL}>
              Senha
            </label>
            <input type="password" id="password" name="password" required autoComplete="off" className={FIELD} />
          </div>

          {erro && ERROS[erro] && (
            <p role="alert" className="text-ui text-danger">
              {ERROS[erro]}
            </p>
          )}

          <button type="submit" className={`${BUTTON_SOLID} mt-1 w-full`}>
            Entrar
            <LogIn className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
          </button>
        </form>
      </div>
    </main>
  );
}
