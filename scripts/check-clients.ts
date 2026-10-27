/* Checagem da leitura do formulário de clientes — o valor em reais é a conta que dá pra errar
   calado. Sem framework: `node scripts/check-clients.ts` passa calado ou joga. */

import assert from "node:assert/strict";
import { parseMoney, readClient } from "../src/services/clients.ts";

// dinheiro: jeito brasileiro, com e sem milhar; vazio é "sem plano", torto é erro e não zero
assert.equal(parseMoney("1.500,00"), 150000);
assert.equal(parseMoney("1500"), 150000);
assert.equal(parseMoney("150,5"), 15050, "um dígito de centavo é dezena, não unidade");
assert.equal(parseMoney("R$ 99,90"), 9990);
assert.equal(parseMoney(""), 0);
assert.equal(parseMoney("1500.00"), null, "ponto decimal americano é ambíguo com milhar");
assert.equal(parseMoney("-10"), null);
assert.equal(parseMoney("abc"), null);
assert.equal(parseMoney("1.000.000,00"), null, "acima do teto");

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
};

const ok = readClient(form({ name: " Loja X ", track: "web", fee: "150,00", paidUntil: "2026-11-10", domainUntil: "" }));
assert.ok("fields" in ok);
assert.equal(ok.fields.name, "Loja X");
assert.equal(ok.fields.monthlyFee, 15000);
assert.equal(ok.fields.paidUntil, "2026-11-10", "data no futuro vale: pago até e domínio moram lá");
assert.equal(ok.fields.domainUntil, null);
assert.equal(ok.fields.site, null, "campo vazio vira null, não string vazia");

assert.ok("error" in readClient(form({ name: "", track: "web" })), "nome vazio");
assert.ok("error" in readClient(form({ name: "Loja", track: "outro" })), "trilha inválida");
assert.ok("error" in readClient(form({ name: "Loja", track: "web", paidUntil: "2026-02-31" })), "dia que não existe");
assert.ok("error" in readClient(form({ name: "Loja", track: "web", fee: "1500.00" })), "valor fora do formato");

console.log("clientes: ok");
