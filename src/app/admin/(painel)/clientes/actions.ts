"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, validSession } from "@/services/admin";
import { createClient, deleteClient, markPaid, readClient, updateClient } from "@/services/clients";

/* Mesma tranca de admin/actions.ts: action é endpoint público, então cada uma confere a
   sessão de novo — a tela escondida não é a tranca. */

const authed = async () => validSession((await cookies()).get(COOKIE)?.value);

const PAGE = "/admin/clientes";

/** Cadastra (sem `id`) ou edita. O erro volta na URL: os campos do formulário já têm `required`,
    `maxLength`, `type="date"` e `pattern`, então chegar aqui com erro é raro. */
export async function saveClient(formData: FormData) {
  if (!(await authed())) redirect("/admin");

  const id = Number(formData.get("id"));
  const read = readClient(formData);
  if ("error" in read) {
    redirect(`${PAGE}?${id ? `editar=${id}` : "nova"}&erro=${encodeURIComponent(read.error)}`);
  }

  if (Number.isInteger(id) && id > 0) await updateClient(id, read.fields);
  else await createClient(read.fields);

  revalidatePath(PAGE);
  redirect(PAGE);
}

/** Exclusão sem volta; a confirmação é a própria tela (`?excluir=<id>`), como nas avaliações. */
export async function removeClient(formData: FormData) {
  if (!(await authed())) redirect("/admin");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await deleteClient(id);
  revalidatePath(PAGE);
  redirect(PAGE);
}

export async function paid(formData: FormData) {
  if (!(await authed())) redirect("/admin");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await markPaid(id);
  revalidatePath(PAGE);
}
