/* Checagem do lembrete diário sem rede e sem banco: o que entra na notificação e a tranca da rota.
   `node scripts/check-reminders.ts` passa calado ou joga. */

import assert from "node:assert/strict";
import { reminderAuthorized, reminderLines } from "../src/services/reminders.ts";
import type { Due, Overview } from "../src/services/overview.ts";

const due = (dueOn: string): Due => ({
  clientId: 1,
  clientName: "Cliente",
  label: "Mensalidade · Manutenção",
  dueOn,
  amount: 15000,
  kind: "plan",
  refId: 1,
  whatsapp: null,
});

const calm: Overview = {
  monthly: 0,
  received: 0,
  overdueAmount: 0,
  activeClients: 0,
  overdue: [],
  upcoming: [],
  expiring: [],
  lateProjects: [],
  awaitingSignature: [],
  pendingReports: 0,
  pendingReviews: 0,
};

// tudo em dia num dia comum: nada a avisar, e a rota não manda notificação
assert.deepEqual(reminderLines(calm, "2026-11-10"), []);

// contagens no singular e no plural; vencimento só conta o de hoje, não a semana toda
const busy: Overview = {
  ...calm,
  overdue: [due("2026-11-01"), due("2026-11-05")],
  upcoming: [due("2026-11-10"), due("2026-11-14")],
  lateProjects: [{ id: 1, clientId: 1, clientName: "Cliente", title: "Site", deadline: "2026-11-01" }],
  pendingReports: 2,
  pendingReviews: 1,
};
assert.deepEqual(reminderLines(busy, "2026-11-10"), [
  "2 cobranças em atraso",
  "1 vencimento hoje",
  "1 projeto com prazo estourado",
  "Relatórios de outubro de 2026 por enviar: 2",
  "1 avaliação para moderar",
]);

// antes do dia 3 os números do GA4 não fecharam: relatório ainda não é pendência
assert.ok(!reminderLines(busy, "2026-11-02").some((line) => line.startsWith("Relatórios")));

// dia 1: o lembrete do backup sai mesmo com tudo em dia
assert.deepEqual(reminderLines(calm, "2026-12-01"), ["Começo do mês: rode npm run backup"]);

// a tranca: só o Bearer com o tópico exato
assert.ok(reminderAuthorized("Bearer topico-secreto", "topico-secreto"));
assert.ok(!reminderAuthorized("Bearer topico-errado", "topico-secreto"));
assert.ok(!reminderAuthorized("topico-secreto", "topico-secreto"), "sem o Bearer não entra");
assert.ok(!reminderAuthorized(null, "topico-secreto"));

console.log("lembrete: ok");
