import { z } from "zod";
import { ORDER_STATUS_OPTIONS } from "@/constants/business";

const statusValues = ORDER_STATUS_OPTIONS.map((status) => status.value) as [
  string,
  ...string[],
];

export const orderFormSchema = z.object({
  customerName: z.string().min(3, "Informe o nome completo."),
  whatsapp: z.string().min(10, "Informe um WhatsApp valido."),
  productTypeId: z.string().uuid("Selecione o tipo de produto."),
  productSizeId: z.string().uuid("Selecione o tamanho."),
  flavorId: z.string().uuid("Selecione o sabor."),
  fillingId: z.string().uuid("Selecione o recheio."),
  toppingId: z.string().uuid("Selecione a cobertura."),
  cep: z.string().optional().default(""),
  wantsTheme: z.enum(["sim", "nao"]).optional().default("nao"),
  themeStyle: z.string().max(120, "Estilo de tema muito longo.").optional().default(""),
  themeDescription: z
    .string()
    .max(240, "Descricao de tema muito longa.")
    .optional()
    .default(""),
  theme: z.string().max(320, "Tema muito longo.").optional().default(""),
  notes: z.string().max(500, "Observacoes muito longas.").optional().default(""),
  deliveryDate: z.string().min(1, "Selecione a data de entrega."),
  deliveryTime: z.string().min(1, "Selecione o horario de entrega."),
  street: z.string().min(3, "Informe a rua."),
  number: z.string().min(1, "Informe o numero."),
  district: z.string().min(2, "Informe o bairro."),
  city: z.string().min(2, "Informe a cidade."),
  reference: z
    .string()
    .max(160, "Referencia muito longa.")
    .optional()
    .default(""),
});

export const orderStatusSchema = z.object({
  status: z.enum(statusValues),
});

export const optionMutationSchema = z.discriminatedUnion("entity", [
  z.object({
    entity: z.literal("product_types"),
    id: z.string().uuid().optional(),
    name: z.string().min(2, "Nome obrigatorio."),
    slug: z.string().min(2, "Slug obrigatorio."),
    active: z.boolean(),
  }),
  z.object({
    entity: z.literal("flavors"),
    id: z.string().uuid().optional(),
    name: z.string().min(2, "Nome obrigatorio."),
    active: z.boolean(),
  }),
  z.object({
    entity: z.literal("fillings"),
    id: z.string().uuid().optional(),
    name: z.string().min(2, "Nome obrigatorio."),
    active: z.boolean(),
  }),
  z.object({
    entity: z.literal("toppings"),
    id: z.string().uuid().optional(),
    name: z.string().min(2, "Nome obrigatorio."),
    active: z.boolean(),
  }),
]);

export const productSizeMutationSchema = z.object({
  entity: z.literal("product_sizes"),
  id: z.string().uuid().optional(),
  productTypeId: z.string().uuid("Tipo obrigatorio."),
  name: z.string().min(2, "Nome obrigatorio."),
  servings: z.string().optional().default(""),
  price: z.coerce.number().min(0, "Preco invalido."),
  active: z.boolean(),
});
