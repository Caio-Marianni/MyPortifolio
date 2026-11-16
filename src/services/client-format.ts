import { br } from "./dates.ts";
import { brl } from "./money.ts";

/* O que dá pra fazer com os dados de um cliente sem banco: limites dos campos, máscaras,
   links e a logo. Arquivo à parte de services/clients.ts porque o formulário de cliente roda no
   navegador (prévia, máscara do WhatsApp) e não pode puxar o driver do banco junto.
   services/clients.ts reexporta tudo, então quem já importava de lá continua igual. */

export const CLIENT_LIMITS = { name: 160, document: 24, whatsapp: 24, email: 160, address: 300, site: 200, notes: 2000 } as const;

/** O filtro em que a lista de clientes estava (RememberView): a seta da ficha volta pra ele. */
export const CLIENT_VIEW_COOKIE = "clientes_ver";

/** CPF (11 dígitos) ou CNPJ (14 posições) com a máscara de sempre; outra contagem é null.
    O CNPJ aceita letra nas 12 primeiras posições — é o formato alfanumérico que a Receita
    começou a emitir em julho de 2026. Dígito verificador não é conferido: um erro de
    digitação aparece no contrato, que você revisa antes de mandar. */
export function formatDocument(value: string): string | null {
  const clean = value.toUpperCase().replace(/[^0-9A-Z]/g, "");
  if (/^\d{11}$/.test(clean)) return clean.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  if (/^[0-9A-Z]{12}\d{2}$/.test(clean)) return clean.replace(/^(.{2})(.{3})(.{3})(.{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  return null;
}

/** Celular brasileiro com DDD, com ou sem o 55 → só dígitos com o 55. Outra contagem é null.
    ponytail: só número do Brasil; número de fora pediria o código do país num campo próprio. */
export function whatsappDigits(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith("55")) return digits;
  return null;
}

/** "5562999998888" → "+55 62 99999-8888" */
export function formatWhatsapp(digits: string): string {
  const local = digits.slice(2);
  return `+55 ${local.slice(0, 2)} ${local.slice(2, -4)}-${local.slice(-4)}`;
}

/** Conversa aberta com o cliente, já com o texto escrito quando houver. */
export const whatsappLink = (digits: string, message?: string): string =>
  `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

/** site guardado como digitado ("loja.com.br"); o link precisa do protocolo */
export const siteHref = (site: string): string => (/^https?:\/\//i.test(site) ? site : `https://${site}`);

/** "https://www.loja.com.br/contato" → "www.loja.com.br", o domínio que o /api/favicon aceita.
    Site torto é null, e a lista mostra as iniciais no lugar da logo. */
export function siteHost(site: string | null): string | null {
  if (!site) return null;
  try {
    const host = new URL(siteHref(site.trim())).hostname;
    return /^[a-z0-9.-]{1,253}$/i.test(host) && host.includes(".") ? host : null;
  } catch {
    return null;
  }
}

/** "Rio Plus Transfer" → "RP"; um nome só → as duas primeiras letras. A logo de quem não tem site. */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters = words.length > 1 ? words[0][0] + words[1][0] : (words[0] ?? "").slice(0, 2);
  return letters.toUpperCase();
}

/** Máscara do WhatsApp enquanto digita: "62999998888" → "62 99999-8888". Tira o 55 colado na
    frente, para em 11 dígitos. O servidor relê tudo com `whatsappDigits` — isto é só conforto. */
export function maskWhatsapp(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.length > 11 && digits.startsWith("55")) digits = digits.slice(2);
  digits = digits.slice(0, 11);
  if (digits.length <= 2) return digits;
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  return rest.length <= 4 ? `${ddd} ${rest}` : `${ddd} ${rest.slice(0, -4)}-${rest.slice(-4)}`;
}

/** O texto do "Cobrar": vai pronto pro WhatsApp e você só aperta enviar — ou ajusta antes. Da
    visão geral sai com o que venceu (`label`, "Mensalidade · Manutenção"); da lista de clientes,
    só o total em aberto e desde quando. */
export const chargeMessage = (due: { amount: number; dueOn: string; label?: string }): string =>
  `Oi, tudo bem? Passando pra lembrar do pagamento de ${brl(due.amount)}${due.label ? ` (${due.label})` : ""}, ` +
  `que venceu em ${br(due.dueOn)}. Se já acertou, pode desconsiderar. Obrigado!`;
