export const STORE_NAME = "Dany Ruivo - Bolos e Tortas";
export const STORE_WHATSAPP =
  process.env.NEXT_PUBLIC_STORE_WHATSAPP ?? "5588999792427";

export const ORDER_STATUS_OPTIONS = [
  { value: "novo",       label: "Novo",       color: "#3b82f6" },
  { value: "confirmado", label: "Confirmado", color: "#f59e0b" },
  { value: "finalizado", label: "Finalizado", color: "#10b981" },
  { value: "cancelado",  label: "Cancelado",  color: "#ef4444" },
] as const;

export const PRODUCT_TYPE_LABELS: Record<string, string> = {
  bolo:  "Bolo",
  torta: "Torta",
  outro: "Outro",
};

export const FLAVOR_TYPE_LABELS: Record<string, string> = {
  recheio:  "Recheio",
  cobertura: "Cobertura",
  ambos:     "Recheio e Cobertura",
};

export const BUSINESS_NOTES = [
  "Taxa de entrega de R$5,00 para bairros distantes.",
  "Tema com papel fotográfico: R$5,00 a mais.",
  "Tema em 3D: valor a combinar.",
  "Pedidos com prazo mínimo de 3 dias úteis.",
];
