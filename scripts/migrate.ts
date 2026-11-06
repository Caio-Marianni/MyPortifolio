/* Aplica as migrações de sql/migrations que este banco ainda não viu, na ordem do nome. Cada
   arquivo roda numa transação junto com o registro dele em `schema_migrations`: ou entra
   inteiro e fica anotado, ou não entra nada. Repetir é barato — o que já rodou é pulado.

   `npm run migrate` usa o DATABASE_URL do .env.local. Rodar ANTES do push que depende da
   migração: foi esquecer isso que tirou as avaliações do ar em 2026-10. */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../src/services/db.ts";

export const DIR = fileURLToPath(new URL("../sql/migrations/", import.meta.url));

/** Instruções de um arquivo .sql. Quebra de linha do Windows (CRLF) incluída: sem o `\r?`, o
    comentário no fim da linha não saía e a instrução chegava quebrada ao banco.

    ponytail: corta em `;` depois de tirar os `--`. Vale enquanto nenhuma migração tiver `;` ou
    `--` dentro de string ou de função; quando tiver, uma instrução por arquivo resolve. */
export function statements(source: string): string[] {
  return source
    .split(/\r?\n/)
    .map((line) => line.replace(/--.*/, ""))
    .join("\n")
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);
}

async function main() {
  const sql = db();
  await sql`create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())`;

  const done = new Set(((await sql`select name from schema_migrations`) as { name: string }[]).map((row) => row.name));
  const pending = readdirSync(DIR)
    .filter((file) => file.endsWith(".sql") && !done.has(file))
    .sort();

  for (const file of pending) {
    const queries = statements(readFileSync(join(DIR, file), "utf8")).map((statement) => sql.query(statement));
    await sql.transaction([...queries, sql`insert into schema_migrations (name) values (${file})`]);
    console.log(`migrate: ${file} aplicada`);
  }

  console.log(pending.length ? `migrate: ${pending.length} aplicada(s)` : "migrate: banco em dia");
}

/* só roda quando chamado direto — o check importa `statements` sem tocar no banco */
if (import.meta.main) {
  main().catch((error) => {
    console.error("migrate: falhou, nada desta migração entrou —", error);
    process.exit(1);
  });
}
