import Link from "next/link";
import { ArrowUpRight, BarChart3, Globe, KeyRound, Mail, Pencil, Search, Server, Share2, Trash2, UserRound, type LucideIcon } from "lucide-react";
import { AddRow } from "@/components/admin/add-row";
import { CollapsibleCard } from "@/components/admin/collapsible-card";
import { CopyButton } from "@/components/admin/copy-field";
import { DeleteConfirm } from "@/components/admin/delete-confirm";
import { Field, FormError, Select, TextArea } from "@/components/admin/fields";
import { IconLink } from "@/components/admin/icon-link";
import { SubmitButton } from "@/components/admin/submit-button";
import { BUTTON, BUTTON_SOLID, CARD_TITLE, INLINE_FORM, ITEM_CARD, NUM, flash } from "@/components/ui/styles";
import { ACCOUNT_LIMITS, OWNERS, OWNER_LABEL, renewal, serviceKind, type Account, type ServiceKind } from "@/services/accounts";
import { siteHref } from "@/services/clients";
import { br, todayInBrazil } from "@/services/dates";
import { removeAccount, saveAccount } from "@/app/admin/(painel)/clientes/[id]/actions";

/* Contas e acessos: a lista que vira roteiro quando o cliente sai — o que está no seu nome é o
   que precisa ser transferido, e o resto é tirar o seu acesso. Por isso o que está no seu nome
   vem num grupo à parte, em cima. Cada conta é um cartão: o que é, onde se entra, com qual login
   e quando renova. */

const KIND_ICON: Record<ServiceKind, LucideIcon> = {
  domain: Globe,
  hosting: Server,
  analytics: BarChart3,
  search: Search,
  email: Mail,
  social: Share2,
  other: KeyRound,
};

/* vencida em vermelho, até 30 dias em laranja; longe disso, a voz apagada de sempre */
const RENEWAL_TONE = { late: "text-danger", soon: "text-accent", ok: "text-ink/60" };

const GROUP_TITLE = "text-meta font-semibold uppercase tracking-[0.06em]";

