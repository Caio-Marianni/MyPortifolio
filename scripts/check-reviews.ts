/* Checagem das duas peças que não dá pra conferir de olho: a conta das médias e o portão do
   convite. Sem framework — `node scripts/check-reviews.ts` passa calado ou joga.            */

import assert from "node:assert/strict";
import { LIMITS, isJpegBase64, ratingMark, reviewImage, summarize, type Review } from "../src/data/reviews.ts";
/* o segredo é lido na hora de assinar, não no import — daí dá pra plantá-lo aqui embaixo */
import { inviteId, inviteLink, signInvite, verifyInvite } from "../src/services/invite.ts";
import { COOKIE_PATH, credentialsOk, newSession, validSession } from "../src/services/admin.ts";

process.env.REVIEW_SECRET ??= "segredo-de-teste";
process.env.ADMIN_PASSWORD ??= "senha-de-teste";

const review = (id: number, track: Review["track"], rating: number): Review => ({
  id,
  name: `cliente ${id}`,
  company: null,
  track,
  rating,
  comment: "ok",
  project: null,
  photo: false,
  shots: 0,
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

// convite: a trilha e o projeto viajam no link porque quem os escolhe e voce, nao o cliente
const link = new URL(inviteLink("https://exemplo.test", { name: "Fulano de Tal", company: "ACME", track: "thumbs", project: 3 }));
assert.equal(link.searchParams.get("t"), "thumbs");
assert.equal(link.searchParams.get("p"), "3");
assert.equal(link.searchParams.get("c"), "fulano-de-tal");
assert.equal(
  new URL(inviteLink("https://exemplo.test", { name: "Fulano", company: "", track: "web" })).searchParams.has("p"),
  false,
  "avaliacao sem projeto nao carrega o parametro vazio",
);

// imagem: sem indice e a foto do cliente, com indice e a enesima foto do projeto
assert.equal(reviewImage(7), "/api/reviews/7/image");
assert.equal(reviewImage(7, 0), "/api/reviews/7/image?i=0");

// imagem: so passa base64 que comeca com a assinatura de JPEG (bytes FF D8 FF), dentro do teto
const jpeg = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff]), Buffer.alloc(9, 7)]).toString("base64");
assert.equal(isJpegBase64(jpeg, LIMITS.photo), true);
assert.equal(isJpegBase64("", LIMITS.photo), false, "campo vazio nao e imagem");
assert.equal(isJpegBase64(jpeg, 4), false, "acima do teto nao passa");
assert.equal(isJpegBase64(Buffer.from("<svg onload=alert(1)>").toString("base64"), LIMITS.photo), false, "so JPEG");
assert.equal(isJpegBase64("/9j/<script>", LIMITS.photo), false, "assinatura certa nao salva corpo invalido");
assert.equal(isJpegBase64("/9j/abc", LIMITS.photo), false, "base64 truncado nao passa");

// painel: o campo de usuario e isca, entao so entra quem o deixa vazio
assert.equal(credentialsOk("", "senha-de-teste"), true);
assert.equal(credentialsOk("admin", "senha-de-teste"), false, "usuario preenchido nao entra nem com a senha certa");
assert.equal(credentialsOk("", "outra"), false);
assert.equal(credentialsOk("", ""), false);

// sessao: o cookie vale no site inteiro — preso em /admin, a rota da imagem nao veria o painel
assert.equal(COOKIE_PATH, "/", "cookie fora da raiz esconde a foto da avaliacao pendente");

// sessao: vale a que este segredo assinou, e so enquanto nao vencer
const cookie = newSession();
const [expira, assinatura] = cookie.split(".");
assert.equal(validSession(cookie), true);
assert.equal(validSession(undefined), false);
assert.equal(validSession("naoetimestamp.assinatura"), false);
assert.equal(validSession(`${Number(expira) + 60000}.${assinatura}`), false, "esticar o vencimento invalida a assinatura");
assert.equal(validSession(`1.${assinatura}`), false, "cookie vencido nao vale");

console.log("avaliacoes: ok");
