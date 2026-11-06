import { Badge, type Tone } from "@/components/admin/badge";
import { DOC_STATUS_LABEL, type DocStatus } from "@/services/documents";

/* enviado é a sua vez de cobrar a assinatura; assinado é resolvido */
const TONE: Record<DocStatus, Tone> = { draft: "neutral", sent: "accent", signed: "ok" };

export function DocStatusBadge({ status }: { status: DocStatus }) {
  return <Badge tone={TONE[status]}>{DOC_STATUS_LABEL[status]}</Badge>;
}
