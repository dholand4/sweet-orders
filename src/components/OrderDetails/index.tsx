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

export function OrderDetails({ order }: OrderDetailsProps) {
  if (!order) {
    return (
      <DetailsShell>
        <DetailsTitle>Selecione um pedido</DetailsTitle>
        <DetailsText>
          Clique em “Ver detalhes” para revisar o resumo completo, endereço e as
          preferências da cliente.
        </DetailsText>
      </DetailsShell>
    );
  }

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
          <DetailValue>{order.product_type?.name ?? "-"}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Tamanho</DetailLabel>
          <DetailValue>
            {order.product_size?.name ?? "-"}
            {order.product_size?.servings ? ` • ${order.product_size.servings}` : ""}
          </DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Sabor / Recheio / Cobertura</DetailLabel>
          <DetailValue>
            {order.flavor?.name ?? "-"} / {order.filling?.name ?? "-"} /{" "}
            {order.topping?.name ?? "-"}
          </DetailValue>
        </DetailItem>
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
        <DetailItem>
          <DetailLabel>Valor</DetailLabel>
          <DetailValue>{formatCurrencyBRL(order.total_price)}</DetailValue>
        </DetailItem>
      </DetailGrid>
    </DetailsShell>
  );
}
