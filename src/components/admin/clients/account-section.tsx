import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { ArrowUpRightIcon, AtIcon, CalendarDotsIcon, ChartLineUpIcon, EnvelopeSimpleIcon, GlobeIcon, HardDrivesIcon, KeyIcon, LinkSimpleIcon, MagnifyingGlassIcon, NoteIcon, PencilSimpleIcon, PlusIcon, ShareNetworkIcon, ShieldCheckIcon, TagIcon, TrashIcon, UserIcon } from "@phosphor-icons/react/ssr";
import { AddRow } from "@/components/admin/add-row";
import { CopyButton } from "@/components/admin/copy-field";
import { Field, FormError, Select, TextArea } from "@/components/admin/fields";
import { FormCard, FormCardDetails } from "@/components/admin/form-card";
import { IconLink } from "@/components/admin/icon-link";
import { ModalActions } from "@/components/admin/modal-actions";
import { SectionCard } from "@/components/admin/section-card";
import { SubmitButton } from "@/components/admin/submit-button";
import { BUTTON_ADD, BUTTON_SOLID, ITEM_CARD, NUM, flash } from "@/components/ui/styles";
import { ACCOUNT_LIMITS, OWNERS, OWNER_LABEL, renewal, serviceKind, type Account, type ServiceKind } from "@/services/accounts";
import { siteHref } from "@/services/clients";
import { br, todayInBrazil } from "@/services/dates";
import { saveAccount } from "@/app/admin/(painel)/clientes/[id]/actions";

/* Contas e acessos: a lista que vira roteiro quando o cliente sai — o que está no seu nome é o
   que precisa ser transferido, e o resto é tirar o seu acesso. Por isso o que está no seu nome
   vem num grupo à parte, em cima. Cada conta é um cartão: o que é, onde se entra, com qual login
   e quando renova. Criar, editar e tirar da lista abrem em janela (ClientModals, pela URL). */

const KIND_ICON: Record<ServiceKind, PhosphorIcon> = {
  domain: GlobeIcon,
  hosting: HardDrivesIcon,
  analytics: ChartLineUpIcon,
  search: MagnifyingGlassIcon,
  email: EnvelopeSimpleIcon,
  social: ShareNetworkIcon,
  other: KeyIcon,
};

/* vencida em vermelho, até 30 dias em laranja; longe disso, a voz apagada de sempre */
const RENEWAL_TONE = { late: "text-danger", soon: "text-accent", ok: "text-ink/60" };

const GROUP_TITLE = "text-meta font-semibold uppercase tracking-[0.06em]";

/** O formulário da conta, dentro da janela "Nova conta" / "Editar conta". */
export function AccountForm({ clientId, account, erro, cancelHref }: { clientId: number; account?: Account; erro?: string; cancelHref: string }) {
  return (
    <form action={saveAccount} className="flex flex-col gap-4">
      <input type="hidden" name="clientId" value={clientId} />
      {account && <input type="hidden" name="id" value={account.id} />}

      <FormCard icon={KeyIcon} title="Serviço">
        <Field
          className="sm:col-span-2"
          prefix="account-"
          icon={TagIcon}
          label="Serviço"
          name="service"
          required
          autoFocus
          placeholder="Domínio (Registro.br)"
          defaultValue={account?.service}
          maxLength={ACCOUNT_LIMITS.service}
        />
        <Select
          prefix="account-"
          icon={UserIcon}
          label="Dono da conta"
          name="owner"
          defaultValue={account?.owner ?? "client"}
          options={OWNERS.map((owner) => ({ value: owner, label: OWNER_LABEL[owner] }))}
        />
        <Field prefix="account-" icon={CalendarDotsIcon} label="Renova em" name="expiresOn" type="date" defaultValue={account?.expiresOn ?? ""} />
        <Field
          className="sm:col-span-2"
          prefix="account-"
          icon={LinkSimpleIcon}
          label="Link do painel"
          name="url"
          placeholder="registro.br"
          defaultValue={account?.url ?? ""}
          maxLength={ACCOUNT_LIMITS.url}
        />
      </FormCard>

      <FormCard icon={ShieldCheckIcon} title="Acesso" hint="login, nunca senha">
        <Field prefix="account-" icon={AtIcon} label="Login — e-mail ou usuário" name="login" defaultValue={account?.login ?? ""} maxLength={ACCOUNT_LIMITS.login} />
        <Field prefix="account-" icon={ShieldCheckIcon} label="Seu acesso" name="access" placeholder="Admin pelo meu Gmail" defaultValue={account?.access ?? ""} maxLength={ACCOUNT_LIMITS.access} />
      </FormCard>

      <FormCardDetails icon={NoteIcon} title="Anotações" hint="senha não" open={Boolean(account?.notes)}>
        <TextArea prefix="account-" label={<span className="sr-only">Anotações</span>} name="notes" rows={2} defaultValue={account?.notes ?? ""} maxLength={ACCOUNT_LIMITS.notes} />
      </FormCardDetails>

      <FormError message={erro} />

      <ModalActions cancelHref={cancelHref}>
        <SubmitButton className={account ? BUTTON_SOLID : BUTTON_ADD} icon={account ? "check" : "plus"}>
          {account ? "Salvar conta" : "Adicionar conta"}
        </SubmitButton>
      </ModalActions>
    </form>
  );
}

