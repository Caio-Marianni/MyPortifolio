"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/services/admin-session";
import { deleteMessage, setAnswered } from "@/services/contact";

const PAGE = "/admin/mensagens";

/** Respondida sai da caixa de entrada sem sumir; o mesmo botão reabre. */
export async function toggleAnswered(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await setAnswered(id, formData.get("answered") === "1");
  revalidatePath("/admin", "layout");
}

export async function removeMessage(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await deleteMessage(id);
  revalidatePath("/admin", "layout");
  redirect(PAGE);
}
