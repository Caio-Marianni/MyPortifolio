import { CHECKLIST_IDS } from "../data/client-checklist.ts";
import { db } from "./db.ts";

/** Passos marcados de um cliente: id do passo → dia em que foi feito (AAAA-MM-DD, horário daqui). */
export async function listChecklist(clientId: number): Promise<Record<string, string>> {
  const rows = (await db()`
    select item, to_char(done_at at time zone 'America/Sao_Paulo', 'YYYY-MM-DD') as day
    from client_checklist where client_id = ${clientId}
  `) as { item: string; day: string }[];
  return Object.fromEntries(rows.map((row) => [row.item, row.day]));
}

/** Marca ou desmarca. Passo fora do roteiro é recusado: o id vem de um formulário. */
export async function setChecklistItem(clientId: number, item: string, done: boolean): Promise<boolean> {
  if (!CHECKLIST_IDS.has(item)) return false;
  const sql = db();
  if (done) {
    await sql`insert into client_checklist (client_id, item) values (${clientId}, ${item}) on conflict do nothing`;
  } else {
    await sql`delete from client_checklist where client_id = ${clientId} and item = ${item}`;
  }
  return true;
}
