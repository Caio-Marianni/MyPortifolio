import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, ExternalLink, Lock, Printer, Send, Signature, Trash2, TriangleAlert, Undo2 } from "lucide-react";
import { DeleteConfirm } from "@/components/admin/delete-confirm";
import { BodyEditor } from "@/components/admin/documents/body-editor";
import { DocumentBody } from "@/components/admin/documents/document-body";
import { Field, FormError } from "@/components/admin/fields";
import { IconLink } from "@/components/admin/icon-link";
import { PageHeader } from "@/components/admin/page-header";
import { Steps } from "@/components/admin/steps";
import { BUTTON, BUTTON_SOLID, CARD, CARD_TITLE } from "@/components/ui/styles";
import { requireAdmin } from "@/services/admin-session";
import { br, todayInBrazil } from "@/services/dates";
import { DOC_KIND_LABEL, DOC_LIMITS, DOC_STATUSES, DOC_STATUS_LABEL, getDocument, pendingFields, type Document } from "@/services/documents";
import { readId } from "@/services/form-input";
import { markSent, removeDocument, saveDocument, sign } from "../actions";

/* Um documento: texto editável enquanto é rascunho, e o caminho até a assinatura —
   rascunho → enviado → assinado, na trilha do topo. Assinado trava: some o formulário, e o banco
   recusa mudança. */
export const metadata: Metadata = { title: "Documento" };

const PAGE = "/admin/documentos";
const ICON = "h-4 w-4";

/** Registrar a assinatura. Vale também para o rascunho: contrato assinado em papel, na hora. */
function SignForm({ doc }: { doc: Document }) {
  return (
    <form action={sign} className="grid items-end gap-4 sm:grid-cols-[180px_minmax(0,1fr)_auto]">
      <input type="hidden" name="id" value={doc.id} />
      <Field label="Assinado em" name="signedOn" type="date" required defaultValue={todayInBrazil()} />
      <Field label="Link do PDF assinado (Drive…) — opcional" name="signedUrl" type="url" placeholder="https://" maxLength={DOC_LIMITS.signedUrl} />
      <button type="submit" className={`${BUTTON_SOLID} sm:min-h-[46px]`}>
        <Signature className={ICON} strokeWidth={2.25} aria-hidden />
        Assinado — travar
      </button>
    </form>
  );
}

/** A trilha e o que fazer agora, conforme a situação. */
function Status({ doc }: { doc: Document }) {
  const pending = doc.status === "draft" ? pendingFields(doc.body) : [];

  return (
    <section className={`${CARD} mb-6 flex flex-col gap-5`}>
      <Steps label="Situação do documento" steps={DOC_STATUSES.map((status) => DOC_STATUS_LABEL[status])} current={DOC_STATUSES.indexOf(doc.status)} />

      {doc.status === "signed" && (
        <div className="flex flex-wrap items-center justify-between gap-4 text-ui">
          <p className="flex items-center gap-2">
            <Lock className={ICON} strokeWidth={2.5} aria-hidden />
            <span>
              <span className="font-semibold">Assinado em {doc.signedOn && br(doc.signedOn)}.</span>{" "}
              <span className="text-ink/65">O texto não muda mais — mudança agora é um aditivo, um documento novo.</span>
            </span>
          </p>
          {doc.signedUrl && (
            <a href={doc.signedUrl} target="_blank" rel="noopener noreferrer" className={BUTTON_SOLID}>
              Abrir PDF assinado
              <ExternalLink className={ICON} strokeWidth={2.25} aria-hidden />
            </a>
          )}
        </div>
      )}

      {doc.status === "draft" && (
        <>
          {/* o aviso vem antes do botão de enviar: campo entre chaves num contrato é o erro que
              mais passa batido, e daqui em diante o texto só muda voltando para rascunho */}
          {pending.length > 0 && (
            <p className="flex items-start gap-2 border-l-2 border-accent bg-sheet px-4 py-3 text-ui">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2.25} aria-hidden />
              <span>
                <span className="font-semibold">
                  {pending.length} {pending.length === 1 ? "campo ficou sem preencher" : "campos ficaram sem preencher"}:
                </span>{" "}
                <span className="font-mono text-meta">{pending.map((key) => `{${key}}`).join(" ")}</span>
                <span className="block text-ink/65">Complete no texto abaixo — eles aparecem marcados na prévia.</span>
              </span>
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-[62ch] text-ui leading-relaxed text-ink/65">
              Revise o texto e gere o PDF. Depois de mandar ao cliente, marque como enviado.
            </p>
            <form action={markSent}>
              <input type="hidden" name="id" value={doc.id} />
              <input type="hidden" name="sent" value="1" />
              <button type="submit" className={BUTTON_SOLID}>
                <Send className={ICON} strokeWidth={2.25} aria-hidden />
                {pending.length > 0 ? "Marcar como enviado mesmo assim" : "Marcar como enviado"}
              </button>
            </form>
          </div>
        </>
      )}

      {doc.status === "sent" && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-[62ch] text-ui leading-relaxed text-ink/65">
            Peça a assinatura pelo{" "}
            <a href="https://assinador.iti.br" target="_blank" rel="noopener noreferrer" className="font-semibold text-ink underline underline-offset-4">
              assinador do gov.br
            </a>{" "}
            — grátis e com validade jurídica. Você e o cliente assinam o mesmo PDF.
          </p>
          <form action={markSent}>
            <input type="hidden" name="id" value={doc.id} />
            <input type="hidden" name="sent" value="0" />
            <button type="submit" className={BUTTON}>
              <Undo2 className={ICON} strokeWidth={2.25} aria-hidden />
              Voltar para rascunho
            </button>
          </form>
        </div>
      )}

      {/* Enviado: assinar é o próximo passo, então o formulário já vem aberto. No rascunho fica
          fechado — é o atalho do contrato assinado em papel. */}
      {doc.status !== "signed" && (
        <details open={doc.status === "sent"} className="group border-t border-ink/10 pt-4">
          <summary className={`${CARD_TITLE} flex cursor-pointer list-none items-center gap-2 hover:text-ink [&::-webkit-details-marker]:hidden`}>
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-open:rotate-90" strokeWidth={2.5} aria-hidden />
            Registrar assinatura
          </summary>
          <div className="pt-4">
            <SignForm doc={doc} />
          </div>
        </details>
      )}
    </section>
  );
}

