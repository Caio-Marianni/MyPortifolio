"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/services/admin-session";
import { deleteReview, setStatus } from "@/services/reviews";
import type { Status } from "@/data/reviews";

const STATUSES: Status[] = ["pending", "approved", "rejected"];

export async function decide(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (!Number.isInteger(id) || !STATUSES.includes(status as Status)) return;

  await setStatus(id, status as Status);
  /* a média e a lista pública saem das aprovadas — o site inteiro muda junto */
  revalidatePath("/", "layout");
}

/** Exclusão sem volta. A confirmação é a própria tela — o card só mostra o botão depois de
    `?excluir=<id>` —, então aqui não há segunda pergunta a fazer. */
export async function remove(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await deleteReview(id);
  revalidatePath("/", "layout");
  redirect("/admin/avaliacoes");
}
