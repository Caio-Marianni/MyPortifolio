"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, COOKIE_PATH, MAX_AGE, clearFailures, credentialsOk, newSession, registerFailure, tooManyTries } from "@/services/admin";
import { clientIp } from "@/services/client-ip";

/* Entrar e sair. As ações de cada tela moram ao lado dela, em (painel)/<tela>/actions.ts. */

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: COOKIE_PATH,
  maxAge: MAX_AGE,
};

export async function login(formData: FormData) {
  const ip = clientIp(await headers());
  const user = String(formData.get("user") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  /* O redirect fica fora do try de propósito: ele funciona jogando uma exceção, e o catch
     daqui a engoliria — o login pararia de sair da tela. */
  let destino: string;
  try {
    if (await tooManyTries(ip)) {
      destino = "/admin/login?erro=bloqueado";
    } else if (credentialsOk(user, password)) {
      await clearFailures(ip);
      (await cookies()).set(COOKIE, newSession(), COOKIE_OPTIONS);
      destino = "/admin";
    } else {
      await registerFailure(ip);
      destino = "/admin/login?erro=credenciais";
    }
  } catch (error) {
    console.error("[admin] falha no login:", error);
    destino = "/admin/login?erro=banco";
  }

  redirect(destino);
}

export async function logout() {
  (await cookies()).delete({ name: COOKIE, path: COOKIE_OPTIONS.path });
  redirect("/admin/login");
}
