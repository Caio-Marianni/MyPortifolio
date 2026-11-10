"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/services/admin-session";
import { setChecklistItem } from "@/services/checklist";
import { readId } from "@/services/form-input";

/* Marcar/desmarcar um passo do checklist. Volta pra ficha na âncora do passo (sem ela o Next rola
   pro topo) e com `feito` pra ele piscar — o mesmo combinado das outras ações da ficha. */
export async function toggleChecklistItem(formData: FormData) {
  await requireAdmin();
  const clientId = readId(formData.get("clientId"));
  if (!clientId) redirect("/admin/clientes");

  const item = String(formData.get("item") ?? "");
  const ok = await setChecklistItem(clientId, item, formData.get("done") === "1");
  const anchor = ok ? `check-${item}` : "checklist";

  revalidatePath("/admin", "layout");
  redirect(`/admin/clientes/${clientId}?feito=${anchor}#${anchor}`);
}
