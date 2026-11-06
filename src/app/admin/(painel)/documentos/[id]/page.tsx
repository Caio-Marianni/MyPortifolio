import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Lock, Printer } from "lucide-react";
import { DeleteConfirm } from "@/components/admin/delete-confirm";
import { DocStatusBadge } from "@/components/admin/documents/doc-status";
import { DocumentBody } from "@/components/admin/documents/document-body";
import { Field, FormError, TextArea } from "@/components/admin/fields";
import { PageHeader } from "@/components/admin/page-header";
import { BUTTON, BUTTON_SOLID, CARD, CARD_TITLE } from "@/components/admin/styles";
import { requireAdmin } from "@/services/admin-session";
import { br, todayInBrazil } from "@/services/dates";
import { DOC_KIND_LABEL, DOC_LIMITS, getDocument, type Document } from "@/services/documents";
import { readId } from "@/services/form-input";
import { markSent, removeDocument, saveDocument, sign } from "../actions";

/* Um documento: texto editável enquanto é rascunho, e o caminho até a assinatura —
   rascunho → enviado → assinado. Assinado trava: some o formulário, e o banco recusa mudança. */
export const metadata: Metadata = { title: "Documento" };

const PAGE = "/admin/documentos";

/** O que fazer agora, conforme a situação do documento. */
function Next({ doc, excluindo }: { doc: Document; excluindo: boolean }) {
  if (doc.status === "signed") {
    return (
      <div className="flex flex-col gap-3 text-[14px]">
        <p className="flex items-center gap-2 font-semibold">
          <Lock className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          Assinado em {doc.signedOn && br(doc.signedOn)}
        </p>
        <p className="text-ink/65">Travado: o texto não muda mais. Mudança agora é um aditivo — um documento novo.</p>
        {doc.signedUrl && (
          <a href={doc.signedUrl} target="_blank" rel="noopener noreferrer" className={`${BUTTON} inline-flex items-center gap-2 self-start`}>
            Abrir PDF assinado
            <ExternalLink className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {doc.status === "draft" ? (
        <>
          <p className="text-[13.5px] leading-relaxed text-ink/65">
            Revise o texto, procure campos que ficaram entre chaves — {"{assim}"} — e gere o PDF. Depois de mandar ao cliente, marque como enviado.
          </p>
          <form action={markSent}>
            <input type="hidden" name="id" value={doc.id} />
            <input type="hidden" name="sent" value="1" />
            <button type="submit" className={BUTTON_SOLID}>
              Marcar como enviado
            </button>
          </form>
        </>
      ) : (
        <>
          <p className="text-[13.5px] leading-relaxed text-ink/65">
            Peça a assinatura pelo{" "}
            <a href="https://assinador.iti.br" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              assinador do gov.br
            </a>{" "}
            — grátis e com validade jurídica. Você e o cliente assinam o mesmo PDF. Precisa mudar o texto? Volte para rascunho.
          </p>
          <form action={markSent}>
            <input type="hidden" name="id" value={doc.id} />
            <input type="hidden" name="sent" value="0" />
            <button type="submit" className={BUTTON}>
              Voltar para rascunho
            </button>
          </form>
        </>
      )}

      {/* assinar vale também pro rascunho: contrato assinado em papel, na hora, por exemplo */}
      <form action={sign} className="flex flex-col gap-4 border-t border-ink/10 pt-5">
        <input type="hidden" name="id" value={doc.id} />
        <h3 className={CARD_TITLE}>Registrar assinatura</h3>
        <Field label="Assinado em" name="signedOn" type="date" required defaultValue={todayInBrazil()} />
        <Field label="Link do PDF assinado (Drive…) — opcional" name="signedUrl" type="url" placeholder="https://" maxLength={DOC_LIMITS.signedUrl} />
        <button type="submit" className={`${BUTTON} self-start`}>
          Assinado — travar documento
        </button>
      </form>

      <div className="border-t border-ink/10 pt-5">
        {excluindo ? (
          <DeleteConfirm action={removeDocument} fields={{ id: doc.id }} message="Exclui o documento." cancelHref={`${PAGE}/${doc.id}`} />
        ) : (
          <Link href={`${PAGE}/${doc.id}?excluir`} className="text-[12.5px] text-ink/50 hover:text-danger">
            Excluir documento
          </Link>
        )}
      </div>
    </div>
  );
}

type Params = { params: Promise<{ id: string }>; searchParams: Promise<{ erro?: string; excluir?: string }> };

export default async function DocumentoPage(props: Params) {
  await requireAdmin();
  const id = readId((await props.params).id);
  const searchParams = await props.searchParams;
  const doc = id ? await getDocument(id) : null;
  if (!doc) notFound();

  return (
    <>
      <PageHeader
        back={{ href: PAGE, label: "Documentos" }}
        title={doc.title}
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link href={`/admin/clientes/${doc.clientId}`} className="underline-offset-4 hover:underline">
              {doc.clientName}
            </Link>
            <span>{DOC_KIND_LABEL[doc.kind]}</span>
            <DocStatusBadge status={doc.status} />
          </span>
        }
        actions={
          <Link href={`/admin/imprimir/${doc.id}`} target="_blank" className={`${BUTTON_SOLID} inline-flex items-center gap-2`}>
            Ver PDF
            <Printer className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
          </Link>
        }
      />

      <div className="mb-6">
        <FormError message={searchParams.erro} />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {doc.status === "draft" ? (
          <form action={saveDocument} className={`${CARD} flex flex-col gap-5`}>
            <input type="hidden" name="id" value={doc.id} />
            <Field label="Título" name="title" required defaultValue={doc.title} maxLength={DOC_LIMITS.title} />
            <TextArea
              label="Texto — # título · ## seção · - item · **negrito**"
              name="body"
              required
              rows={28}
              defaultValue={doc.body}
              maxLength={DOC_LIMITS.body}
              className="[&_textarea]:font-mono [&_textarea]:text-[13.5px] [&_textarea]:leading-relaxed"
            />
            <button type="submit" className={`${BUTTON_SOLID} self-start`}>
              Salvar texto
            </button>
          </form>
        ) : (
          /* fora do rascunho o texto só se lê — na folha, como vai sair */
          <div className="overflow-x-auto border border-ink/15 bg-white px-6 py-8 md:px-12 md:py-12">
            <DocumentBody body={doc.body} />
          </div>
        )}

        <aside className={CARD}>
          <Next doc={doc} excluindo={searchParams.excluir !== undefined} />
        </aside>
      </div>
    </>
  );
}