function AccountCard({ account, page, feito, today }: { account: Account; page: string; feito?: string; today: string }) {
  const anchor = `conta-${account.id}`;
  const Icon = KIND_ICON[serviceKind(account.service)];
  const renews = account.expiresOn ? renewal(account.expiresOn, today) : null;

  return (
    <li id={anchor} className={`flex flex-col gap-3 text-ui ${ITEM_CARD} ${flash(feito === anchor)}`}>
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink/[0.06] text-ink/70" aria-hidden>
          <Icon className="h-[18px] w-[18px]" weight="bold" aria-hidden />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="break-words font-semibold leading-snug">{account.service}</h3>
          {account.access && <p className="text-meta text-ink/60">{account.access}</p>}
        </div>
        <span className="-mr-2 -mt-1 flex shrink-0">
          <IconLink href={`${page}?conta=${account.id}`} label="Editar conta" icon={PencilSimpleIcon} />
          <IconLink href={`${page}?excluir=${anchor}`} label="Tirar da lista" icon={TrashIcon} danger />
        </span>
      </div>

      {account.login && (
        <div className="flex items-center gap-2 rounded-md bg-ink/[0.04] py-0.5 pl-2.5">
          <UserIcon className="h-3.5 w-3.5 shrink-0 text-ink/45" aria-hidden weight="bold" />
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
              <ArrowUpRightIcon className="h-3.5 w-3.5" aria-hidden weight="bold" />
            </a>
          )}
        </div>
      )}

    </li>
  );
}

function AccountGrid({ accounts, page, feito, today }: { accounts: Account[]; page: string; feito?: string; today: string }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {accounts.map((account) => (
        <AccountCard key={account.id} account={account} page={page} feito={feito} today={today} />
      ))}
    </ul>
  );
}

export function AccountSection({
  clientId,
  accounts,
  feito,
}: {
  clientId: number;
  accounts: Account[];
  /** `?feito=`: o item que a última ação mexeu, que pisca ao chegar */
  feito?: string;
}) {
  const page = `/admin/clientes/${clientId}`;
  const today = todayInBrazil();
  /* a consulta já entrega no seu nome primeiro e, em cada grupo, a renovação mais próxima */
  const mine = accounts.filter((account) => account.owner === "me");
  const theirs = accounts.filter((account) => account.owner === "client");
  const renewingSoon = accounts.filter((account) => account.expiresOn && renewal(account.expiresOn, today).tone !== "ok").length;
  const grid = { page, feito, today };

  return (
    <SectionCard
      id="contas"
      icon={<KeyIcon className="h-4 w-4" weight="bold" aria-hidden />}
      title="Contas e acessos"
      count={accounts.length}
      summary={[mine.length > 0 && `${mine.length} no seu nome`, renewingSoon > 0 && `${renewingSoon} renova${renewingSoon === 1 ? "" : "m"} em breve`]
        .filter(Boolean)
        .join(" · ")}
      action={accounts.length > 0 && <IconLink href={`${page}?conta=nova`} label="Nova conta" icon={PlusIcon} />}
    >
      {accounts.length === 0 && (
        <>
          <p className="text-ui leading-relaxed text-ink/60">Domínio, hospedagem, Google Analytics… quem é o dono, onde se entra e qual acesso você tem.</p>
          <AddRow href={`${page}?conta=nova`}>Nova conta</AddRow>
        </>
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
    </SectionCard>
  );
}
