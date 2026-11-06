import Link from "next/link";
import { Badge } from "@/components/admin/badge";
import { DeleteConfirm } from "@/components/admin/delete-confirm";
import { Field, FormError, Select, TextArea } from "@/components/admin/fields";
import { BUTTON, BUTTON_SOLID, CARD, CARD_TITLE, NUM } from "@/components/admin/styles";
import { ACCOUNT_LIMITS, OWNERS, OWNER_LABEL, type Account } from "@/services/accounts";
import { br } from "@/services/dates";
import { removeAccount, saveAccount } from "@/app/admin/(painel)/clientes/[id]/actions";

/* Contas e acessos: a lista que vira roteiro quando o cliente sai — o que está no seu nome é o
   que precisa ser transferido, e o resto é tirar o seu acesso. */

function AccountForm({ clientId, account, erro, cancelHref }: { clientId: number; account?: Account; erro?: string; cancelHref: string }) {
  return (
    <form action={saveAccount} className="flex flex-col gap-4 border border-ink/15 p-4">
      <input type="hidden" name="clientId" value={clientId} />
      {account && <input type="hidden" name="id" value={account.id} />}

      <Field prefix="account-" label="Serviço" name="service" required placeholder="Domínio (Registro.br)" defaultValue={account?.service} maxLength={ACCOUNT_LIMITS.service} />
      <Select
        prefix="account-"
        label="Dono da conta"
        name="owner"
        defaultValue={account?.owner ?? "client"}
        options={OWNERS.map((owner) => ({ value: owner, label: OWNER_LABEL[owner] }))}
      />
      <Field prefix="account-" label="Seu acesso" name="access" placeholder="Admin pelo meu Gmail" defaultValue={account?.access ?? ""} maxLength={ACCOUNT_LIMITS.access} />
      <Field prefix="account-" label="Renova em" name="expiresOn" type="date" defaultValue={account?.expiresOn ?? ""} />
      <TextArea prefix="account-" label="Anotações — senha não" name="notes" rows={2} defaultValue={account?.notes ?? ""} maxLength={ACCOUNT_LIMITS.notes} />

      <FormError message={erro} />

      <div className="flex flex-wrap gap-2">
        <button type="submit" className={BUTTON_SOLID}>
          Salvar
        </button>
        <Link href={cancelHref} className={BUTTON}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}

export function AccountSection({
  clientId,
  accounts,
  open,
  excluir,
  erro,
}: {
  clientId: number;
  accounts: Account[];
  /** `?conta=`: "nova" ou o id em edição */
  open?: string;
  excluir?: string;
  erro?: string;
}) {
  const page = `/admin/clientes/${clientId}`;

  return (
    <section className={`${CARD} flex flex-col gap-4`}>
      <header className="flex items-center justify-between gap-3">
        <h2 className={CARD_TITLE}>Contas e acessos</h2>
        {open !== "nova" && (
          <Link href={`${page}?conta=nova`} className={BUTTON}>
            Adicionar
          </Link>
        )}
      </header>

      {open === "nova" && <AccountForm clientId={clientId} erro={erro} cancelHref={page} />}

      {accounts.length === 0 && open !== "nova" && (
        <p className="text-[13.5px] leading-relaxed text-ink/60">Domínio, hospedagem, Google Analytics… quem é o dono e qual acesso você tem.</p>
      )}

      <ul className="divide-y divide-ink/10">
        {accounts.map((account) =>
          open === String(account.id) ? (
            <li key={account.id} className="py-3">
              <AccountForm clientId={clientId} account={account} erro={erro} cancelHref={page} />
            </li>
          ) : (
            <li key={account.id} className="flex flex-col gap-1.5 py-3 text-[13.5px]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{account.service}</span>
                <Badge tone={account.owner === "me" ? "accent" : "neutral"}>{OWNER_LABEL[account.owner]}</Badge>
              </div>
              {account.access && <span className="text-ink/70">{account.access}</span>}
              {account.expiresOn && (
                <span className={`${NUM} ${account.expiringSoon ? "font-semibold text-danger" : "text-ink/60"}`}>renova em {br(account.expiresOn)}</span>
              )}
              {account.notes && <span className="whitespace-pre-line text-ink/60">{account.notes}</span>}
              {excluir === `conta-${account.id}` ? (
                <DeleteConfirm action={removeAccount} fields={{ clientId, id: account.id }} message="Tira da lista." cancelHref={page} />
              ) : (
                <span className="flex gap-4 text-[12.5px] text-ink/50">
                  <Link href={`${page}?conta=${account.id}`} className="hover:text-ink">
                    editar
                  </Link>
                  <Link href={`${page}?excluir=conta-${account.id}`} className="hover:text-danger">
                    excluir
                  </Link>
                </span>
              )}
            </li>
          ),
        )}
      </ul>
    </section>
  );
}
