import { Badge } from "./style";
import type { StatusBadgeProps } from "./types";

const labelMap: Record<string, string> = {
  novo: "Novo",
  em_analise: "Em análise",
  confirmado: "Confirmado",
  cancelado: "Cancelado",
  finalizado: "Finalizado",
};

type StatusTone = "novo" | "em_analise" | "confirmado" | "cancelado" | "finalizado";

export function StatusBadge({ status }: StatusBadgeProps) {
  const safeStatus: StatusTone = status in labelMap ? (status as StatusTone) : "novo";

  return <Badge $status={safeStatus}>{labelMap[safeStatus]}</Badge>;
}
