/* O texto dos documentos, sem banco: preencher {campos}, achar os que sobraram e quebrar em
   blocos. Arquivo à parte de services/documents.ts porque a prévia do editor roda no navegador,
   e lá não pode chegar nada que importe o banco. */

const FIELD_PATTERN = /\{([a-z_]+)\}/g;

/** Troca cada {chave} pelo valor. Chave sem valor fica como está, entre chaves: à vista no
    rascunho pra você completar, em vez de sumir calada do contrato. */
export function fillTemplate(body: string, values: Record<string, string>): string {
  return body.replace(FIELD_PATTERN, (match, key: string) => values[key] ?? match);
}

/** Os {campos} que ficaram no texto, cada um uma vez, na ordem em que aparecem. */
export const pendingFields = (body: string): string[] => Array.from(new Set(Array.from(body.matchAll(FIELD_PATTERN), (match) => match[1])));

export type Block = { type: "h1" | "h2" | "p"; text: string } | { type: "ul"; items: string[] };

/** Formatação mínima dos documentos: "# " título, "## " seção, "- " item de lista, linha em
    branco separa parágrafo. Markdown de verdade pediria uma dependência pra estes quatro casos. */
export function parseBlocks(body: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  const flush = () => {
    if (paragraph.length) blocks.push({ type: "p", text: paragraph.join("\n") });
    paragraph = [];
  };

  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trim();
    if (line.startsWith("# ")) {
      flush();
      blocks.push({ type: "h1", text: line.slice(2).trim() });
    } else if (line.startsWith("## ")) {
      flush();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
    } else if (line.startsWith("- ")) {
      flush();
      const last = blocks.at(-1);
      if (last?.type === "ul") last.items.push(line.slice(2).trim());
      else blocks.push({ type: "ul", items: [line.slice(2).trim()] });
    } else if (line) {
      paragraph.push(line);
    } else {
      flush();
    }
  }
  flush();
  return blocks;
}

/** **negrito** dentro de uma linha: os pedaços ímpares do split são os que estavam entre `**`. */
export const splitBold = (text: string): { text: string; bold: boolean }[] =>
  text
    .split(/\*\*(.+?)\*\*/)
    .map((part, i) => ({ text: part, bold: i % 2 === 1 }))
    .filter((part) => part.text);

/** {campo} solto numa linha, para a prévia marcar: os pedaços ímpares são os campos. */
export const splitFields = (text: string): { text: string; field: boolean }[] =>
  text
    .split(/(\{[a-z_]+\})/)
    .map((part, i) => ({ text: part, field: i % 2 === 1 }))
    .filter((part) => part.text);
