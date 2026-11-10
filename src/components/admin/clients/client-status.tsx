import { Badge } from "@/components/admin/badge";

/** A situação do cliente numa palavra, na lista e no topo da ficha: atraso manda, depois
    contrato ativo (plano ativo ou projeto aprovado/em andamento). */
export function ClientStatus({ overdue, active }: { overdue: boolean; active: boolean }) {
  if (overdue) return <Badge tone="danger">Atrasado</Badge>;
  if (active) return <Badge tone="ok">Em dia</Badge>;
  return <Badge>Sem contrato ativo</Badge>;
}
