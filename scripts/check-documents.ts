/* Checagem do preenchimento e da formatação dos documentos — sem banco: `node
   scripts/check-documents.ts` passa calado ou joga. */

import assert from "node:assert/strict";
import { documentValues, fillTemplate, parseBlocks, pendingFields, splitBold, splitFields } from "../src/services/documents.ts";
import { STARTERS } from "../src/data/document-starters.ts";
import type { Client } from "../src/services/clients.ts";
import type { Payment } from "../src/services/payments.ts";
import type { Plan } from "../src/services/plans.ts";
import type { Project } from "../src/services/projects.ts";

const client: Client = {
  id: 1,
  name: "Rio Plus Transfer",
  document: "12.345.678/0001-95",
  whatsapp: "5562999998888",
  email: null,
  address: null,
  site: "rioplus.com.br",
  notes: null,
};

const project: Project = {
  id: 3,
  clientId: 1,
  title: "Site institucional",
  scope: "Home, frota e contato",
  total: 300000,
  deadline: "2026-12-15",
  status: "approved",
  notes: null,
  paid: 0,
  scheduled: 300000,
  overdue: false,
};

const installment = (id: number, amount: number, dueOn: string, description: string | null): Payment => ({
  id,
  planId: null,
  projectId: 3,
  description,
  amount,
  dueOn,
  paidOn: null,
  overdue: false,
});

const values = documentValues({
  client,
  project,
  installments: [installment(1, 150000, "2026-11-05", "Entrada"), installment(2, 150000, "2026-12-15", null)],
  today: "2026-10-29",
});

assert.equal(values.cliente, "Rio Plus Transfer");
assert.equal(values.valor, "R$ 3.000,00", "o Intl separa o R$ com espaço não separável");
assert.equal(values.prazo, "15 de dezembro de 2026");
assert.equal(values.data, "29 de outubro de 2026");
assert.equal(values.whatsapp, "+55 62 99999-8888");
assert.equal(values.parcelas, "- R$ 1.500,00 (Entrada), com vencimento em 05/11/2026\n- R$ 1.500,00, com vencimento em 15/12/2026");
assert.equal(values.endereco, undefined, "campo vazio fica de fora");

// campo sem valor fica à vista, entre chaves; campo desconhecido também
assert.equal(fillTemplate("{cliente}, {endereco} e {nada}", values), "Rio Plus Transfer, {endereco} e {nada}");

// o que sobrou entre chaves é o aviso do rascunho: cada campo uma vez, na ordem do texto
assert.deepEqual(pendingFields("{endereco}, {nada} e {endereco} de novo; {Maiuscula} não é campo"), ["endereco", "nada"]);
assert.deepEqual(pendingFields("tudo preenchido"), []);
assert.deepEqual(splitFields("de {cliente}, ok"), [
  { text: "de ", field: false },
  { text: "{cliente}", field: true },
  { text: ", ok", field: false },
]);

const plan: Plan = {
  id: 2,
  clientId: 1,
  name: "Manutenção + relatório",
  monthlyFee: 35000,
  firstDue: "2026-11-10",
  status: "active",
  includes: null,
  reports: true,
  gaProperty: null,
  nextDue: "2026-11-10",
  overdue: false,
  overdueAmount: 0,
};
const planValues = documentValues({ client, plan, today: "2026-10-29" });
assert.equal(planValues.vencimento, "todo dia 10 de cada mês");
assert.equal(planValues.inicio, "10 de novembro de 2026");
assert.equal(planValues.parcelas, undefined, "sem parcela, o campo some da lista");

// blocos: título, seção, parágrafo de várias linhas, lista que fecha no parágrafo seguinte
assert.deepEqual(parseBlocks("# Título\n\n## Seção\nlinha um\nlinha dois\n\n- a\n- b\ndepois\n- c"), [
  { type: "h1", text: "Título" },
  { type: "h2", text: "Seção" },
  { type: "p", text: "linha um\nlinha dois" },
  { type: "ul", items: ["a", "b"] },
  { type: "p", text: "depois" },
  { type: "ul", items: ["c"] },
]);
assert.deepEqual(parseBlocks("\r\n\r\n"), [], "só quebra de linha do Windows não vira bloco");

assert.deepEqual(splitBold("valor **R$ 10** por mês"), [
  { text: "valor ", bold: false },
  { text: "R$ 10", bold: true },
  { text: " por mês", bold: false },
]);

// as parcelas preenchidas numa linha sozinha do modelo viram lista no documento
const filled = fillTemplate(STARTERS["contrato-projeto"].body, values);
assert.ok(parseBlocks(filled).some((block) => block.type === "ul" && block.items[0].startsWith("R$")));
assert.ok(filled.includes("{endereco}"), "o endereço que falta fica marcado pra você completar");

console.log("documentos: ok");
