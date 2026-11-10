import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DocStatusBadge } from "@/components/admin/documents/doc-status";
import { NUM, ROW_FOCUS } from "@/components/ui/styles";
import { DOC_KIND_LABEL, type Document } from "@/services/documents";

/* A mesma lista da de clientes (clients/client-list.tsx): a linha inteira é o link para o
   documento, e no celular cada uma vira cartão. */
const COLUMNS = "md:grid md:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)_100px_130px_96px_16px] md:items-center md:gap-x-4";

export function DocumentList({ docs }: { docs: Document[] }) {
  return (
    /* o fundo do CARD sem o padding dele: as linhas vão rentes à borda */
    <div className="bg-paper">
      <div className={`hidden border-b border-ink/15 px-5 py-3 font-mono text-meta uppercase tracking-[0.06em] text-ink/60 ${COLUMNS}`} aria-hidden>
        <span>Documento</span>
        <span>Cliente</span>
        <span>Tipo</span>
        <span>Situação</span>
        <span>Atualizado</span>
      </div>
      <ul className="divide-y divide-ink/10">
        {docs.map((doc) => (
          <li key={doc.id}>
            <Link
              href={`/admin/documentos/${doc.id}`}
              className={`group flex flex-wrap items-center gap-x-3 gap-y-1.5 px-5 py-4 text-ui transition-colors hover:bg-ink/[0.04] md:py-3 ${COLUMNS} ${ROW_FOCUS}`}
            >
              <span className="min-w-0 flex-1 truncate font-semibold group-hover:underline group-hover:underline-offset-4">{doc.title}</span>
              <span className="flex flex-wrap gap-x-4 gap-y-0.5 text-meta text-ink/65 max-md:order-last max-md:basis-full md:contents md:text-ui">
                <span className="truncate md:text-ink/75">{doc.clientName}</span>
                <span className="md:text-ink/75">{DOC_KIND_LABEL[doc.kind]}</span>
                <span className={`${NUM} md:order-last md:text-ink/60`}>{doc.updatedAt}</span>
              </span>
              <span>
                <DocStatusBadge status={doc.status} />
              </span>
              <ChevronRight
                className="h-4 w-4 text-ink/30 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-ink max-md:hidden md:order-last"
                strokeWidth={2}
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
