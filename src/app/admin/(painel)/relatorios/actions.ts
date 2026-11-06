"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/services/admin-session";
import { readId } from "@/services/form-input";
import { generateReport, readMonth, readReportEdit, setReportSent, updateReport } from "@/services/reports";

const PAGE = "/admin/relatorios";

function done(path: string): never {
  revalidatePath("/admin", "layout");
  redirect(path);
}

const withError = (path: string, error: string) => `${path}${path.includes("?") ? "&" : "?"}erro=${encodeURIComponent(error)}`;

/** Gera ou atualiza os números. O erro do Google (conta sem acesso, id errado) volta pra tela
    com a mensagem dele — é ela que diz o que configurar. */
export async function generate(formData: FormData) {
  await requireAdmin();
  const planId = readId(formData.get("planId"));
  const month = readMonth(String(formData.get("month") ?? ""), "");
  const from = String(formData.get("from") ?? PAGE).startsWith(PAGE) ? String(formData.get("from") ?? PAGE) : PAGE;
  if (!planId || !month) done(PAGE);

  let id: number | null;
  try {
    id = await generateReport(planId, month);
  } catch (error) {
    console.error("[admin] falha ao gerar relatório:", error);
    done(withError(from, error instanceof Error ? error.message : "Não consegui gerar o relatório."));
  }
  if (!id) done(withError(from, "Plano não encontrado."));
  done(`${PAGE}/${id}`);
}

export async function saveReport(formData: FormData) {
  await requireAdmin();
  const id = readId(formData.get("id"));
  if (!id) redirect(PAGE);

  const read = readReportEdit(formData);
  if ("error" in read) done(withError(`${PAGE}/${id}`, read.error));
  if (!(await updateReport(id, read))) done(withError(`${PAGE}/${id}`, "Relatório já enviado. Reabra antes de mudar."));
  done(`${PAGE}/${id}`);
}

/** `sent=1` marca como enviado hoje; `sent=0` reabre pra corrigir. */
export async function markReportSent(formData: FormData) {
  await requireAdmin();
  const id = readId(formData.get("id"));
  if (!id) redirect(PAGE);

  await setReportSent(id, formData.get("sent") === "1");
  done(`${PAGE}/${id}`);
}
