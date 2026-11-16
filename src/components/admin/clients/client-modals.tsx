import type { ReactNode } from "react";
import { AccountForm } from "@/components/admin/clients/account-section";
import { ClientForm } from "@/components/admin/clients/client-form";
import { PlanForm } from "@/components/admin/clients/plan-section";
import { InstallmentForm, ProjectForm } from "@/components/admin/clients/project-section";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { GenerateForm } from "@/components/admin/documents/client-documents";
import { Modal } from "@/components/admin/modal";
import type { Account } from "@/services/accounts";
import type { Client } from "@/services/clients";
import type { Template } from "@/services/documents";
import { brl } from "@/services/money";
import type { Payment } from "@/services/payments";
import type { Plan } from "@/services/plans";
import type { Project } from "@/services/projects";
import { removeClient } from "@/app/admin/(painel)/clientes/actions";
import { removeAccount, removePayment, removePlan, removeProject } from "@/app/admin/(painel)/clientes/[id]/actions";

/* As janelas da ficha do cliente. Quem abre é a URL — `?editar`, `?plano=novo`, `?projeto=3`,
   `?parcela=3`, `?conta=nova`, `?gerar`, `?excluir=plano-3` —, como antes abria o formulário no
   lugar do item: F5 mantém, e o erro da action volta pra mesma URL com a janela aberta. Fechar
   volta pra `here`, a aba onde você estava. Item que não existe mais (URL velha): nenhuma janela. */

export type ModalParams = {
  editar?: string;
  plano?: string;
  projeto?: string;
  parcela?: string;
  conta?: string;
  gerar?: string;
  excluir?: string;
  erro?: string;
};

type Data = {
  client: Client;
  plans: Plan[];
  projects: Project[];
  payments: Payment[];
  accounts: Account[];
  templates: Template[];
};

const byId = <T extends { id: number }>(list: T[], id?: string): T | undefined => list.find((item) => String(item.id) === id);

export function ClientModals({ params, here, ...data }: Data & { params: ModalParams; here: string }) {
  const { client, plans, projects, accounts, templates } = data;
  const { erro } = params;
  const open = (title: string, form: ReactNode) => (
    <Modal title={title} closeHref={here}>
      {form}
    </Modal>
  );

  if (params.editar !== undefined) return open("Editar cliente", <ClientForm client={client} erro={erro} cancelHref={here} />);

  if (params.plano) {
    const plan = byId(plans, params.plano);
    if (params.plano !== "novo" && !plan) return null;
    return open(plan ? "Editar plano" : "Novo plano", <PlanForm clientId={client.id} plan={plan} erro={erro} cancelHref={here} />);
  }

  if (params.projeto) {
    const project = byId(projects, params.projeto);
    if (params.projeto !== "novo" && !project) return null;
    return open(project ? "Editar projeto" : "Novo projeto", <ProjectForm clientId={client.id} project={project} erro={erro} cancelHref={here} />);
  }

  if (params.parcela) {
    const project = byId(projects, params.parcela);
    if (!project) return null;
    return open(`Nova parcela · ${project.title}`, <InstallmentForm project={project} erro={erro} cancelHref={here} />);
  }

  if (params.conta) {
    const account = byId(accounts, params.conta);
    if (params.conta !== "nova" && !account) return null;
    return open(account ? "Editar conta" : "Nova conta", <AccountForm clientId={client.id} account={account} erro={erro} cancelHref={here} />);
  }

  if (params.gerar !== undefined) {
    const from = `${here}${here.includes("?") ? "&" : "?"}gerar`;
    return open(
      "Gerar documento",
      <GenerateForm clientId={client.id} templates={templates} projects={projects} plans={plans} cancelHref={here} from={from} erro={erro} />,
    );
  }

  if (params.excluir) return <DeleteModal excluir={params.excluir} here={here} {...data} />;
  return null;
}

/** A confirmação de cada exclusão: o que some, e o que impede, antes do botão vermelho. */
function DeleteModal({ excluir, here, client, plans, projects, payments, accounts }: Data & { excluir: string; here: string }) {
  const clientId = client.id;

  if (excluir === "cliente") {
    return (
      <ConfirmModal
        title="Excluir cliente?"
        message={`Exclui ${client.name} com contas, planos, projetos e rascunhos. Pagamento recebido ou documento enviado impedem — aí encerre os planos em vez de excluir.`}
        action={removeClient}
        fields={{ id: clientId }}
        cancelHref={here}
      />
    );
  }

  const [kind, raw] = excluir.split("-");

  if (kind === "plano") {
    const plan = byId(plans, raw);
    return plan ? (
      <ConfirmModal
        title="Excluir plano?"
        message={`Exclui o plano “${plan.name}”. Plano com mensalidade recebida não sai — aí mude a situação para Encerrado.`}
        action={removePlan}
        fields={{ clientId, id: plan.id }}
        cancelHref={here}
      />
    ) : null;
  }

  if (kind === "projeto") {
    const project = byId(projects, raw);
    return project ? (
      <ConfirmModal
        title="Excluir projeto?"
        message={`Exclui “${project.title}” e as parcelas não recebidas. Projeto com parcela recebida não sai — aí mude a situação para Cancelado.`}
        action={removeProject}
        fields={{ clientId, id: project.id }}
        cancelHref={here}
      />
    ) : null;
  }

  if (kind === "conta") {
    const account = byId(accounts, raw);
    return account ? (
      <ConfirmModal
        title="Tirar da lista?"
        message={`“${account.service}” sai de Contas e acessos. A conta em si não muda — isto é só a sua anotação.`}
        action={removeAccount}
        fields={{ clientId, id: account.id }}
        confirmLabel="Tirar da lista"
        cancelHref={here}
      />
    ) : null;
  }

  const payment = byId(payments, raw);
  if (!payment) return null;

  if (kind === "pagamento") {
    return (
      <ConfirmModal
        title="Desfazer recebimento?"
        message={`${payment.description ?? "A mensalidade"} (${brl(payment.amount)}) volta a ficar em aberto.`}
        action={removePayment}
        fields={{ clientId, id: payment.id, anchor: payment.planId ? `plano-${payment.planId}` : "" }}
        confirmLabel="Desfazer"
        icon="undo"
        cancelHref={here}
      />
    );
  }

  if (kind === "parcela") {
    const what = `“${payment.description ?? "Parcela"}” (${brl(payment.amount)})`;
    return (
      <ConfirmModal
        title="Apagar parcela?"
        message={payment.paidOn ? `Apaga ${what} e o registro do recebimento.` : `Apaga a parcela ${what}.`}
        action={removePayment}
        fields={{ clientId, id: payment.id, anchor: payment.projectId ? `projeto-${payment.projectId}` : "" }}
        confirmLabel="Apagar"
        cancelHref={here}
      />
    );
  }

  return null;
}
