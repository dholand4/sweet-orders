"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminOrder } from "@/@types/orders";
import { ORDER_STATUS_OPTIONS } from "@/constants/business";
import {
  buildConfirmOrderMessage,
  buildOrderSummary,
  buildQuestionOrderMessage,
  buildWhatsAppLink,
  formatCurrencyBRL,
  formatDateBR,
  formatTimeBR,
} from "@/utils/format";
import { OrderDetails } from "@/components/OrderDetails";
import { StatusBadge } from "@/components/StatusBadge";
import {
  ActionButton,
  Actions,
  CustomerName,
  EmptyState,
  FilterLink,
  Filters,
  Layout,
  MetaText,
  OrdersShell,
  SelectWrap,
  StatusSelect,
  Table,
  TableWrap,
} from "./style";
import type { OrdersTableProps } from "./types";

export function OrdersTable({ orders, selectedStatus }: OrdersTableProps) {
  const router = useRouter();
  const [activeOrder, setActiveOrder] = useState<AdminOrder | null>(orders[0] ?? null);
  const [loadingOrderId, setLoadingOrderId] = useState("");

  async function updateStatus(orderId: string, status: string) {
    setLoadingOrderId(orderId);

    try {
      await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setLoadingOrderId("");
    }
  }

  async function copySummary(order: AdminOrder) {
    await navigator.clipboard.writeText(buildOrderSummary(order));
  }

  if (!orders.length) {
    return <EmptyState>Nenhum pedido encontrado para este filtro.</EmptyState>;
  }

  return (
    <OrdersShell>
      <Filters>
        <FilterLink href="/admin/pedidos" $active={selectedStatus === "todos"}>
          Todos
        </FilterLink>
        {ORDER_STATUS_OPTIONS.map((option) => (
          <FilterLink
            key={option.value}
            href={`/admin/pedidos?status=${option.value}`}
            $active={selectedStatus === option.value}
          >
            {option.label}
          </FilterLink>
        ))}
      </Filters>

      <Layout>
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Pedido</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <CustomerName>{order.customer_name}</CustomerName>
                    <MetaText>{order.whatsapp}</MetaText>
                    <MetaText>
                      {formatDateBR(order.delivery_date)} às{" "}
                      {formatTimeBR(order.delivery_time)}
                    </MetaText>
                  </td>
                  <td>
                    <MetaText>{order.product_type?.name ?? "-"}</MetaText>
                    <MetaText>{order.product_size?.name ?? "-"}</MetaText>
                    <MetaText>{formatCurrencyBRL(order.total_price)}</MetaText>
                  </td>
                  <td>
                    <StatusBadge status={order.status} />
                    <SelectWrap>
                      <StatusSelect
                        value={order.status}
                        onChange={(event) => updateStatus(order.id, event.target.value)}
                        disabled={loadingOrderId === order.id}
                      >
                        {ORDER_STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </StatusSelect>
                    </SelectWrap>
                  </td>
                  <td>
                    <Actions>
                      <ActionButton type="button" onClick={() => setActiveOrder(order)} $secondary>
                        Ver detalhes
                      </ActionButton>
                      <ActionButton
                        as="a"
                        href={buildWhatsAppLink(order.whatsapp, buildConfirmOrderMessage(order))}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Confirmar pelo WhatsApp
                      </ActionButton>
                      <ActionButton
                        type="button"
                        onClick={() =>
                          window.open(
                            buildWhatsAppLink(order.whatsapp, buildQuestionOrderMessage(order)),
                            "_blank",
                            "noopener,noreferrer",
                          )
                        }
                        $secondary
                      >
                        Tirar dúvida
                      </ActionButton>
                      <ActionButton type="button" onClick={() => copySummary(order)} $secondary>
                        Copiar resumo
                      </ActionButton>
                    </Actions>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>

        <OrderDetails order={activeOrder} />
      </Layout>
    </OrdersShell>
  );
}
