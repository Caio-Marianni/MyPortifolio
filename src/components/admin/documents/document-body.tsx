import { parseBlocks, splitBold } from "@/services/documents";

/* O documento como papel: a mesma leitura na pré-visualização do painel e na página de imprimir.
   Cores fixas de papel, não os tokens do tema — o PDF sai igual no tema claro e no escuro. */

function Inline({ text }: { text: string }) {
  return (
    <>
      {splitBold(text).map((part, i) => (part.bold ? <strong key={i}>{part.text}</strong> : <span key={i}>{part.text}</span>))}
    </>
  );
}

export function DocumentBody({ body }: { body: string }) {
  return (
    <div className="flex flex-col gap-3 font-inter text-[13px] leading-[1.65] text-neutral-900">
      {parseBlocks(body).map((block, i) => {
        if (block.type === "h1") {
          return (
            <h1 key={i} className="mb-3 text-center text-[17px] font-bold uppercase tracking-[0.04em]">
              <Inline text={block.text} />
            </h1>
          );
        }
        if (block.type === "h2") {
          return (
            <h2 key={i} className="mt-3 text-[13.5px] font-bold uppercase tracking-[0.04em]">
              <Inline text={block.text} />
            </h2>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={i} className="list-disc pl-6">
              {block.items.map((item, j) => (
                <li key={j}>
                  <Inline text={item} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="whitespace-pre-line text-justify">
            <Inline text={block.text} />
          </p>
        );
      })}
    </div>
  );
}
