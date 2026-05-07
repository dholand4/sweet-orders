import { STORE_WHATSAPP } from "@/constants/business";
import type { AdminOrder } from "@/@types/orders";

export function formatCurrencyBRL(value: number | string | null | undefined) {
  const numericValue = Number(value ?? 0);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericValue);
}

export function formatDateBR(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(new Date(`${date}T00:00:00`));
}

export function formatTimeBR(time: string) {
  return time.slice(0, 5);
}

export function normalizeWhatsApp(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("55")) return digits;
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  return digits;
}

export function buildWhatsAppLink(phone: string, message: string) {
  return `https://wa.me/${normalizeWhatsApp(phone)}?text=${encodeURIComponent(message)}`;
}

export function buildStoreWhatsAppLink(message: string) {
  return buildWhatsAppLink(STORE_WHATSAPP, message);
}

function getFlavorsLine(order: AdminOrder): string {
  const parts = [order.flavor_1?.name, order.flavor_2?.name].filter(Boolean);
  return parts.length ? parts.join(" + ") : "-";
}

function getToppingsLine(order: AdminOrder): string {
  const parts = [order.topping_1?.name, order.topping_2?.name].filter(Boolean);
  return parts.length ? parts.join(" + ") : "-";
}

function getDoughLabel(order: AdminOrder): string {
  if (!order.dough_type) return "";
  return order.dough_type === "massa_chocolate" ? "Massa de chocolate" : "Massa branca";
}

export function buildOrderSummary(order: AdminOrder) {
  const lines = [
    `Produto: ${order.product?.name ?? "-"}`,
    `Tamanho: ${order.product_size?.name ?? "-"}`,
    `Sabor/Recheio: ${getFlavorsLine(order)}`,
    `Cobertura: ${getToppingsLine(order)}`,
  ];

  const dough = getDoughLabel(order);
  if (dough) lines.push(`Massa: ${dough}`);

  if (order.theme) lines.push(`Tema: ${order.theme}`);
  if (order.notes) lines.push(`Obs: ${order.notes}`);

  lines.push(
    `Entrega: ${formatDateBR(order.delivery_date)} às ${formatTimeBR(order.delivery_time)}`,
    `Endereço: ${order.street}, ${order.number} - ${order.district}, ${order.city}`,
    `Valor: ${formatCurrencyBRL(order.total_price)}`,
  );

  return lines.join("\n");
}

export function buildConfirmOrderMessage(order: AdminOrder) {
  return `Olá, ${order.customer_name}! Recebemos seu pedido na Dany Ruivo Bolos e Tortas.

Resumo:
${buildOrderSummary(order)}

Podemos confirmar seu pedido?`;
}

export function buildQuestionOrderMessage(order: AdminOrder) {
  return `Olá, ${order.customer_name}! Aqui é da Dany Ruivo Bolos e Tortas. Ficamos com uma dúvida sobre seu pedido:

${buildOrderSummary(order)}

Pode falar com a gente por aqui?`;
}
