/* As abas da ficha do cliente (`?aba=`) e a regra de qual mostrar. Arquivo à parte do componente
   (sheet-tabs.tsx, que roda no navegador por causa da barra que desliza): função exportada de
   módulo de cliente chega no servidor como referência, não dá pra chamar — e a página usa estas
   duas no servidor. */

export const SHEET_TABS = ["financeiro", "contas", "documentos"] as const;
export type SheetTab = (typeof SHEET_TABS)[number];

/** Que aba mostrar: a da URL; sem ela, a do que a URL está mexendo — as actions voltam com
    `?feito=conta-3` ou `?conta=nova&erro=`, e a ficha tem que abrir na aba daquilo. */
export function sheetTab(params: { aba?: string; conta?: string; feito?: string; excluir?: string; gerar?: string }): SheetTab {
  if (params.aba && (SHEET_TABS as readonly string[]).includes(params.aba)) return params.aba as SheetTab;
  const touched = params.feito ?? params.excluir ?? "";
  if (params.conta || touched.startsWith("conta-")) return "contas";
  if (params.gerar !== undefined) return "documentos";
  return "financeiro";
}

/** O endereço da aba; a primeira é a ficha sem parâmetro. */
export const tabHref = (page: string, tab: SheetTab): string => (tab === "financeiro" ? page : `${page}?aba=${tab}`);
