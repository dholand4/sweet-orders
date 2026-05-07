import { Badge } from "./style";
import type { StatusBadgeProps } from "./types";

const labelMap: Record<string, string> = {
  novo: "Novo",
  confirmado: "Confirmado",
  cancelado: "Cancelado",
  finalizado: "Finalizado",
};

type StatusTone = "novo" | "confirmado" | "cancelado" | "finalizado";

export function StatusBadge({ status }: StatusBadgeProps) {
  const safeStatus: StatusTone = status in labelMap ? (status as StatusTone) : "novo";

  return <Badge $status={safeStatus}>{labelMap[safeStatus]}</Badge>;
}
