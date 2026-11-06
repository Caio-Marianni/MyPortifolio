"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/services/admin-session";
import { createClient, deleteClient, readClient, updateClient } from "@/services/clients";
import { readId } from "@/services/form-input";

const PAGE = "/admin/clientes";

/** Cadastra (sem `id`) e abre a ficha, ou edita e volta pra ela. O erro volta na URL. */
export async function saveClient(formData: FormData) {
  await requireAdmin();

  const id = readId(formData.get("id"));
  const read = readClient(formData);
  if ("error" in read) {
    redirect(id ? `${PAGE}/${id}?editar&erro=${encodeURIComponent(read.error)}` : `${PAGE}?novo&erro=${encodeURIComponent(read.error)}`);
  }

  const target = id ?? (await createClient(read.fields));
  if (id) await updateClient(id, read.fields);

  revalidatePath("/admin", "layout");
  redirect(`${PAGE}/${target}`);
}

/** Exclusão sem volta; a confirmação é a própria tela (`?excluir=cliente`). */
export async function removeClient(formData: FormData) {
  await requireAdmin();

  const id = readId(formData.get("id"));
  if (!id) return;

  if (!(await deleteClient(id))) {
    const erro = "Este cliente tem pagamento recebido ou documento enviado. Isso é histórico e não sai — encerre os planos em vez de excluir.";
    redirect(`${PAGE}/${id}?erro=${encodeURIComponent(erro)}`);
  }

  revalidatePath("/admin", "layout");
  redirect(PAGE);
}
