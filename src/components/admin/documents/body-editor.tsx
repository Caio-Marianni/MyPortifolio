"use client";

import { useId, useState } from "react";
import { Check, TriangleAlert } from "lucide-react";
import { DocumentBody } from "@/components/admin/documents/document-body";
import { FIELD, FOCUS, LABEL, toggleKey } from "@/components/ui/styles";
import { pendingFields } from "@/services/document-text";

/* O texto do documento (ou do modelo) com a prévia ao lado, como vai sair no PDF, atualizando
   enquanto se digita. Na tela larga os dois lado a lado; no celular, teclas "Texto | Prévia".
   O textarea continua sendo um campo comum do formulário: quem salva é a action da página. */

type Props = {
  name: string;
  label: string;
  defaultValue: string;
  rows: number;
  maxLength: number;
  /** modelo: os {campos} são o esperado, e o aviso é o campo que a ficha não conhece.
      documento (sem `knownFields`): todo {campo} que sobrou é pendência. */
  knownFields?: string[];
};

function FieldsNote({ body, knownFields }: { body: string; knownFields?: string[] }) {
  const fields = pendingFields(body);
  const problem = knownFields ? fields.filter((field) => !knownFields.includes(field)) : fields;
  const list = (keys: string[]) => keys.map((key) => `{${key}}`).join(" ");

  if (problem.length > 0) {
    return (
      <p className="flex items-start gap-2 text-ui text-ink">
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2.25} aria-hidden />
        <span>
          {knownFields
            ? `${problem.length === 1 ? "Campo que a ficha não conhece" : "Campos que a ficha não conhece"} — vão ficar entre chaves: `
            : `${problem.length} ${problem.length === 1 ? "campo sem preencher" : "campos sem preencher"}: `}
          <span className="font-mono text-meta">{list(problem)}</span>
        </span>
      </p>
    );
  }

  return (
    <p className="flex items-center gap-2 text-ui text-ink/60">
      <Check className="h-4 w-4 shrink-0" strokeWidth={2.25} aria-hidden />
      {knownFields ? (fields.length ? `${fields.length} ${fields.length === 1 ? "campo" : "campos"} que a ficha preenche` : "Nenhum {campo} no texto") : "Nenhum campo pendente"}
    </p>
  );
}

export function BodyEditor({ name, label, defaultValue, rows, maxLength, knownFields }: Props) {
  const id = useId();
  const [body, setBody] = useState(defaultValue);
  const [view, setView] = useState<"text" | "preview">("text");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <label htmlFor={id} className={LABEL}>
          {label}
        </label>
        <div role="group" aria-label="Mostrar" className="flex gap-2 pb-1 lg:hidden">
          <button type="button" aria-pressed={view === "text"} onClick={() => setView("text")} className={toggleKey(view === "text", FOCUS)}>
            Texto
          </button>
          <button type="button" aria-pressed={view === "preview"} onClick={() => setView("preview")} className={toggleKey(view === "preview", FOCUS)}>
            Prévia
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* `[&_textarea]`: o FIELD fixa 16px; o editor pede a letra menor e mono, e o seletor mais
            específico ganha sem duas classes de tamanho brigando na mesma string */}
        <div className={`[&_textarea]:font-mono [&_textarea]:text-ui [&_textarea]:leading-relaxed ${view === "preview" ? "max-lg:hidden" : ""}`}>
          <textarea
            id={id}
            name={name}
            required
            rows={rows}
            maxLength={maxLength}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className={`${FIELD} resize-y`}
          />
        </div>

        {/* a prévia acompanha a rolagem e rola por dentro quando o texto é maior que a tela */}
        <div className={view === "text" ? "max-lg:hidden" : ""}>
          <section
            aria-label="Prévia"
            className="overflow-y-auto border border-ink/15 bg-white px-6 py-8 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:px-8"
          >
            <DocumentBody body={body} markFields />
          </section>
        </div>
      </div>

      <FieldsNote body={body} knownFields={knownFields} />
    </div>
  );
}
