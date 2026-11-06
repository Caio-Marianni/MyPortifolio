import type { Metadata } from "next";
import Link from "next/link";
import { DocStatusBadge } from "@/components/admin/documents/doc-status";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { PageHeader } from "@/components/admin/page-header";
import { BUTTON, CARD, NUM } from "@/components/admin/styles";
import { requireAdmin } from "@/services/admin-session";
import { DOC_KIND_LABEL, DOC_STATUSES, DOC_STATUS_LABEL, listDocuments } from "@/services/documents";

/* Todos os documentos, de todos os clientes. Gerar um novo é pela ficha do cliente — é lá que
   estão os dados que o modelo pede. */
export const metadata: Metadata = { title: "Documentos" };

const PAGE = "/admin/documentos";

type Params = { searchParams: Promise<{ ver?: string }> };

export default async function DocumentosPage(props: Params) {
  await requireAdmin();
  const { ver: param } = await props.searchParams;

  const docs = await listDocuments().catch((error: unknown) => {
    console.error("[admin] falha ao ler documentos:", error);
    return null;
  });
  const all = docs ?? [];
  const ver = DOC_STATUSES.find((status) => status === param) ?? "todos";
  const shown = ver === "todos" ? all : all.filter((doc) => doc.status === ver);

  return (
    <>
      <PageHeader
        title="Documentos"
        description="Propostas e contratos. Gere um novo pela ficha do cliente."
        actions={
          <Link href={`${PAGE}/modelos`} className={BUTTON}>
            Modelos
          </Link>
        }
      />

      <FilterTabs
        base={PAGE}
        current={ver}
        options={[
          { value: "todos", label: "Todos", count: all.length },
          ...DOC_STATUSES.map((status) => ({
            value: status,
            label: DOC_STATUS_LABEL[status],
            count: all.filter((doc) => doc.status === status).length,
          })),
        ]}
      />

      {docs === null && (
        <p role="alert" className="text-[13px] text-danger">
          Não consegui ler os documentos. A tabela foi criada? Rode `npm run migrate`.
        </p>
      )}

      {docs !== null && shown.length === 0 && (
        <p className="text-[14px] text-ink/60">
          {all.length === 0 ? "Nenhum documento ainda. Crie um modelo e gere o documento pela ficha do cliente." : "Nada neste filtro."}
        </p>
      )}

      {shown.length > 0 && (
        <div className={`${CARD} overflow-x-auto p-0 md:p-0`}>
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead className="border-b border-ink/10 text-[12.5px] text-ink/60">
              <tr>
                <th className="px-5 py-3 font-normal">Documento</th>
                <th className="px-5 py-3 font-normal">Cliente</th>
                <th className="px-5 py-3 font-normal">Tipo</th>
                <th className="px-5 py-3 font-normal">Situação</th>
                <th className="px-5 py-3 font-normal">Atualizado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {shown.map((doc) => (
                <tr key={doc.id} className="hover:bg-ink/[0.03]">
                  <td className="px-5 py-3">
                    <Link href={`${PAGE}/${doc.id}`} className="font-semibold underline-offset-4 hover:underline">
                      {doc.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <Link href={`/admin/clientes/${doc.clientId}`} className="text-ink/75 underline-offset-4 hover:underline">
                      {doc.clientName}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-ink/75">{DOC_KIND_LABEL[doc.kind]}</td>
                  <td className="px-5 py-3">
                    <DocStatusBadge status={doc.status} />
                  </td>
                  <td className={`px-5 py-3 text-ink/60 ${NUM}`}>{doc.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
