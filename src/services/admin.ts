import { createHmac, timingSafeEqual } from "node:crypto";
/* caminho relativo com extensão: o `npm run check` roda este arquivo no node puro, que não
   conhece o alias `@/` — o webpack do Next resolve os dois jeitos. */
import { db } from "./db.ts";

/* Tranca do painel. Sem `next/headers` aqui de propósito: assim isto é função pura testável
   por `npm run check`, e o cookie em si — que só existe dentro de uma requisição — fica na
   action e na page, que já vivem no framework.

   Uma pessoa só e uma senha só: NextAuth aqui seria mais configuração que produto. */

export const COOKIE = "admin";
export const MAX_AGE = 60 * 60 * 24 * 30;

/** Raiz, e não `/admin`: a foto de avaliação pendente sai por /api/reviews/[id]/image, e o
    navegador só manda o cookie pra caminho que casa com este. Preso no painel, a rota nunca
    via a sessão e devolvia 404 em tudo que ainda não estava publicado. */
export const COOKIE_PATH = "/";

/** Tentativas erradas do mesmo IP antes de fechar a porta, e por quanto tempo ela fica fechada. */
export const MAX_TRIES = 5;
export const WINDOW_MINUTES = 15;

const digest = (value: string) => createHmac("sha256", process.env.REVIEW_SECRET ?? "").update(value).digest();

/** Compara pelo digest: entradas de tamanhos diferentes viram buffers do mesmo tamanho, que é
    o que o timingSafeEqual exige, e o tamanho da senha não vaza pelo tempo de resposta. */
function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !process.env.REVIEW_SECRET) {
    console.error("[admin] ADMIN_PASSWORD ou REVIEW_SECRET não definido — painel fechado");
    return false;
  }
  return timingSafeEqual(digest(input), digest(expected));
}

/** O campo de usuário é isca: existe na tela, mas só entra quem o deixa vazio. É obscuridade,
    não criptografia — quem segura a porta é a senha mais o limite de tentativas. O que ela
    resolve bem é robô de formulário, que preenche tudo que encontra. */
export function credentialsOk(user: string, password: string): boolean {
  if (user !== "") return false;
  return checkPassword(password);
}

/* Sessão: o cookie guarda o vencimento e a assinatura dele. Nada de identidade — se a
   assinatura fecha e a data não passou, é você. Trocar REVIEW_SECRET derruba a sessão junto
   com os links de convite, que é o comportamento certo pra um segredo vazado. */

const sign = (value: string) => digest(value).toString("hex").slice(0, 32);

export function newSession(): string {
  const expires = Date.now() + MAX_AGE * 1000;
  return `${expires}.${sign(String(expires))}`;
}

export function validSession(cookie: string | undefined): boolean {
  if (!cookie || !process.env.REVIEW_SECRET) return false;

  const [expires, signature] = cookie.split(".");
  if (!expires || !signature || !Number(expires) || Number(expires) < Date.now()) return false;

  const expected = sign(expires);
  if (signature.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

/* Limite de tentativas no banco, não em memória: função serverless recicla e escala, então um
   contador em RAM zera na hora errada — justo quando alguém está insistindo. O Postgres já
   está aqui, é a contagem mais barata que existe.

   ponytail: sem índice na tabela. A limpeza a cada falha mantém ela na casa das dezenas de
   linhas; criar índice quando (e se) isso deixar de ser verdade. */

/* O intervalo entra concatenado e convertido porque o driver manda todo interpolado como
   parâmetro, e parâmetro não cabe dentro da sintaxe de um literal de intervalo. */
export async function tooManyTries(ip: string): Promise<boolean> {
  const [row] = (await db()`
    select count(*)::int as tries
    from login_attempts
    where ip = ${ip} and at > now() - (${WINDOW_MINUTES} || ' minutes')::interval
  `) as { tries: number }[];

  return row.tries >= MAX_TRIES;
}

export async function registerFailure(ip: string): Promise<void> {
  await db()`insert into login_attempts (ip) values (${ip})`;
  await db()`delete from login_attempts where at < now() - interval '1 day'`;
}

/** Acertou: a fila daquele IP zera, senão cinco erros de digitação te trancariam do painel. */
export async function clearFailures(ip: string): Promise<void> {
  await db()`delete from login_attempts where ip = ${ip}`;
}
