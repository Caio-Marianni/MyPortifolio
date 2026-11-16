/* caminho relativo com extensão: o `npm run check` roda isto no node puro, que não conhece o
   alias `@/` */
import { todayInBrazil } from "./dates.ts";
import { text, validDate } from "./review-input.ts";

/* Leitura dos formulários do painel. A fronteira de confiança é a server action — o `required`
   e o `maxLength` da tela são conforto, não tranca. */

/** Campo do formulário como texto aparado; ausente vira "". */
export const field = (form: FormData, key: string): string => text(form.get(key));

/** Data opcional: "" é null, data válida é ela mesma, qualquer outra coisa é `undefined` (erro).
    Sem teto de futuro — vencimento e prazo moram lá. */
export const optionalDate = (value: string): string | null | undefined =>
  value === "" ? null : validDate(value, "9999-12-31") ? value : undefined;

/** Dia em que o dinheiro entrou ("Recebi"): vazio é hoje; futuro ou data torta é `undefined` (erro).
    Pagamento que você só registra dias depois fica com o dia certo, e o "recebido no mês" também. */
export function paidOn(value: string, today = todayInBrazil()): string | undefined {
  if (value === "") return today;
  return validDate(value, today) ? value : undefined;
}

/** Id positivo vindo de campo escondido ou da URL; o resto é null. */
export function readId(value: unknown): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

/** Valor de uma lista fechada (status, tipo); fora dela é `undefined`. */
export const oneOf = <T extends string>(value: string, options: readonly T[]): T | undefined =>
  options.includes(value as T) ? (value as T) : undefined;

/** O primeiro campo que passou do limite, pra mensagem dizer qual. */
export function tooLong<K extends string>(values: Record<K, string>, limits: Record<K, number>): K | undefined {
  return (Object.keys(limits) as K[]).find((key) => values[key].length > limits[key]);
}

/** Mesma checagem do `type="email"` do navegador, no essencial: algo@algo.algo, sem espaço. */
export const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
