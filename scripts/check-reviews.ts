/* Checagem das duas peças que não dá pra conferir de olho: a conta das médias e o portão do
   convite. Sem framework — `node scripts/check-reviews.ts` passa calado ou joga.            */

import assert from "node:assert/strict";
import { LIMITS, formatMonth, isJpegBase64, ratingMark, reviewImage, summarize, type Review } from "../src/data/reviews.ts";
/* o segredo é lido na hora de assinar, não no import — daí dá pra plantá-lo aqui embaixo */
import { inviteId, inviteLink, signInvite, verifyInvite } from "../src/services/invite.ts";
import { COOKIE_PATH, credentialsOk, newSession, validSession } from "../src/services/admin.ts";
import { readFields, readImages, validDate } from "../src/services/review-input.ts";

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
  month: "2026-10",
  version: 1,
});

// data do card: mês e ano nos dois idiomas; valor torto vira vazio em vez de "undefined 2026"
assert.equal(formatMonth("2026-10", "pt"), "out. 2026");
assert.equal(formatMonth("2026-01", "en"), "Jan 2026");
assert.equal(formatMonth("2026-13", "pt"), "");

// sem avaliação: nada de 0.0 na tela — as peças de marca recebem null e somem
const vazio = summarize([]);
assert.deepEqual(vazio.overall, { avg: 0, count: 0, happy: 0 });
assert.equal(ratingMark(vazio.overall), null);

// média geral é de todas; a da trilha só das dela
const summary = summarize([review(1, "web", 5), review(2, "web", 4), review(3, "thumbs", 3)]);
assert.deepEqual(summary.overall, { avg: 4, count: 3, happy: 2 });
assert.deepEqual(summary.web, { avg: 4.5, count: 2, happy: 2 });
assert.deepEqual(summary.thumbs, { avg: 3, count: 1, happy: 0 });

// cliente feliz é pessoa, não avaliação: a mesma pessoa duas vezes (caixa diferente) conta uma
const repetido = summarize([review(1, "web", 5), { ...review(2, "thumbs", 4), name: " CLIENTE 1" }]);
assert.equal(repetido.overall.happy, 1);

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
// a versão vai na URL: editar no painel troca o endereço e fura o cache de um ano da rota
assert.equal(reviewImage({ id: 7, version: 1 }), "/api/reviews/7/image?v=1");
assert.equal(reviewImage({ id: 7, version: 2 }, 0), "/api/reviews/7/image?v=2&i=0");

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

// edição pelo painel: data real, sem futuro — fevereiro 31 não passa disfarçado de março
assert.equal(validDate("2026-10-17", "2026-10-17"), true);
assert.equal(validDate("2026-10-18", "2026-10-17"), false, "data no futuro");
assert.equal(validDate("2026-02-31", "2026-10-17"), false, "dia que não existe");
assert.equal(validDate("17/10/2026", "2026-10-17"), false, "formato errado");

// campos: as mesmas regras pro envio do cliente e pra edição; projeto desconhecido vira null
const pt = (message: string) => message;
const lido = readFields({ name: " Ana ", company: "", track: "web", rating: 5, comment: "", project: 999 }, pt);
assert.ok("fields" in lido && lido.fields.name === "Ana" && lido.fields.company === null && lido.fields.project === null);
assert.ok("error" in readFields({ name: "Ana", track: "web", rating: 6 }, pt), "nota fora de 1..5");
assert.ok("error" in readFields({ name: "", track: "web", rating: 5 }, pt), "nome vazio");

// imagens do painel: "manter" só existe na edição — no cadastro não há o que manter
const shot = "/9j/AAAA";
assert.deepEqual(readImages({ photo: "keep", shots: [{ keep: 1 }, shot] }, true), { photo: "keep", shots: [1, shot] });
assert.ok("error" in readImages({ photo: null, shots: [{ keep: 0 }] }, false), "keep no cadastro");
assert.deepEqual(readImages({ photo: "keep", shots: [] }, false), { error: "Não consegui ler a foto do cliente." });
assert.ok("error" in readImages({ shots: [shot, shot, shot, shot] }, true), "mais de 3 fotos");
