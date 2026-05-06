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
  return value.replace(/\D/g, "");
}

export function buildWhatsAppLink(phone: string, message: string) {
  return `https://wa.me/${normalizeWhatsApp(phone)}?text=${encodeURIComponent(message)}`;
}

export function buildStoreWhatsAppLink(message: string) {
  return buildWhatsAppLink(STORE_WHATSAPP, message);
}

export function buildOrderSummary(order: AdminOrder) {
  return [
    `Produto: ${order.product_type?.name ?? "-"}`,
    `Tamanho: ${order.product_size?.name ?? "-"}`,
    `Sabor: ${order.flavor?.name ?? "-"}`,
    `Recheio: ${order.filling?.name ?? "-"}`,
    `Cobertura/estilo: ${order.topping?.name ?? "-"}`,
    `Tema: ${order.theme || "-"}`,
    `Data: ${formatDateBR(order.delivery_date)}`,
    `Hora: ${formatTimeBR(order.delivery_time)}`,
    `Endereço: ${order.street}, ${order.number}, ${order.district}, ${order.city}`,
    `Valor: ${formatCurrencyBRL(order.total_price)}`,
  ].join("\n");
}

export function buildConfirmOrderMessage(order: AdminOrder) {
  return `Olá, ${order.customer_name}! Recebemos seu pedido na Dany Ruivo Bolos e Tortas.

Resumo:
Produto: ${order.product_type?.name ?? "-"}
Tamanho: ${order.product_size?.name ?? "-"}
Sabor: ${order.flavor?.name ?? "-"}
Recheio: ${order.filling?.name ?? "-"}
Cobertura/estilo: ${order.topping?.name ?? "-"}
Tema: ${order.theme || "-"}
Data: ${formatDateBR(order.delivery_date)}
Hora: ${formatTimeBR(order.delivery_time)}
Endereço: ${order.street}, ${order.number}, ${order.district}, ${order.city}
Valor: ${formatCurrencyBRL(order.total_price)}

Podemos confirmar seu pedido?`;
}

export function buildQuestionOrderMessage(order: AdminOrder) {
  return `Olá, ${order.customer_name}! Aqui é da Dany Ruivo Bolos e Tortas. Ficamos com uma dúvida sobre seu pedido:

${buildOrderSummary(order)}

Pode falar com a gente por aqui?`;
}
