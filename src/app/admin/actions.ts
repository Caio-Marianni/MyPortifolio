"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  COOKIE,
  MAX_AGE,
  clearFailures,
  credentialsOk,
  newSession,
  registerFailure,
  tooManyTries,
  validSession,
} from "@/services/admin";
import { setStatus } from "@/services/reviews";
import type { Status } from "@/data/reviews";

/* Server action é endpoint público: quem descobre o id da action consegue chamá-la de fora do
   painel. Por isso `decide` confere a sessão de novo — a tela escondida não é a tranca. */

const STATUSES: Status[] = ["pending", "approved", "rejected"];

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/admin",
  maxAge: MAX_AGE,
};

const authed = () => validSession(cookies().get(COOKIE)?.value);

/** IP de quem tentou, atrás do proxy da Vercel. Sem ele o limite seria global e a tentativa de
    um desconhecido trancaria você junto. */
function clientIp(): string {
  return headers().get("x-forwarded-for")?.split(",")[0].trim() || "desconhecido";
}

export async function login(formData: FormData) {
  const ip = clientIp();
  const user = String(formData.get("user") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  /* O redirect fica fora do try de propósito: ele funciona jogando uma exceção, e o catch
     daqui a engoliria — o login pararia de sair da tela. */
  let destino: string;
  try {
    if (await tooManyTries(ip)) {
      destino = "/admin?erro=bloqueado";
    } else if (credentialsOk(user, password)) {
      await clearFailures(ip);
      cookies().set(COOKIE, newSession(), COOKIE_OPTIONS);
      destino = "/admin";
    } else {
      await registerFailure(ip);
      destino = "/admin?erro=credenciais";
    }
  } catch (error) {
    console.error("[admin] falha no login:", error);
    destino = "/admin?erro=banco";
  }

  redirect(destino);
}

export async function logout() {
  cookies().delete({ name: COOKIE, path: COOKIE_OPTIONS.path });
  redirect("/admin");
}

export async function decide(formData: FormData) {
  if (!authed()) redirect("/admin");

  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (!Number.isInteger(id) || !STATUSES.includes(status as Status)) return;

  await setStatus(id, status as Status);

  /* A nota aparece no cabeçalho de toda página, e o layout raiz é quem a busca — revalidar só
     `/reviews` deixaria o hero mostrando a média antiga até o ISR virar. */
  revalidatePath("/", "layout");
}
