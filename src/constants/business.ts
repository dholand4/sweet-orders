export const STORE_NAME = "Dany Ruivo - Bolos e Tortas";
export const STORE_WHATSAPP =
  process.env.NEXT_PUBLIC_STORE_WHATSAPP ?? "5588999792427";

export const ORDER_STATUS_OPTIONS = [
  { value: "novo", label: "Novo" },
  { value: "confirmado", label: "Confirmado" },
  { value: "finalizado", label: "Finalizado" },
  { value: "cancelado", label: "Cancelado" },
] as const;

export const BUSINESS_NOTES = [
  "Taxa de entrega de R$5,00 para bairros distantes.",
  "Tema com papel fotografico R$5,00.",
  "Tema em 3D valor a combinar.",
];
