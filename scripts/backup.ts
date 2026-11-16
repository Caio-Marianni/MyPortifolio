/* Cópia do banco inteiro num JSON: toda tabela, toda linha. `npm run backup` grava em
   ~/backups/painel; `npm run backup -- <pasta>` grava em outra (a pasta do Drive, por exemplo).

   Nunca dentro do repositório: ele é público e o arquivo tem dados de cliente e contratos — o
   script recusa. Rode uma vez por mês (o lembrete do dia 1 avisa).

   ponytail: só exporta. Restaurar é à mão (insert a partir do JSON), como foi a cópia de região
   em 2026-11; um `restore` quando precisar restaurar mais de uma vez. */

import { mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../src/services/db.ts";
import { todayInBrazil } from "../src/services/dates.ts";

const REPO = fileURLToPath(new URL("..", import.meta.url));

/** A pasta fica dentro do repositório? (`relative` sem `..` na frente = está dentro.) */
export function insideRepo(dir: string): boolean {
  const path = relative(REPO, resolve(dir));
  return !path.startsWith("..") && !isAbsolute(path);
}

async function main() {
  const dir = resolve(process.argv[2] ?? join(homedir(), "backups", "painel"));
  if (insideRepo(dir)) throw new Error(`${dir} fica dentro do repositório, que é público. Escolha uma pasta fora dele.`);

  const sql = db();
  const tables = (await sql`
    select table_name as name from information_schema.tables
    where table_schema = 'public' and table_type = 'BASE TABLE'
    order by table_name
  `) as { name: string }[];

  /* nome de tabela vem do próprio banco, não de entrada de usuário */
  const dump: Record<string, unknown[]> = {};
  for (const { name } of tables) dump[name] = await sql.query(`select * from "${name}" order by 1`);

  mkdirSync(dir, { recursive: true });
  const file = join(dir, `painel-${todayInBrazil()}.json`);
  writeFileSync(file, JSON.stringify(dump, null, 2));
  const rows = Object.values(dump).reduce((total, list) => total + list.length, 0);
  console.log(`backup: ${tables.length} tabelas, ${rows} linhas → ${file}`);
}

if (import.meta.main) {
  main().catch((error) => {
    console.error("backup: falhou —", error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
