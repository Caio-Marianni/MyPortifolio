import { db } from "@/services/db";

/* Mensagens do formulário de contato. O IP entra só pro limite de envio — a rota é pública e
   sem convite, então é ele que segura quem resolve encher a caixa. */

/** Mensagens do mesmo IP antes de recusar, e em quantos minutos elas contam. */
export const MAX_MESSAGES = 3;
export const MESSAGE_WINDOW_MINUTES = 60;

export interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  /** já formatada no `select`, pelo mesmo motivo do painel de avaliações: nada de Intl no cliente */
  createdAt: string;
  /** respondida sai da caixa de entrada mas fica no histórico */
  answered: boolean;
}

/* O intervalo entra concatenado e convertido pelo mesmo motivo de services/admin.ts: o driver
   manda o interpolado como parâmetro, e parâmetro não cabe dentro de um literal de intervalo. */
export async function tooManyMessages(ip: string): Promise<boolean> {
  const [row] = (await db()`
    select count(*)::int as sent
    from messages
    where ip = ${ip} and created_at > now() - (${MESSAGE_WINDOW_MINUTES} || ' minutes')::interval
  `) as { sent: number }[];
  return row.sent >= MAX_MESSAGES;
}

export async function createMessage(message: { name: string; email: string; message: string; ip: string }): Promise<void> {
  await db()`
    insert into messages (name, email, message, ip)
    values (${message.name}, ${message.email}, ${message.message}, ${message.ip})
  `;
}

export async function listMessages(): Promise<Message[]> {
  return (await db().query(`
    select id, name, email, message, to_char(created_at, 'DD/MM/YYYY HH24:MI') as "createdAt",
           answered_at is not null as answered
    from messages
    order by (answered_at is null) desc, created_at desc
  `)) as Message[];
}

export async function setAnswered(id: number, answered: boolean): Promise<void> {
  await db()`update messages set answered_at = case when ${answered}::boolean then now() end where id = ${id}`;
}

export async function deleteMessage(id: number): Promise<void> {
  await db()`delete from messages where id = ${id}`;
}
