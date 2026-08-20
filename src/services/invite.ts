import { createHmac, timingSafeEqual } from "node:crypto";

/* Convite assinado em vez de guardado: o link que você manda carrega um identificador do
   contratante e a assinatura DELE. Sem tabela de convites — quem não recebeu link não
   consegue forjar um, e o identificador viaja junto até o painel, então você sabe qual link
   gerou cada avaliação.

   Só o identificador é assinado. Nome, empresa e trilha vão no link como sugestão e o
   contratante corrige o que estiver errado — se a assinatura os cobrisse, toda correção
   invalidaria o próprio link.

   ponytail: assinatura não expira e não é de uso único (isso pediria estado). O mesmo link
   manda quantas avaliações quiser — todas entram como pendentes, então quem decide é você
   no painel. Rotacionar REVIEW_SECRET invalida todos os links de uma vez. */

function secret(): string {
  const value = process.env.REVIEW_SECRET;
  if (!value) throw new Error("REVIEW_SECRET não definido");
  return value;
}

export function signInvite(invite: string): string {
  return createHmac("sha256", secret()).update(invite).digest("hex").slice(0, 24);
}

export function verifyInvite(invite: string, token: string | undefined): boolean {
  if (!invite || !token) return false;
  /* Segredo faltando derruba a assinatura, não a página: o cliente vê "link inválido" em vez
     de um erro 500. Assinar continua explodindo — lá o silêncio geraria link que não abre. */
  if (!process.env.REVIEW_SECRET) {
    console.error("[reviews] REVIEW_SECRET não definido — todo link de avaliação será recusado");
    return false;
  }
  const expected = signInvite(invite);
  /* timingSafeEqual joga se os tamanhos diferem, então o tamanho é conferido antes */
  if (token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

/** Identificador legível a partir do nome: é o que aparece no painel ao lado da avaliação. */
export function inviteId(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Monta o link inteiro. Vive aqui porque quem o gera são dois: o painel, que sabe o host pela
    requisição, e o script de linha de comando, que recebe o host por variável de ambiente.

    `t` (trilha) e `p` (projeto) deixaram de ser campo do formulário: quem escolhe os dois é
    você, aqui. Continuam fora da assinatura porque não são portão — o pior que um cliente
    esperto faz mexendo neles é etiquetar errado a própria avaliação, que você lê no painel
    antes de publicar. */
export function inviteLink(
  origin: string,
  invite: { name: string; company: string; track: string; project?: number | null },
): string {
  const id = inviteId(invite.name);
  const url = new URL("/avaliar", origin);
  url.searchParams.set("c", id);
  url.searchParams.set("k", signInvite(id));
  url.searchParams.set("n", invite.name);
  url.searchParams.set("e", invite.company);
  url.searchParams.set("t", invite.track);
  if (invite.project) url.searchParams.set("p", String(invite.project));
  return url.toString();
}
