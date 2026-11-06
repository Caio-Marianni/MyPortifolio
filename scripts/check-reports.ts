/* Checagem do relatório mensal sem rede e sem banco: a leitura da resposta do GA4, os rótulos, o
   mês coberto e o link assinado. `node scripts/check-reports.ts` passa calado ou joga. */

import assert from "node:assert/strict";
import { buildRequests, change, channelLabel, eventLabel, pageLabel, parseBatch } from "../src/services/analytics.ts";
import { readMonth, readReportToken, reportMessage, reportMonth, reportToken } from "../src/services/reports.ts";
import { signInvite } from "../src/services/invite.ts";

process.env.REVIEW_SECRET ??= "segredo-de-teste";

// pedido: cinco consultas, a primeira com o mês e o anterior; fevereiro bissexto fecha no 29
const requests = buildRequests("2028-03");
assert.equal(requests.length, 5, "o batch do GA4 aceita no máximo cinco");
assert.deepEqual(requests[0].dateRanges, [
  { startDate: "2028-03-01", endDate: "2028-03-31" },
  { startDate: "2028-02-01", endDate: "2028-02-29" },
]);

// resposta: totais por período (a API põe date_range_N sozinha), rankings na ordem que vieram
const data = parseBatch("2026-10", [
  {
    rows: [
      { dimensionValues: [{ value: "date_range_1" }], metricValues: [{ value: "80" }, { value: "100" }, { value: "300" }, { value: "4" }] },
      { dimensionValues: [{ value: "date_range_0" }], metricValues: [{ value: "120" }, { value: "150" }, { value: "420" }, { value: "9" }] },
    ],
  },
  { rows: [{ dimensionValues: [{ value: "Organic Search" }], metricValues: [{ value: "90" }] }] },
  {},
  { rows: [{ dimensionValues: [{ value: "mobile" }], metricValues: [{ value: "130" }] }] },
  { rows: [{ dimensionValues: [{ value: "click_whatsapp" }], metricValues: [{ value: "9" }] }] },
]);
assert.deepEqual(data.totals, { users: 120, sessions: 150, views: 420, conversions: 9 });
assert.deepEqual(data.previous, { users: 80, sessions: 100, views: 300, conversions: 4 });
assert.deepEqual(data.pages, [], "consulta sem linha nenhuma vira lista vazia");
assert.deepEqual(data.channels, [{ name: "Organic Search", value: 90 }]);

// site sem nenhum acesso: o GA4 não manda linha, os totais ficam zerados em vez de quebrar
assert.deepEqual(parseBatch("2026-10", [{}, {}, {}, {}, {}]).totals, { users: 0, sessions: 0, views: 0, conversions: 0 });

// rótulos pro cliente
assert.equal(channelLabel("Organic Search"), "Busca no Google e outros buscadores");
assert.equal(channelLabel("Canal novo do Google"), "Canal novo do Google", "canal desconhecido passa como veio");
assert.equal(eventLabel("click_whatsapp"), "Cliques no WhatsApp");
assert.equal(eventLabel("agendou_transfer"), "Agendou transfer");
assert.equal(pageLabel("/"), "Página inicial");

// variação: sem mês anterior não há base
assert.equal(change(150, 100), 50);
assert.equal(change(90, 100), -10);
assert.equal(change(10, 0), null);

// mês coberto: o que fechou; janeiro olha pra dezembro do ano anterior
assert.equal(reportMonth("2026-11-03"), "2026-10");
assert.equal(reportMonth("2027-01-03"), "2026-12");
assert.equal(readMonth("2026-13", "2026-10"), "2026-10", "mês que não existe cai no padrão");
assert.equal(readMonth("2026-09", "2026-10"), "2026-09");

// link: abre o próprio relatório, e assinatura de convite não serve de chave
assert.equal(readReportToken(reportToken(42)), 42);
assert.equal(readReportToken(`43-${reportToken(42).split("-")[1]}`), null, "assinatura de outro id");
assert.equal(readReportToken(`42-${signInvite("42")}`), null, "assinatura sem o prefixo de relatório");
assert.equal(readReportToken("lixo"), null);

assert.equal(
  reportMessage({ clientName: "Rio Plus", month: "2026-10" }, "https://x/relatorio/1-abc"),
  "Olá, Rio Plus! Segue o relatório de outubro de 2026 do seu site: https://x/relatorio/1-abc",
);

console.log("relatorios: ok");
