import { neon } from "@neondatabase/serverless";

/* Acesso ao Neon pelo driver HTTP: uma requisição por query, sem pool para a função serverless
   segurar entre invocações. Cliente criado na hora da chamada, não no topo do módulo — assim
   o build não quebra em ambiente sem DATABASE_URL. */
export function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definido");
  return neon(url);
}

/** "Hoje" em Goiânia, não em UTC, pra entrar nas consultas: o Neon roda em UTC, e às 21h daqui
    ele já estaria no dia seguinte — o cliente viraria atrasado três horas antes da hora. */
export const TODAY = "(now() at time zone 'America/Sao_Paulo')::date";

/** Violação de chave estrangeira: o registro tem dependente que não pode sumir junto. */
export const isForeignKeyError = (error: unknown): boolean =>
  typeof error === "object" && error !== null && (error as { code?: unknown }).code === "23503";
