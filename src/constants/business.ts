export const STORE_NAME = "Dany Ruivo - Bolos e Tortas";
export const STORE_WHATSAPP =
  process.env.NEXT_PUBLIC_STORE_WHATSAPP ?? "5588999792427";

export const ORDER_STATUS_OPTIONS = [
  { value: "novo", label: "Novo" },
  { value: "em_analise", label: "Em análise" },
  { value: "confirmado", label: "Confirmado" },
  { value: "cancelado", label: "Cancelado" },
  { value: "finalizado", label: "Finalizado" },
] as const;

export const BUSINESS_NOTES = [
  "Taxa de entrega de R$5,00 para bairros distantes.",
  "Tema com papel fotográfico R$5,00.",
  "Tema em 3D valor a combinar.",
];
