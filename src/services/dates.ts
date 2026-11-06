/* Datas do painel, sempre como texto "YYYY-MM-DD" (dia) ou "YYYY-MM" (mês): é o formato que o
   banco devolve com `to_char` e o `<input type="date">` usa, então não há fuso pra converter. */

const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

/** "2026-10-27" → "27/10/2026" */
export const br = (iso: string): string => iso.split("-").reverse().join("/");

/** "2026-10-27" → "27 de outubro de 2026", como vai no contrato */
export function longDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} de ${MONTHS[month - 1]} de ${year}`;
}

/** "2026-10" → "outubro de 2026" */
export function monthLabel(month: string): string {
  const [year, index] = month.split("-").map(Number);
  return `${MONTHS[index - 1]} de ${year}`;
}

/** "2026-10" → "outubro" */
export const monthName = (month: string): string => MONTHS[Number(month.split("-")[1]) - 1];

/** "2026-01" → "2025-12" */
export function previousMonth(month: string): string {
  const [year, index] = month.split("-").map(Number);
  return index === 1 ? `${year - 1}-12` : `${year}-${String(index - 1).padStart(2, "0")}`;
}

/** Primeiro e último dia do mês. O dia 0 do mês seguinte é o último deste — fevereiro e ano
    bissexto saem de graça. */
export function monthRange(month: string): { start: string; end: string } {
  const [year, index] = month.split("-").map(Number);
  const last = new Date(Date.UTC(year, index, 0)).getUTCDate();
  return { start: `${month}-01`, end: `${month}-${String(last).padStart(2, "0")}` };
}

/** Hoje em Goiânia como "YYYY-MM-DD". O servidor roda em UTC; o `en-CA` é só o locale que já
    formata nessa ordem. */
export const todayInBrazil = (now = new Date()): string =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(now);
