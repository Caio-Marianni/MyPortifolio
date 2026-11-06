"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/services/admin-session";
import { createAccount, deleteAccount, readAccount, updateAccount } from "@/services/accounts";
import { readId } from "@/services/form-input";
import { addInstallment, deletePayment, readInstallment, receiveInstallment } from "@/services/payments";
import { createPlan, deletePlan, readPlan, receivePlanPayment, updatePlan } from "@/services/plans";
import { createProject, deleteProject, readProject, updateProject } from "@/services/projects";

/* Ações da ficha do cliente. Todas recebem `clientId` pra voltar pra ficha; o erro volta na URL
   junto com o formulário que estava aberto, pra você não perder o que digitou de vista. */

/** Volta pra ficha, com a query que reabre o formulário quando há erro. */
function back(clientId: number, query = ""): never {
  revalidatePath("/admin", "layout");
  redirect(`/admin/clientes/${clientId}${query ? `?${query}` : ""}`);
}

const withError = (open: string, error: string) => `${open}&erro=${encodeURIComponent(error)}`;

/** Lê o par que toda ação precisa: de qual cliente e (quando há) de qual registro. */
async function ids(formData: FormData): Promise<{ clientId: number; id: number | null }> {
  await requireAdmin();
  const clientId = readId(formData.get("clientId"));
  if (!clientId) redirect("/admin/clientes");
  return { clientId, id: readId(formData.get("id")) };
}

export async function savePlan(formData: FormData) {
  const { clientId, id } = await ids(formData);
  const read = readPlan(formData);
  if ("error" in read) back(clientId, withError(`plano=${id ?? "novo"}`, read.error));

  if (id) await updatePlan(id, read.fields);
  else await createPlan(clientId, read.fields);
  back(clientId);
}

export async function removePlan(formData: FormData) {
  const { clientId, id } = await ids(formData);
  if (id && !(await deletePlan(id))) {
    back(clientId, `erro=${encodeURIComponent("Plano com mensalidade recebida não sai — mude a situação para Encerrado.")}`);
  }
  back(clientId);
}

/** "Recebi" do plano: grava o mês que vence a seguir. Atrasado de dois meses aperta duas vezes. */
export async function receivePlan(formData: FormData) {
  const { clientId, id } = await ids(formData);
  if (id) await receivePlanPayment(id);
  back(clientId);
}

export async function saveProject(formData: FormData) {
  const { clientId, id } = await ids(formData);
  const read = readProject(formData);
  if ("error" in read) back(clientId, withError(`projeto=${id ?? "novo"}`, read.error));

  if (id) await updateProject(id, read.fields);
  else await createProject(clientId, read.fields);
  back(clientId);
}

export async function removeProject(formData: FormData) {
  const { clientId, id } = await ids(formData);
  if (id && !(await deleteProject(id))) {
    back(clientId, `erro=${encodeURIComponent("Projeto com parcela recebida não sai — mude a situação para Cancelado.")}`);
  }
  back(clientId);
}

/** Parcela nova de um projeto; `id` aqui é o do projeto. */
export async function saveInstallment(formData: FormData) {
  const { clientId, id: projectId } = await ids(formData);
  if (!projectId) back(clientId);
  const read = readInstallment(formData);
  if ("error" in read) back(clientId, withError(`parcela=${projectId}`, read.error));

  await addInstallment(projectId, read.fields);
  back(clientId);
}

export async function receivePayment(formData: FormData) {
  const { clientId, id } = await ids(formData);
  if (id) await receiveInstallment(id);
  back(clientId);
}

export async function removePayment(formData: FormData) {
  const { clientId, id } = await ids(formData);
  if (id) await deletePayment(id);
  back(clientId);
}

export async function saveAccount(formData: FormData) {
  const { clientId, id } = await ids(formData);
  const read = readAccount(formData);
  if ("error" in read) back(clientId, withError(`conta=${id ?? "nova"}`, read.error));

  if (id) await updateAccount(id, read.fields);
  else await createAccount(clientId, read.fields);
  back(clientId);
}

export async function removeAccount(formData: FormData) {
  const { clientId, id } = await ids(formData);
  if (id) await deleteAccount(id);
  back(clientId);
}
