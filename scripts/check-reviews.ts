/* Checagem das duas peças que não dá pra conferir de olho: a conta das médias e o portão do
   convite. Sem framework — `node scripts/check-reviews.ts` passa calado ou joga.            */

import assert from "node:assert/strict";
import { ratingMark, summarize, type Review } from "../src/data/reviews.ts";
/* o segredo é lido na hora de assinar, não no import — daí dá pra plantá-lo aqui embaixo */
import { inviteId, signInvite, verifyInvite } from "../src/services/invite.ts";
import { credentialsOk, newSession, validSession } from "../src/services/admin.ts";

process.env.REVIEW_SECRET ??= "segredo-de-teste";
process.env.ADMIN_PASSWORD ??= "senha-de-teste";

const review = (id: number, track: Review["track"], rating: number): Review => ({
  id,
  name: `cliente ${id}`,
  company: null,
  track,
  rating,
  comment: "ok",
});

// sem avaliação: nada de 0.0 na tela — as peças de marca recebem null e somem
const vazio = summarize([]);
assert.deepEqual(vazio.overall, { avg: 0, count: 0 });
assert.equal(ratingMark(vazio.overall), null);

// média geral é de todas; a da trilha só das dela
const summary = summarize([review(1, "web", 5), review(2, "web", 4), review(3, "thumbs", 3)]);
assert.deepEqual(summary.overall, { avg: 4, count: 3 });
assert.deepEqual(summary.web, { avg: 4.5, count: 2 });
assert.deepEqual(summary.thumbs, { avg: 3, count: 1 });

assert.deepEqual(ratingMark(summary.overall), { value: "4.0", stars: 4 });
assert.deepEqual(ratingMark(summary.web), { value: "4.5", stars: 5 });

// convite: a assinatura vale pro identificador dela e só pra ele
const invite = inviteId("Fulano de Tal");
assert.equal(invite, "fulano-de-tal", "identificador entra no link, então nada de acento nem espaco");

const token = signInvite(invite);
assert.equal(verifyInvite(invite, token), true);
assert.equal(verifyInvite("outro-cliente", token), false, "convite trocado nao pode passar");
assert.equal(verifyInvite(invite, undefined), false);
assert.equal(verifyInvite(invite, "x"), false, "token curto nao pode explodir o timingSafeEqual");
assert.equal(verifyInvite("", token), false);

// painel: o campo de usuario e isca, entao so entra quem o deixa vazio
assert.equal(credentialsOk("", "senha-de-teste"), true);
assert.equal(credentialsOk("admin", "senha-de-teste"), false, "usuario preenchido nao entra nem com a senha certa");
assert.equal(credentialsOk("", "outra"), false);
assert.equal(credentialsOk("", ""), false);

// sessao: vale a que este segredo assinou, e so enquanto nao vencer
const cookie = newSession();
const [expira, assinatura] = cookie.split(".");
assert.equal(validSession(cookie), true);
assert.equal(validSession(undefined), false);
assert.equal(validSession("naoetimestamp.assinatura"), false);
assert.equal(validSession(`${Number(expira) + 60000}.${assinatura}`), false, "esticar o vencimento invalida a assinatura");
assert.equal(validSession(`1.${assinatura}`), false, "cookie vencido nao vale");

console.log("avaliacoes: ok");
