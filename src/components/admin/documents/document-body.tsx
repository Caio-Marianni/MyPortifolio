import { parseBlocks, splitBold, splitFields } from "@/services/document-text";

/* O documento como papel: a mesma leitura na prévia do editor, no documento enviado e na página
   de imprimir. Cores fixas de papel, não os tokens do tema — o PDF sai igual no tema claro e no
   escuro. Sem estado nem banco: roda também na prévia ao vivo, no navegador. */

function Inline({ text, marks }: { text: string; marks: boolean }) {
  return (
    <>
      {splitBold(text).map((part, i) => {
        /* `marks`: na prévia, o {campo} que sobrou ganha marca-texto para saltar aos olhos */
        const content = marks
          ? splitFields(part.text).map((piece, j) =>
              piece.field ? (
                <mark key={j} className="rounded-sm bg-amber-200 px-0.5 text-neutral-900">
                  {piece.text}
                </mark>
              ) : (
                <span key={j}>{piece.text}</span>
              ),
            )
          : part.text;
        return part.bold ? <strong key={i}>{content}</strong> : <span key={i}>{content}</span>;
      })}
    </>
  );
}

export function DocumentBody({ body, markFields = false }: { body: string; markFields?: boolean }) {
  return (
    <div className="flex flex-col gap-3 font-inter text-ui leading-[1.65] text-neutral-900">
      {parseBlocks(body).map((block, i) => {
        if (block.type === "h1") {
          return (
            <h1 key={i} className="mb-3 text-center text-[17px] font-bold uppercase tracking-[0.04em]">
              <Inline text={block.text} marks={markFields} />
            </h1>
          );
        }
        if (block.type === "h2") {
          return (
            <h2 key={i} className="mt-3 text-ui font-bold uppercase tracking-[0.04em]">
              <Inline text={block.text} marks={markFields} />
            </h2>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={i} className="list-disc pl-6">
              {block.items.map((item, j) => (
                <li key={j}>
                  <Inline text={item} marks={markFields} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="whitespace-pre-line text-justify">
            <Inline text={block.text} marks={markFields} />
          </p>
        );
      })}
    </div>
  );
}
