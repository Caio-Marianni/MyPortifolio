/* caminho relativo com extensão: o `npm run check` roda isto no node puro */
import { TODAY, db } from "./db.ts";
import { field, oneOf, optionalDate, tooLong } from "./form-input.ts";

/* Contas e acessos do cliente: domínio, hospedagem, Google Analytics… Quem é o dono e qual acesso
   você tem — nunca a senha. A conta é do cliente desde o primeiro dia; o que estiver no seu nome
   aparece marcado, porque é o que precisa ser transferido quando ele sair. */

export type Owner = "client" | "me";
export const OWNERS: Owner[] = ["client", "me"];
export const OWNER_LABEL: Record<Owner, string> = { client: "Do cliente", me: "No seu nome" };

export const ACCOUNT_LIMITS = { service: 120, access: 200, notes: 1000 } as const;

export interface AccountFields {
  service: string;
  owner: Owner;
  access: string | null;
  /** "YYYY-MM-DD" — renovação de domínio ou hospedagem */
  expiresOn: string | null;
  notes: string | null;
}

export interface Account extends AccountFields {
  id: number;
  clientId: number;
  /** vence nos próximos 30 dias, ou já venceu */
  expiringSoon: boolean;
}

export function readAccount(form: FormData): { fields: AccountFields } | { error: string } {
  const values = { service: field(form, "service"), access: field(form, "access"), notes: field(form, "notes") };
  const owner = oneOf(field(form, "owner"), OWNERS);
  const expiresOn = optionalDate(field(form, "expiresOn"));

  if (!values.service) return { error: "Diga qual é o serviço, ex. Domínio (Registro.br)." };
  if (tooLong(values, ACCOUNT_LIMITS)) return { error: "Algum campo passou do tamanho." };
  if (!owner) return { error: "Dono inválido." };
  if (expiresOn === undefined) return { error: "Data de vencimento inválida." };

  return {
    fields: { service: values.service, owner, access: values.access || null, expiresOn, notes: values.notes || null },
  };
}

export async function listAccounts(clientId: number): Promise<Account[]> {
  return (await db().query(
    `select id, client_id as "clientId", service, owner, access, notes,
            to_char(expires_on, 'YYYY-MM-DD') as "expiresOn",
            coalesce(expires_on <= ${TODAY} + 30, false) as "expiringSoon"
     from client_accounts
     where client_id = $1
     order by service`,
    [clientId],
  )) as Account[];
}

export async function createAccount(clientId: number, a: AccountFields): Promise<void> {
  await db()`
    insert into client_accounts (client_id, service, owner, access, expires_on, notes)
    values (${clientId}, ${a.service}, ${a.owner}, ${a.access}, ${a.expiresOn}, ${a.notes})
  `;
}

export async function updateAccount(id: number, a: AccountFields): Promise<void> {
  await db()`
    update client_accounts set
      service = ${a.service}, owner = ${a.owner}, access = ${a.access}, expires_on = ${a.expiresOn}, notes = ${a.notes}
    where id = ${id}
  `;
}

export async function deleteAccount(id: number): Promise<void> {
  await db()`delete from client_accounts where id = ${id}`;
}
