"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/services/admin-session";
import {
  createTemplate,
  deleteDocument,
  deleteTemplate,
  generateDocument,
  readDocumentText,
  readSignature,
  readTemplate,
  setDocumentSent,
  signDocument,
  updateDocumentText,
  updateTemplate,
} from "@/services/documents";
import { readId } from "@/services/form-input";

const PAGE = "/admin/documentos";
const MODELS = `${PAGE}/modelos`;

function done(path: string): never {
  revalidatePath("/admin", "layout");
  redirect(path);
}

const withError = (path: string, error: string) => `${path}${path.includes("?") ? "&" : "?"}erro=${encodeURIComponent(error)}`;

/* ---------- modelos ---------- */

export async function saveTemplate(formData: FormData) {
  await requireAdmin();
  const id = readId(formData.get("id"));
  const read = readTemplate(formData);
  if ("error" in read) done(withError(id ? `${MODELS}?editar=${id}` : `${MODELS}?novo=branco`, read.error));

  if (id) await updateTemplate(id, read.fields);
  else await createTemplate(read.fields);
  done(MODELS);
}

export async function removeTemplate(formData: FormData) {
  await requireAdmin();
  const id = readId(formData.get("id"));
  if (id) await deleteTemplate(id);
  done(MODELS);
}

/* ---------- documentos ---------- */

/** Gera o rascunho a partir da ficha do cliente. O vínculo chega como "projeto:3" ou "plano:2". */
export async function generate(formData: FormData) {
  await requireAdmin();
  const clientId = readId(formData.get("clientId"));
  const templateId = readId(formData.get("templateId"));
  if (!clientId) redirect("/admin/clientes");
  if (!templateId) done(withError(`/admin/clientes/${clientId}`, "Escolha um modelo."));

  const [kind, linkId] = String(formData.get("link") ?? "").split(":");
  const id = await generateDocument({
    clientId,
    templateId,
    projectId: kind === "projeto" ? readId(linkId) : null,
    planId: kind === "plano" ? readId(linkId) : null,
  });
  if (!id) done(withError(`/admin/clientes/${clientId}`, "Modelo ou cliente não encontrado."));
  done(`${PAGE}/${id}`);
}

export async function saveDocument(formData: FormData) {
  await requireAdmin();
  const id = readId(formData.get("id"));
  if (!id) redirect(PAGE);

  const read = readDocumentText(formData);
  if ("error" in read) done(withError(`${PAGE}/${id}`, read.error));
  if (!(await updateDocumentText(id, read))) done(withError(`${PAGE}/${id}`, "Só rascunho muda de texto. Volte para rascunho antes de editar."));
  done(`${PAGE}/${id}`);
}

/** Rascunho ↔ enviado: `sent=1` marca como enviado, `sent=0` volta pra rascunho. */
export async function markSent(formData: FormData) {
  await requireAdmin();
  const id = readId(formData.get("id"));
  if (!id) redirect(PAGE);

  await setDocumentSent(id, formData.get("sent") === "1");
  done(`${PAGE}/${id}`);
}

export async function sign(formData: FormData) {
  await requireAdmin();
  const id = readId(formData.get("id"));
  if (!id) redirect(PAGE);

  const read = readSignature(formData);
  if ("error" in read) done(withError(`${PAGE}/${id}`, read.error));
  await signDocument(id, read);
  done(`${PAGE}/${id}`);
}

export async function removeDocument(formData: FormData) {
  await requireAdmin();
  const id = readId(formData.get("id"));
  if (!id) redirect(PAGE);

  if (!(await deleteDocument(id))) done(withError(`${PAGE}/${id}`, "Documento assinado não sai."));
  done(PAGE);
}
