/* Gera o link de avaliação de um contratante. Node 24 roda TypeScript direto, então não há
   build nem dependência aqui — a assinatura sai do mesmo módulo que a rota confere.

   uso: node --env-file=.env.local scripts/invite.ts "Nome do cliente" "Empresa" web
        node --env-file=.env.local scripts/invite.ts "Nome do cliente" "" thumbs

   Nome, empresa e trilha vão no link só como preenchimento — quem recebe corrige o que
   estiver errado. O que a assinatura protege é o identificador, que volta no painel dizendo
   qual link gerou cada avaliação.                                                          */

import { inviteLink } from "../src/services/invite.ts";

const [name, company = "", track = "web"] = process.argv.slice(2);

if (!name || (track !== "web" && track !== "thumbs")) {
  console.error('uso: node --env-file=.env.local scripts/invite.ts "Nome" "Empresa" web|thumbs');
  process.exit(1);
}

console.log(inviteLink(process.env.SITE_URL ?? "https://www.caiomarianni.com.br", { name, company, track }));
