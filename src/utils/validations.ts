import { z } from "zod";
import { ORDER_STATUS_OPTIONS } from "@/constants/business";

const statusValues = ORDER_STATUS_OPTIONS.map((s) => s.value) as [string, ...string[]];

export const orderFormSchema = z.object({
  customerName:        z.string().min(3, "Informe o nome completo."),
  whatsapp:            z.string().min(10, "Informe um WhatsApp válido."),
  productId:           z.string().uuid("Selecione o produto."),
  productSizeId:       z.string().uuid("Selecione o tamanho."),
  flavor1Id:           z.string().uuid("Selecione o sabor/recheio."),
  flavor2Id:           z.string().optional().default(""),
  topping1Id:          z.string().optional().default(""),
  toppingFlavor1Id:    z.string().optional().default(""),
  topping2Id:          z.string().optional().default(""),
  decorationStyleId:   z.string().optional().default(""),
  doughType:           z.enum(["massa_branca", "massa_chocolate"]).optional().default("massa_branca"),
  cep:                 z.string().optional().default(""),
  wantsTheme:          z.enum(["sim", "nao"]).optional().default("nao"),
  themeDescription:    z.string().max(240).optional().default(""),
  theme:               z.string().max(320).optional().default(""),
  notes:               z.string().max(500).optional().default(""),
  deliveryDate:        z.string().min(1, "Selecione a data de entrega."),
  deliveryTime:        z.string().min(1, "Selecione o horário de entrega."),
  street:              z.string().min(3, "Informe a rua."),
  number:              z.string().min(1, "Informe o número."),
  district:            z.string().min(2, "Informe o bairro."),
  city:                z.string().min(2, "Informe a cidade."),
  reference:           z.string().max(160).optional().default(""),
});

export const orderStatusSchema = z.object({
  status: z.enum(statusValues),
});

export const flavorOptionSchema = z.object({
  id:          z.string().uuid().optional(),
  name:        z.string().min(2, "Nome obrigatório."),
  type:        z.enum(["recheio", "cobertura", "ambos"]),
  description: z.string().max(200).optional().default(""),
  has_flavor:  z.boolean().optional().default(true),
  is_active:   z.boolean(),
  sort_order:  z.coerce.number().int().min(0).optional().default(0),
});

export const decorationStyleSchema = z.object({
  id:          z.string().uuid().optional(),
  name:        z.string().min(2, "Nome obrigatório."),
  price_type:  z.enum(["included", "fixed_extra", "negotiate"]),
  price_extra: z.coerce.number().min(0).nullable().optional(),
  description: z.string().max(300).optional().default(""),
  is_active:   z.boolean(),
  sort_order:  z.coerce.number().int().min(0).optional().default(0),
});

export const productSizeSchema = z.object({
  id:         z.string().uuid().optional(),
  name:       z.string().min(1, "Nome obrigatório."),
  servings:   z.string().optional().default(""),
  price:      z.coerce.number().min(0, "Preço inválido."),
  is_active:  z.boolean().optional().default(true),
  sort_order: z.coerce.number().int().min(0).optional().default(0),
});

export const productSchema = z.object({
  id:                    z.string().uuid().optional(),
  name:                  z.string().min(2, "Nome obrigatório."),
  type:                  z.enum(["bolo", "torta", "outro"]),
  description:           z.string().max(400).optional().default(""),
  image_url:             z.string().url("URL inválida.").optional().or(z.literal("")).default(""),
  max_flavors:           z.coerce.number().int().min(1).max(2),
  max_toppings:          z.coerce.number().int().min(0).max(2),
  allow_dough_choice:    z.boolean(),
  is_active:             z.boolean(),
  sort_order:            z.coerce.number().int().min(0).optional().default(0),
  sizes:                 z.array(productSizeSchema).optional().default([]),
  flavor_ids:            z.array(z.string().uuid()).optional().default([]),
  topping_ids:           z.array(z.string().uuid()).optional().default([]),
  decoration_style_ids:  z.array(z.string().uuid()).optional().default([]),
});