function AccountForm({ clientId, account, erro, cancelHref }: { clientId: number; account?: Account; erro?: string; cancelHref: string }) {
  return (
    <form id={`conta-${account?.id ?? "nova"}`} action={saveAccount} className={`flex flex-col gap-4 ${INLINE_FORM}`}>
      <input type="hidden" name="clientId" value={clientId} />
      {account && <input type="hidden" name="id" value={account.id} />}
      <h3 className={CARD_TITLE}>{account ? "Editar conta" : "Nova conta"}</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field prefix="account-" label="Serviço" name="service" required placeholder="Domínio (Registro.br)" defaultValue={account?.service} maxLength={ACCOUNT_LIMITS.service} />
        <Select
          prefix="account-"
          label="Dono da conta"
          name="owner"
          defaultValue={account?.owner ?? "client"}
          options={OWNERS.map((owner) => ({ value: owner, label: OWNER_LABEL[owner] }))}
        />
        <Field prefix="account-" label="Link do painel" name="url" placeholder="registro.br" defaultValue={account?.url ?? ""} maxLength={ACCOUNT_LIMITS.url} />
        <Field prefix="account-" label="Login — e-mail ou usuário, senha não" name="login" defaultValue={account?.login ?? ""} maxLength={ACCOUNT_LIMITS.login} />
        <Field prefix="account-" label="Seu acesso" name="access" placeholder="Admin pelo meu Gmail" defaultValue={account?.access ?? ""} maxLength={ACCOUNT_LIMITS.access} />
        <Field prefix="account-" label="Renova em" name="expiresOn" type="date" defaultValue={account?.expiresOn ?? ""} />
      </div>
      <TextArea prefix="account-" label="Anotações — senha não" name="notes" rows={2} defaultValue={account?.notes ?? ""} maxLength={ACCOUNT_LIMITS.notes} />

      <FormError message={erro} />

      <div className="flex flex-wrap gap-2">
        <SubmitButton className={BUTTON_SOLID} icon="check">
          Salvar
        </SubmitButton>
        <Link href={cancelHref} scroll={false} className={BUTTON}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function AccountCard({ account, page, excluir, feito, today }: { account: Account; page: string; excluir?: string; feito?: string; today: string }) {
  const anchor = `conta-${account.id}`;
  const Icon = KIND_ICON[serviceKind(account.service)];
  const renews = account.expiresOn ? renewal(account.expiresOn, today) : null;

  return (
    <li id={anchor} className={`flex flex-col gap-3 text-ui ${ITEM_CARD} ${flash(feito === anchor)}`}>
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink/[0.06] text-ink/70" aria-hidden>
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="break-words font-semibold leading-snug">{account.service}</h3>
          {account.access && <p className="text-meta text-ink/60">{account.access}</p>}
        </div>
        {excluir !== anchor && (
          <span className="-mr-2 -mt-1 flex shrink-0">
            <IconLink href={`${page}?conta=${account.id}`} label="Editar conta" icon={Pencil} />
            <IconLink href={`${page}?excluir=${anchor}`} label="Tirar da lista" icon={Trash2} danger />
          </span>
        )}
      </div>

      {account.login && (
        <div className="flex items-center gap-2 rounded-md bg-ink/[0.04] py-0.5 pl-2.5">
          <UserRound className="h-3.5 w-3.5 shrink-0 text-ink/45" strokeWidth={2.25} aria-hidden />
          <span className="sr-only">Login:</span>
          <span className="min-w-0 flex-1 truncate font-mono text-meta" title={account.login}>
            {account.login}
          </span>
          <CopyButton value={account.login} label="Copiar login" />
        </div>
      )}

      {account.notes && <p className="whitespace-pre-line text-meta leading-relaxed text-ink/60">{account.notes}</p>}

      {/* o pé do cartão: quando renova e o atalho pro painel; `mt-auto` alinha os pés na grade */}
      {(renews || account.url) && (
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-ink/10 pt-3 text-meta">
          {renews && account.expiresOn ? (
            <span className={`font-semibold ${RENEWAL_TONE[renews.tone]}`}>
              {renews.text}
              <span className={`font-normal text-ink/45 ${NUM}`}> · {br(account.expiresOn)}</span>
            </span>
          ) : (
            <span />
          )}
          {account.url && (
            <a
              href={siteHref(account.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-ink underline-offset-4 hover:text-accent hover:underline"
            >
              Abrir painel
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
            </a>
          )}
        </div>
      )}

      {excluir === anchor && <DeleteConfirm action={removeAccount} fields={{ clientId: account.clientId, id: account.id }} message="Tira da lista." cancelHref={page} />}
    </li>
  );
}

type GridProps = { accounts: Account[]; clientId: number; page: string; open?: string; excluir?: string; erro?: string; feito?: string; today: string };

function AccountGrid({ accounts, clientId, page, open, excluir, erro, feito, today }: GridProps) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {accounts.map((account) =>
        open === String(account.id) ? (
          /* o formulário ocupa a linha toda da grade, no lugar do cartão */
          <li key={account.id} className="sm:col-span-2">
            <AccountForm clientId={clientId} account={account} erro={erro} cancelHref={page} />
          </li>
        ) : (
          <AccountCard key={account.id} account={account} page={page} excluir={excluir} feito={feito} today={today} />
        ),
      )}
    </ul>
  );
}

export function AccountSection({
  clientId,
  accounts,
  open,
  excluir,
  erro,
  feito,
  forceOpen,
}: {
  clientId: number;
  accounts: Account[];
  /** `?conta=`: "nova" ou o id em edição */
  open?: string;
  excluir?: string;
  erro?: string;
  /** `?feito=`: o item que a última ação mexeu, que pisca ao chegar */
  feito?: string;
  /** a URL aponta pra dentro do bloco: abre mesmo se estava recolhido */
  forceOpen: boolean;
}) {
  const page = `/admin/clientes/${clientId}`;
  const today = todayInBrazil();
  /* a consulta já entrega no seu nome primeiro e, em cada grupo, a renovação mais próxima */
  const mine = accounts.filter((account) => account.owner === "me");
  const theirs = accounts.filter((account) => account.owner === "client");
  const renewingSoon = accounts.filter((account) => account.expiresOn && renewal(account.expiresOn, today).tone !== "ok").length;
  const grid = { clientId, page, open, excluir, erro, feito, today };

  return (
    <CollapsibleCard
      id="contas"
      icon={<KeyRound className="h-4 w-4" strokeWidth={2.25} />}
      title="Contas e acessos"
      count={accounts.length}
      summary={[mine.length > 0 && `${mine.length} no seu nome`, renewingSoon > 0 && `${renewingSoon} renova${renewingSoon === 1 ? "" : "m"} em breve`]
        .filter(Boolean)
        .join(" · ")}
      forceOpen={forceOpen}
    >
      {accounts.length === 0 && open !== "nova" && (
        <p className="text-ui leading-relaxed text-ink/60">Domínio, hospedagem, Google Analytics… quem é o dono, onde se entra e qual acesso você tem.</p>
      )}

      {mine.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className={`${GROUP_TITLE} text-accent`}>No seu nome — transferir quando o cliente sair</p>
          <AccountGrid accounts={mine} {...grid} />
        </div>
      )}

      {theirs.length > 0 && (
        <div className="flex flex-col gap-3">
          {/* com um grupo só, o título dele não diz nada */}
          {mine.length > 0 && <p className={`${GROUP_TITLE} text-ink/55`}>Do cliente</p>}
          <AccountGrid accounts={theirs} {...grid} />
        </div>
      )}

      {/* adicionar fica no fim, onde a conta nova vai entrar; o formulário abre no lugar da faixa */}
      {open === "nova" ? <AccountForm clientId={clientId} erro={erro} cancelHref={page} /> : <AddRow href={`${page}?conta=nova`}>Nova conta</AddRow>}
    </CollapsibleCard>
  );
}
