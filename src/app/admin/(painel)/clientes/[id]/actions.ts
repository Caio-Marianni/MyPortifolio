"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/services/admin-session";
import { createAccount, deleteAccount, readAccount, updateAccount } from "@/services/accounts";
import { field, paidOn, readId } from "@/services/form-input";
import { addInstallment, deletePayment, readInstallment, receiveInstallment, undoReceipt } from "@/services/payments";
import { createPlan, deletePlan, readPlan, receivePlanPayment, updatePlan } from "@/services/plans";
import { advanceProject, createProject, deleteProject, readProject, updateProject } from "@/services/projects";

/* Ações da ficha do cliente. Todas recebem `clientId` pra voltar pra ficha; o erro volta na URL
   junto com o formulário que estava aberto, pra você não perder o que digitou de vista.

   A volta leva uma âncora (`#plano-3`): sem ela o Next rola a ficha pro topo a cada ação, e você
   perde de vista o que acabou de mexer. Com `feito`, o item ainda pisca ao chegar. As âncoras são
   os `id` dos cards na ficha (plan-section, project-section, account-section). */

/** Volta pra ficha: `query` reabre o formulário quando há erro; `anchor` é onde a tela para. */
function back(clientId: number, query = "", anchor = ""): never {
  revalidatePath("/admin", "layout");
  redirect(`/admin/clientes/${clientId}${query ? `?${query}` : ""}${anchor ? `#${anchor}` : ""}`);
}

/** Deu certo: volta até o item, que pisca, e o aviso (`ok`, ActionNotice) diz o que aconteceu. */
const done = (clientId: number, anchor: string): never => back(clientId, `feito=${anchor}&ok=salvo`, anchor);

/** O "Recebi" e o "Desfazer" voltam pra onde o clique aconteceu: a visão geral (`voltar=painel`)
    ou a ficha. */
function backFrom(formData: FormData, clientId: number, query: string, anchor = ""): never {
  if (formData.get("voltar") !== "painel") back(clientId, query, anchor);
  revalidatePath("/admin", "layout");
  redirect(`/admin${query ? `?${query}` : ""}`);
}

/** O campo de data tem `max` e `required`; isto é a tranca do servidor, caso eles sejam pulados. */
const DATE_ERROR = `erro=${encodeURIComponent("Data do recebimento: um dia válido, até hoje.")}`;

/** Recebido: o aviso leva o pagamento (e o cliente, que a visão geral não sabe) pro "Desfazer". */
const received = (clientId: number, anchor: string, paymentId: number | null) =>
  `feito=${anchor}&ok=recebido${paymentId ? `&desfazer=${paymentId}&cliente=${clientId}` : ""}`;

const withError = (open: string, error: string) => `${open}&erro=${encodeURIComponent(error)}`;

/** Lê o par que toda ação precisa: de qual cliente e (quando há) de qual registro. */
async function ids(formData: FormData): Promise<{ clientId: number; id: number | null }> {
  await requireAdmin();
  const clientId = readId(formData.get("clientId"));
  if (!clientId) redirect("/admin/clientes");
  return { clientId, id: readId(formData.get("id")) };
}

/** Âncora que veio do formulário (o card de onde saiu a exclusão). Vai parar na URL do redirect,
    então só passa o formato dos ids da ficha. */
const anchorFrom = (formData: FormData): string => {
  const value = String(formData.get("anchor") ?? "");
  return /^(plano|projeto|parcela)-\d+$/.test(value) ? value : "";
};

export async function savePlan(formData: FormData) {
  const { clientId, id } = await ids(formData);
  const read = readPlan(formData);
  if ("error" in read) back(clientId, withError(`plano=${id ?? "novo"}`, read.error), `plano-${id ?? "novo"}`);

  if (id) await updatePlan(id, read.fields);
  done(clientId, `plano-${id ?? (await createPlan(clientId, read.fields))}`);
}

export async function removePlan(formData: FormData) {
  const { clientId, id } = await ids(formData);
  if (id && !(await deletePlan(id))) {
    back(clientId, `erro=${encodeURIComponent("Plano com mensalidade recebida não sai — mude a situação para Encerrado.")}`);
  }
  back(clientId, "ok=excluido", "planos");
}

/** "Recebi" do plano: grava o mês que vence a seguir. Atrasado de dois meses aperta duas vezes. */
export async function receivePlan(formData: FormData) {
  const { clientId, id } = await ids(formData);
  if (!id) back(clientId);
  const date = paidOn(field(formData, "paidOn"));
  if (!date) backFrom(formData, clientId, DATE_ERROR);
  const anchor = `plano-${id}`;
  backFrom(formData, clientId, received(clientId, anchor, await receivePlanPayment(id, date)), anchor);
}

export async function saveProject(formData: FormData) {
  const { clientId, id } = await ids(formData);
  const read = readProject(formData);
  if ("error" in read) back(clientId, withError(`projeto=${id ?? "novo"}`, read.error), `projeto-${id ?? "novo"}`);

  if (id) await updateProject(id, read.fields);
  done(clientId, `projeto-${id ?? (await createProject(clientId, read.fields))}`);
}

/** "Avançar para …" do projeto: a próxima etapa do caminho, sem abrir o formulário. */
export async function advanceStage(formData: FormData) {
  const { clientId, id } = await ids(formData);
  if (!id) back(clientId);
  await advanceProject(id);
  done(clientId, `projeto-${id}`);
}

export async function removeProject(formData: FormData) {
  const { clientId, id } = await ids(formData);
  if (id && !(await deleteProject(id))) {
    back(clientId, `erro=${encodeURIComponent("Projeto com parcela recebida não sai — mude a situação para Cancelado.")}`);
  }
  back(clientId, "ok=excluido", "projetos");
}

/** Parcela nova de um projeto; `id` aqui é o do projeto. */
export async function saveInstallment(formData: FormData) {
  const { clientId, id: projectId } = await ids(formData);
  if (!projectId) back(clientId);
  const read = readInstallment(formData);
  if ("error" in read) back(clientId, withError(`parcela=${projectId}`, read.error), `projeto-${projectId}`);

  await addInstallment(projectId, read.fields);
  done(clientId, `projeto-${projectId}`);
}

export async function receivePayment(formData: FormData) {
  const { clientId, id } = await ids(formData);
  if (!id) back(clientId);
  const date = paidOn(field(formData, "paidOn"));
  if (!date) backFrom(formData, clientId, DATE_ERROR);
  await receiveInstallment(id, date);
  const anchor = `parcela-${id}`;
  backFrom(formData, clientId, received(clientId, anchor, id), anchor);
}

/** "Desfazer" do aviso de recebido; volta pro item de onde o recebimento saiu (`anchor`). */
export async function undoPayment(formData: FormData) {
  const { clientId, id } = await ids(formData);
  if (id) await undoReceipt(id);
  const anchor = anchorFrom(formData);
  backFrom(formData, clientId, `ok=desfeito${anchor ? `&feito=${anchor}` : ""}`, anchor);
}

/** Desfaz um recebimento ou apaga uma parcela; volta pro card de onde saiu (`anchor`). */
export async function removePayment(formData: FormData) {
  const { clientId, id } = await ids(formData);
  if (id) await deletePayment(id);
  back(clientId, "ok=excluido", anchorFrom(formData));
}

export async function saveAccount(formData: FormData) {
  const { clientId, id } = await ids(formData);
  const read = readAccount(formData);
  if ("error" in read) back(clientId, withError(`conta=${id ?? "nova"}`, read.error), `conta-${id ?? "nova"}`);

  if (id) await updateAccount(id, read.fields);
  done(clientId, `conta-${id ?? (await createAccount(clientId, read.fields))}`);
}

export async function removeAccount(formData: FormData) {
  const { clientId, id } = await ids(formData);
  if (id) await deleteAccount(id);
  back(clientId, "aba=contas&ok=excluido", "contas");
}
