import { neon } from "@neondatabase/serverless";

/* Acesso ao Neon pelo driver HTTP: uma requisição por query, sem pool para a função serverless
   segurar entre invocações. Cliente criado na hora da chamada, não no topo do módulo — assim
   o build não quebra em ambiente sem DATABASE_URL. */
export function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definido");
  return neon(url);
}
