import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, validSession } from "@/services/admin";

/* A sessão do painel lida da requisição. Separado de services/admin.ts porque lá é função pura,
   testada por `npm run check` no node sem o Next — e `cookies()` só existe dentro dele. */

export async function isAdmin(): Promise<boolean> {
  return validSession((await cookies()).get(COOKIE)?.value);
}

/** Para páginas e server actions: sem sessão, volta pro login. Action é endpoint público —
    quem descobre o id consegue chamá-la de fora do painel —, então toda action começa por aqui,
    não só a página que mostra o botão. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