type Params = { params: Promise<{ id: string }>; searchParams: Promise<{ erro?: string; excluir?: string }> };

export default async function DocumentoPage(props: Params) {
  await requireAdmin();
  const id = readId((await props.params).id);
  const searchParams = await props.searchParams;
  const doc = id ? await getDocument(id) : null;
  if (!doc) notFound();
  const page = `${PAGE}/${doc.id}`;

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
            <span aria-hidden>·</span>
            <span>{DOC_KIND_LABEL[doc.kind]}</span>
            <span aria-hidden>·</span>
            <span>atualizado {doc.updatedAt}</span>
          </span>
        }
        actions={
          <>
            <Link href={`/admin/imprimir/${doc.id}`} target="_blank" className={BUTTON}>
              <Printer className={ICON} strokeWidth={2.25} aria-hidden />
              Ver PDF
            </Link>
            {doc.status !== "signed" && <IconLink href={`${page}?excluir`} label="Excluir documento" icon={Trash2} danger />}
          </>
        }
      />

      {searchParams.excluir !== undefined && doc.status !== "signed" && (
        <div className={`${CARD} mb-6 border-l-2 border-danger`}>
          <DeleteConfirm action={removeDocument} fields={{ id: doc.id }} message="Exclui o documento." cancelHref={page} />
        </div>
      )}

      {searchParams.erro && (
        <div className="mb-6">
          <FormError message={searchParams.erro} />
        </div>
      )}

      <Status doc={doc} />

      {doc.status === "draft" ? (
        <form action={saveDocument} className={`${CARD} flex flex-col gap-5`}>
          <input type="hidden" name="id" value={doc.id} />
          <Field label="Título" name="title" required defaultValue={doc.title} maxLength={DOC_LIMITS.title} />
          <BodyEditor name="body" label="Texto — # título · ## seção · - item · **negrito**" defaultValue={doc.body} rows={28} maxLength={DOC_LIMITS.body} />
          <button type="submit" className={`${BUTTON_SOLID} self-start`}>
            <Check className={ICON} strokeWidth={2.5} aria-hidden />
            Salvar texto
          </button>
        </form>
      ) : (
        /* fora do rascunho o texto só se lê — na folha, como vai sair */
        <div className="mx-auto max-w-[840px] overflow-x-auto border border-ink/15 bg-white px-6 py-8 md:px-12 md:py-12">
          <DocumentBody body={doc.body} />
        </div>
      )}
    </>
  );
}
