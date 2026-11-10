/* Checagem da leitura dos formulários de clientes, planos e projetos — dinheiro, documento e data
   são as contas que dá pra errar calado. Sem framework: `node scripts/check-clients.ts` passa
   calado ou joga. */

import assert from "node:assert/strict";
import { formatDocument, formatWhatsapp, readClient, whatsappDigits } from "../src/services/clients.ts";
import { longDate, monthLabel, monthRange, previousMonth, todayInBrazil } from "../src/services/dates.ts";
import { moneyField, parseMoney } from "../src/services/money.ts";
import { clientMoney, readInstallment, receivedByMonth, type Payment } from "../src/services/payments.ts";
import { readAccount, renewal, serviceKind } from "../src/services/accounts.ts";
import { readPlan, type Plan } from "../src/services/plans.ts";
import { readProject, type Project } from "../src/services/projects.ts";

// dinheiro: jeito brasileiro, com e sem milhar; vazio é zero, torto é erro e não zero
assert.equal(parseMoney("1.500,00"), 150000);
assert.equal(parseMoney("1500"), 150000);
assert.equal(parseMoney("150,5"), 15050, "um dígito de centavo é dezena, não unidade");
assert.equal(parseMoney("R$ 99,90"), 9990);
assert.equal(parseMoney(""), 0);
assert.equal(parseMoney("1500.00"), null, "ponto decimal americano é ambíguo com milhar");
assert.equal(parseMoney("-10"), null);
assert.equal(parseMoney("abc"), null);
assert.equal(parseMoney("10.000.000,00"), null, "acima do teto");
assert.equal(parseMoney(moneyField(123456)), 123456, "o campo de edição volta ao mesmo valor");

// documento: CPF, CNPJ numérico e o alfanumérico novo; contagem errada é null
assert.equal(formatDocument("12345678901"), "123.456.789-01");
assert.equal(formatDocument("12.345.678/0001-95"), "12.345.678/0001-95");
assert.equal(formatDocument("12abc34501de35"), "12.ABC.345/01DE-35", "CNPJ alfanumérico, em maiúscula");
assert.equal(formatDocument("1234"), null);
assert.equal(formatDocument("12ABC34501DEXY"), null, "os dois últimos do CNPJ são sempre dígitos");

// WhatsApp: com ou sem 55, com máscara; o wa.me quer só dígitos com o país
assert.equal(whatsappDigits("(62) 99999-8888"), "5562999998888");
assert.equal(whatsappDigits("+55 62 99999-8888"), "5562999998888");
assert.equal(whatsappDigits("6233334444"), "556233334444", "fixo com DDD também serve");
assert.equal(whatsappDigits("99999-8888"), null, "sem DDD");
assert.equal(formatWhatsapp("5562999998888"), "+55 62 99999-8888");

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
};

const ok = readClient(form({ name: " Rio Plus ", document: "12345678901", whatsapp: "62 99999-8888", email: "", site: "" }));
assert.ok("fields" in ok);
assert.equal(ok.fields.name, "Rio Plus");
assert.equal(ok.fields.document, "123.456.789-01");
assert.equal(ok.fields.whatsapp, "5562999998888");
assert.equal(ok.fields.site, null, "campo vazio vira null, não string vazia");

assert.ok("error" in readClient(form({ name: "" })), "nome vazio");
assert.ok("error" in readClient(form({ name: "Loja", document: "123" })), "documento torto");
assert.ok("error" in readClient(form({ name: "Loja", email: "loja@" })), "e-mail torto");

// plano: valor obrigatório e dia de vencimento até 28
const plan = readPlan(form({ name: "Manutenção", fee: "350,00", firstDue: "2026-11-10", status: "active", reports: "on", gaProperty: "" }));
assert.ok("fields" in plan);
assert.equal(plan.fields.monthlyFee, 35000);
assert.equal(plan.fields.reports, true);
assert.equal(plan.fields.gaProperty, null);
assert.ok("error" in readPlan(form({ name: "M", fee: "", firstDue: "2026-11-10", status: "active" })), "plano sem valor");
assert.ok("error" in readPlan(form({ name: "M", fee: "100", firstDue: "2026-11-30", status: "active" })), "dia 30 não existe em fevereiro");
assert.ok("error" in readPlan(form({ name: "M", fee: "100", firstDue: "2026-11-10", status: "active", gaProperty: "G-ABC123" })), "o GA4 quer o id numérico, não o de medição");

// projeto: valor vazio é "a combinar", prazo opcional
const project = readProject(form({ title: "Site", total: "", deadline: "", status: "proposal" }));
assert.ok("fields" in project);
assert.equal(project.fields.total, 0);
assert.equal(project.fields.deadline, null);
assert.ok("error" in readProject(form({ title: "Site", total: "", deadline: "2026-02-31", status: "proposal" })), "dia que não existe");
assert.ok("error" in readProject(form({ title: "Site", total: "", deadline: "", status: "pronto" })), "situação fora da lista");

// parcela: valor e vencimento obrigatórios
assert.ok("fields" in readInstallment(form({ amount: "1.500,00", dueOn: "2026-12-01" })));
assert.ok("error" in readInstallment(form({ amount: "", dueOn: "2026-12-01" })), "parcela sem valor");

