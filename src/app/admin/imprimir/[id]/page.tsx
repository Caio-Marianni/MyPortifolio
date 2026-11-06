import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DocumentBody } from "@/components/admin/documents/document-body";
import { PrintButton } from "@/components/admin/print-button";
import { isAdmin, requireAdmin } from "@/services/admin-session";
import { getDocument } from "@/services/documents";
import { readId } from "@/services/form-input";

/* O documento numa folha A4, fora da casca do painel: o que aparece aqui é o que sai no PDF.
   As margens da folha moram no `@page` do globals.css; a barra de cima some na impressão. */

type Params = { params: Promise<{ id: string }> };

const load = async (props: Params) => {
  const id = readId((await props.params).id);
  return id ? getDocument(id) : null;
};

/* Título sem o sufixo do site: é ele que o navegador sugere como nome do PDF. A metadata roda à
   parte da página, então confere a sessão por conta própria — sem isso o título vazaria. */
export async function generateMetadata(props: Params): Promise<Metadata> {
  const doc = (await isAdmin()) ? await load(props).catch(() => null) : null;
  return { title: { absolute: doc?.title ?? "Documento" }, robots: { index: false, follow: false } };
}

export default async function ImprimirPage(props: Params) {
  await requireAdmin();
  const doc = await load(props);
  if (!doc) notFound();

  return (
    <main className="min-h-screen bg-surface-sunken py-8 print:bg-white print:py-0">
      <div className="mx-auto mb-6 flex max-w-[210mm] flex-wrap items-center justify-between gap-3 px-4 font-inter text-ink print:hidden">
        <Link href={`/admin/documentos/${doc.id}`} className="inline-flex items-center gap-1.5 text-ui text-ink/70 hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
          Voltar ao documento
        </Link>
        <PrintButton />
      </div>

      <article className="mx-auto min-h-[297mm] max-w-[210mm] bg-white px-[18mm] py-[20mm] shadow-[0_2px_24px_rgba(0,0,0,0.12)] print:min-h-0 print:max-w-none print:p-0 print:shadow-none">
        <DocumentBody body={doc.body} />
      </article>
    </main>
  );
}
