/* Dinheiro do painel: guardado em centavos (int), digitado e mostrado do jeito brasileiro. */

/** teto de um valor, em centavos (R$ 1 milhão): bem acima de qualquer projeto, bem abaixo do `int` */
const MAX = 100_000_000;

/** "1.500,00", "1500", "150,5" — com ponto de milhar opcional. O `pattern` dos campos de valor é
    esta mesma expressão, então o navegador barra antes de chegar aqui. */
export const MONEY_PATTERN = "\\d+(\\.\\d{3})*(,\\d{1,2})?";

/** Reais digitados → centavos. Vazio é 0; qualquer outra coisa fora do formato é erro, não zero —
    zero calado esconderia um valor que você quis registrar. */
export function parseMoney(value: string): number | null {
  const clean = value.replace(/^R\$\s*/i, "").trim();
  if (!clean) return 0;
  if (!new RegExp(`^${MONEY_PATTERN}$`).test(clean)) return null;
  const [reais, centavos = ""] = clean.replace(/\./g, "").split(",");
  const cents = Number(reais) * 100 + Number(centavos.padEnd(2, "0"));
  return cents <= MAX ? cents : null;
}

/** 150000 → "R$ 1.500,00" */
export const brl = (cents: number): string => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** 150000 → "1.500,00", o formato que o campo aceita de volta; 0 vira campo vazio */
export const moneyField = (cents: number): string =>
  cents ? (cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "";