// datas
assert.equal(longDate("2026-03-05"), "5 de março de 2026");
assert.equal(monthLabel("2026-10"), "outubro de 2026");
assert.equal(previousMonth("2026-01"), "2025-12");
assert.deepEqual(monthRange("2028-02"), { start: "2028-02-01", end: "2028-02-29" }, "bissexto");
assert.equal(todayInBrazil(new Date("2026-10-30T01:00:00Z")), "2026-10-29", "22h em Goiânia ainda é o dia anterior ao UTC");


// resumo da ficha: mensal só de plano ativo, atraso soma mensalidades e parcelas vencidas,
// projeto cancelado não conta, e o próximo vencimento é o mais cedo que ainda não passou
{
  const plan = (fields: Partial<Plan>): Plan => ({
    id: 1, clientId: 1, name: "Manutenção", monthlyFee: 35000, firstDue: "2026-01-10", status: "active", includes: null,
    reports: true, gaProperty: null, nextDue: "2026-12-10", overdue: false, overdueAmount: 0, ...fields,
  });
  const project = (fields: Partial<Project>): Project => ({
    id: 1, clientId: 1, title: "Site", scope: null, total: 300000, deadline: null, status: "in_progress", notes: null,
    paid: 0, scheduled: 0, overdue: false, ...fields,
  });
  const payment = (fields: Partial<Payment>): Payment => ({
    id: 1, planId: null, projectId: 1, description: null, amount: 100000, dueOn: "2026-12-01", paidOn: null, overdue: false, ...fields,
  });

  const money = clientMoney(
    [plan({ id: 1, overdue: true, nextDue: "2026-10-10", overdueAmount: 70000 }), plan({ id: 2, name: "Pausado", status: "paused", nextDue: "2026-11-20" })],
    [project({ id: 1 }), project({ id: 2, title: "Cancelado", status: "canceled" })],
    [
      payment({ id: 1, amount: 150000, paidOn: "2026-10-01", dueOn: "2026-10-01" }),
      payment({ id: 2, amount: 100000, dueOn: "2026-11-01", overdue: true }),
      payment({ id: 3, amount: 50000, dueOn: "2026-12-01" }),
      payment({ id: 4, projectId: 2, amount: 999900, dueOn: "2026-11-15" }),
      payment({ id: 5, planId: 1, projectId: null, amount: 35000, paidOn: "2026-09-10", dueOn: "2026-09-10" }),
    ],
  );
  assert.equal(money.monthly, 35000, "plano pausado fora do mensal");
  assert.equal(money.activePlans, 1);
  assert.equal(money.received, 185000);
  assert.equal(money.overdue, 170000, "duas mensalidades atrasadas + a parcela vencida");
  assert.equal(money.open, 220000, "o atraso mais a parcela que ainda vai vencer; a do cancelado não");
  assert.deepEqual(money.next, { dueOn: "2026-12-01", label: "Parcela · Site", amount: 50000 }, "mensalidade atrasada não é próximo vencimento");
  assert.equal(clientMoney([], [], []).next, null);
}

// recebido por mês: do mais recente pro mais antigo, com o total de cada mês; a receber fica de fora
{
  const pay = (id: number, amount: number, paidOn: string | null): Payment => ({
    id, planId: null, projectId: 1, description: null, amount, dueOn: "2026-01-01", paidOn, overdue: false,
  });
  const months = receivedByMonth([pay(1, 100, "2026-10-01"), pay(2, 50, "2026-11-20"), pay(3, 25, "2026-10-15"), pay(4, 999, null)]);
  assert.deepEqual(months.map((m) => [m.month, m.total, m.payments.map((p) => p.id)]), [
    ["2026-11", 50, [2]],
    ["2026-10", 125, [3, 1]],
  ]);
}

// contas: o ícone sai do nome, e a ordem das regras desempata os nomes ambíguos
assert.equal(serviceKind("Domínio (Registro.br)"), "domain");
assert.equal(serviceKind("Hostinger"), "hosting");
assert.equal(serviceKind("Google Search Console"), "search");
assert.equal(serviceKind("Google Analytics 4"), "analytics");
assert.equal(serviceKind("Meta Pixel"), "analytics", "pixel é medição, não rede social");
assert.equal(serviceKind("E-mail (Google Workspace)"), "email");
assert.equal(serviceKind("Instagram da loja"), "social");
assert.equal(serviceKind("Certificado"), "other");

// renovação em palavras, contada a partir de hoje
assert.deepEqual(renewal("2026-11-08", "2026-11-10"), { text: "venceu há 2 dias", tone: "late" });
assert.deepEqual(renewal("2026-11-10", "2026-11-10"), { text: "renova hoje", tone: "soon" });
assert.deepEqual(renewal("2026-11-11", "2026-11-10"), { text: "renova amanhã", tone: "soon" });
assert.deepEqual(renewal("2026-12-10", "2026-11-10"), { text: "renova em 30 dias", tone: "soon" });
assert.deepEqual(renewal("2027-05-10", "2026-11-10"), { text: "renova em 6 meses", tone: "ok" });
assert.deepEqual(renewal("2028-11-10", "2026-11-10"), { text: "renova em 2 anos", tone: "ok" });

// link do painel: com ou sem https, mas só http(s) — ele vira href
{
  const account = (url: string) => {
    const form = new FormData();
    form.set("service", "Domínio");
    form.set("owner", "client");
    form.set("url", url);
    return readAccount(form);
  };
  assert.ok("fields" in account("registro.br"));
  assert.ok("fields" in account("https://hpanel.hostinger.com/websites"));
  assert.ok("error" in account("javascript:alert(1)"), "esquema que não é http não passa");
  assert.ok("error" in account("meu painel"));
}

console.log("clientes: ok");
