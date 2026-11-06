import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogIn } from "lucide-react";
import { LogoMark } from "@/components/ui/brand-marks";
import { FIELD, LABEL, button } from "@/components/ui/styles";
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
    <main className="flex min-h-screen items-center justify-center bg-surface px-5 font-inter text-ink">
      <div className="w-full max-w-[380px] border border-ink/15 bg-surface-raised p-8">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-8 w-8">
            <LogoMark />
          </span>
          <span>
            <span className="block font-makaio text-[22px] font-black uppercase leading-none tracking-display">Painel</span>
            <span className="text-meta text-ink/60">Área restrita</span>
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

          <button type="submit" className={`${button("solid", "lg")} w-full`}>
            Entrar
            <LogIn className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
          </button>
        </form>
      </div>
    </main>
  );
}
