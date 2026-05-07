import { formatCurrencyBRL, formatDateBR, formatTimeBR } from "@/utils/format";
import {
  DetailGrid,
  DetailItem,
  DetailLabel,
  DetailsShell,
  DetailsText,
  DetailsTitle,
  DetailValue,
} from "./style";
import type { OrderDetailsProps } from "./types";

const DOUGH_LABELS: Record<string, string> = {
  massa_branca:     "Massa branca",
  massa_chocolate:  "Massa de chocolate",
};

export function OrderDetails({ order }: OrderDetailsProps) {
  if (!order) {
    return (
      <DetailsShell>
        <DetailsTitle>Selecione um pedido</DetailsTitle>
        <DetailsText>
          Clique em "Ver detalhes" para revisar o resumo completo, endereço e as
          preferências da cliente.
        </DetailsText>
      </DetailsShell>
    );
  }

  const flavorsLine = [order.flavor_1?.name, order.flavor_2?.name]
    .filter(Boolean)
    .join(" + ") || "-";

  const toppingsLine = [order.topping_1?.name, order.topping_2?.name]
    .filter(Boolean)
    .join(" + ") || "-";

  return (
    <DetailsShell>
      <DetailsTitle>{order.customer_name}</DetailsTitle>
      <DetailGrid>
        <DetailItem>
          <DetailLabel>WhatsApp</DetailLabel>
          <DetailValue>{order.whatsapp}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Produto</DetailLabel>
          <DetailValue>{order.product?.name ?? "-"}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Tamanho</DetailLabel>
          <DetailValue>
            {order.product_size?.name ?? "-"}
            {order.product_size?.servings ? ` • ${order.product_size.servings}` : ""}
          </DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Recheio / Sabor</DetailLabel>
          <DetailValue>{flavorsLine}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Cobertura</DetailLabel>
          <DetailValue>{toppingsLine}</DetailValue>
        </DetailItem>
        {order.decoration_style && (
          <DetailItem>
            <DetailLabel>Estilo decorativo</DetailLabel>
            <DetailValue>
              {order.decoration_style.name}
              {order.decoration_style.price_type === "fixed_extra" && order.decoration_style.price_extra != null
                ? ` (+${formatCurrencyBRL(order.decoration_style.price_extra)})`
                : order.decoration_style.price_type === "negotiate"
                ? " (a combinar)"
                : ""}
            </DetailValue>
          </DetailItem>
        )}
        {order.dough_type && (
          <DetailItem>
            <DetailLabel>Massa</DetailLabel>
            <DetailValue>{DOUGH_LABELS[order.dough_type] ?? order.dough_type}</DetailValue>
          </DetailItem>
        )}
        <DetailItem>
          <DetailLabel>Tema</DetailLabel>
          <DetailValue>{order.theme || "-"}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Observações</DetailLabel>
          <DetailValue>{order.notes || "-"}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Entrega</DetailLabel>
          <DetailValue>
            {formatDateBR(order.delivery_date)} às {formatTimeBR(order.delivery_time)}
          </DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Endereço</DetailLabel>
          <DetailValue>
            {order.street}, {order.number}, {order.district}, {order.city}
            {order.reference ? ` • Ref.: ${order.reference}` : ""}
          </DetailValue>
        </DetailItem>
        {order.cep && (
          <DetailItem>
            <DetailLabel>CEP</DetailLabel>
            <DetailValue>{order.cep}</DetailValue>
          </DetailItem>
        )}
        <DetailItem>
          <DetailLabel>Valor</DetailLabel>
          <DetailValue>{formatCurrencyBRL(order.total_price)}</DetailValue>
        </DetailItem>
      </DetailGrid>
    </DetailsShell>
  );
}
