/* Checagem do leitor de migrações — sem banco: `node scripts/check-migrate.ts` passa calado ou joga. */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { DIR, statements } from "./migrate.ts";

// CRLF: o comentário no fim da linha sai, e o `;` dentro dele não vira instrução
assert.deepEqual(statements("create table a (x int); -- nota; com ponto e vírgula\r\nalter table a add y int;\r\n"), [
  "create table a (x int)",
  "alter table a add y int",
]);
assert.deepEqual(statements("-- só comentário\n\n"), [], "arquivo sem instrução não manda nada ao banco");

// toda migração de verdade vira instruções que o Postgres reconhece, sem resto de comentário
const files = readdirSync(DIR).filter((file) => file.endsWith(".sql"));
assert.ok(files.length > 0);
for (const file of files) {
  for (const statement of statements(readFileSync(join(DIR, file), "utf8"))) {
    assert.match(statement, /^(create|alter)\s/i, `${file}: instrução inesperada — ${statement.slice(0, 40)}`);
  }
}

console.log("migracoes: ok");
