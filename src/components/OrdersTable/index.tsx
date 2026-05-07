"use client";

import { useMemo, useState } from "react";
import type { AdminOrder } from "@/@types/orders";
import { OrderDetails } from "@/components/OrderDetails";
import { StatusBadge } from "@/components/StatusBadge";
import { ORDER_STATUS_OPTIONS } from "@/constants/business";
import {
  buildConfirmOrderMessage,
  buildOrderSummary,
  buildWhatsAppLink,
  formatCurrencyBRL,
  formatDateBR,
  formatTimeBR,
} from "@/utils/format";
import {
  ActionButton,
  Actions,
  ClearDateButton,
  ConfirmText,
  CustomerName,
  DateField,
  DateFilters,
  DateInput,
  EmptyState,
  EmptyStateLabel,
  FilterButton,
  FilterIcon,
  FilterText,
  FiltersPanel,
  Filters,
  MetaText,
  MobileActions,
  MobileBody,
  MobileCard,
  MobileFooter,
  MobileHeader,
  MobileLabel,
  MobileList,
  MobileRow,
  MobileValue,
  ModalActions,
  ModalCard,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  OrdersShell,
  SelectWrap,
  StatusSelect,
  Table,
  TableStage,
  TableWrap,
} from "./style";
import type { OrdersTableProps } from "./types";

type StatusOptionValue = (typeof ORDER_STATUS_OPTIONS)[number]["value"];

function getAllowedNextStatuses(currentStatus: string) {
  if (currentStatus === "novo") {
    return ["novo", "confirmado", "cancelado"] as StatusOptionValue[];
  }

  if (currentStatus === "confirmado") {
    return ["confirmado", "finalizado", "cancelado"] as StatusOptionValue[];
  }

  if (currentStatus === "cancelado") {
    return ["cancelado"] as StatusOptionValue[];
  }

  if (currentStatus === "finalizado") {
    return ["finalizado"] as StatusOptionValue[];
  }

  return ["novo"] as StatusOptionValue[];
}

function needsPrettyConfirmation(currentStatus: string, nextStatus: string) {
  return currentStatus !== nextStatus && (nextStatus === "cancelado" || nextStatus === "finalizado");
}

export function OrdersTable({ orders, selectedStatus }: OrdersTableProps) {
  const [activeOrder, setActiveOrder] = useState<AdminOrder | null>(null);
  const [loadingOrderId, setLoadingOrderId] = useState("");
  const [currentStatus, setCurrentStatus] = useState(selectedStatus);
  const [selectedDate, setSelectedDate] = useState("");
  const [localOrders, setLocalOrders] = useState(orders);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    orderId: string;
    currentStatus: string;
    nextStatus: string;
  } | null>(null);

  const visibleOrders = useMemo(() => {
    if (currentStatus === "todos") {
      return localOrders.filter((order) =>
        selectedDate ? order.delivery_date === selectedDate : true,
      );
    }

    return localOrders.filter(
      (order) =>
        order.status === currentStatus &&
        (selectedDate ? order.delivery_date === selectedDate : true),
    );
  }, [currentStatus, localOrders, selectedDate]);

  const currentStatusLabel =
    currentStatus === "todos"
      ? "Todos os pedidos"
      : ORDER_STATUS_OPTIONS.find((option) => option.value === currentStatus)?.label ?? "Pedidos";

  function handleFilterChange(status: string) {
    setCurrentStatus(status);
  }

  async function persistStatusChange(orderId: string, status: string) {
    const previousOrders = localOrders;

    setLoadingOrderId(orderId);
    setLocalOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    );

    if (activeOrder?.id === orderId) {
      setActiveOrder({ ...activeOrder, status });
    }

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        throw new Error(payload.message || "Nao foi possivel atualizar o status.");
      }
    } catch (error) {
      setLocalOrders(previousOrders);

      if (activeOrder?.id === orderId) {
        const previousOrder = previousOrders.find((order) => order.id === orderId) ?? null;
        setActiveOrder(previousOrder);
      }

      window.alert(
        error instanceof Error
          ? error.message
          : "Nao foi possivel atualizar o status. Tente novamente.",
      );
    } finally {
      setLoadingOrderId("");
    }
  }

  function requestStatusChange(orderId: string, currentOrderStatus: string, nextStatus: string) {
    if (currentOrderStatus === nextStatus) {
      return;
    }

    if (needsPrettyConfirmation(currentOrderStatus, nextStatus)) {
      setPendingStatusChange({
        orderId,
        currentStatus: currentOrderStatus,
        nextStatus,
      });
      return;
    }

    void persistStatusChange(orderId, nextStatus);
  }

  async function copySummary(order: AdminOrder) {
    await navigator.clipboard.writeText(buildOrderSummary(order));
  }

  return (
    <OrdersShell>
      <FiltersPanel>
        <Filters>
          <FilterButton
            type="button"
            $active={currentStatus === "todos"}
          onClick={() => handleFilterChange("todos")}
        >
          <FilterIcon $active={currentStatus === "todos"} $status="todos" />
          <FilterText>Todos</FilterText>
        </FilterButton>
        {ORDER_STATUS_OPTIONS.map((option) => (
            <FilterButton
              key={option.value}
              type="button"
              $active={currentStatus === option.value}
              onClick={() => handleFilterChange(option.value)}
            >
              <FilterIcon
                $active={currentStatus === option.value}
                $status={option.value}
              />
              <FilterText>{option.label}</FilterText>
            </FilterButton>
          ))}
        </Filters>

        <DateFilters>
          <DateField>
            Filtrar por data
            <DateInput
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </DateField>

          {selectedDate ? (
            <ClearDateButton type="button" onClick={() => setSelectedDate("")}>
              Limpar data
            </ClearDateButton>
          ) : null}
        </DateFilters>
      </FiltersPanel>

      <TableStage>
        {visibleOrders.length ? (
          <>
            <MobileList>
              {visibleOrders.map((order) => {
                const allowedStatuses = getAllowedNextStatuses(order.status);

                return (
                  <MobileCard key={`mobile-${order.id}`}>
                    <MobileHeader>
                      <div>
                        <CustomerName>{order.customer_name}</CustomerName>
                        <MetaText>{order.whatsapp}</MetaText>
                      </div>
                      <StatusBadge status={order.status} />
                    </MobileHeader>

                    <MobileBody>
                      <MobileRow>
                        <MobileLabel>Pedido</MobileLabel>
                        <MobileValue>{order.product_type?.name ?? "-"}</MobileValue>
                        <MobileValue>{order.product_size?.name ?? "-"}</MobileValue>
                      </MobileRow>

                      <MobileRow>
                        <MobileLabel>Entrega</MobileLabel>
                        <MobileValue>
                          {formatDateBR(order.delivery_date)} as {formatTimeBR(order.delivery_time)}
                        </MobileValue>
                      </MobileRow>

                      <MobileRow>
                        <MobileLabel>Valor</MobileLabel>
                        <MobileValue>{formatCurrencyBRL(order.total_price)}</MobileValue>
                      </MobileRow>
                    </MobileBody>

                    <MobileFooter>
                      <StatusSelect
                        value={order.status}
                        onChange={(event) =>
                          requestStatusChange(order.id, order.status, event.target.value)
                        }
                        disabled={loadingOrderId === order.id}
                      >
                        {ORDER_STATUS_OPTIONS.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            disabled={!allowedStatuses.includes(option.value)}
                          >
                            {option.label}
                          </option>
                        ))}
                      </StatusSelect>

                      <MobileActions>
                        <ActionButton type="button" onClick={() => setActiveOrder(order)} $secondary>
                          Ver pedido
                        </ActionButton>
                        <ActionButton
                          as="a"
                          href={buildWhatsAppLink(order.whatsapp, buildConfirmOrderMessage(order))}
                          target="_blank"
                          rel="noreferrer"
                        >
                          WhatsApp
                        </ActionButton>
                      </MobileActions>
                    </MobileFooter>
                  </MobileCard>
                );
              })}
            </MobileList>

            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Pedido</th>
                    <th>Status</th>
                    <th>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleOrders.map((order) => {
                    const allowedStatuses = getAllowedNextStatuses(order.status);

                    return (
                      <tr key={order.id}>
                        <td>
                          <CustomerName>{order.customer_name}</CustomerName>
                          <MetaText>{order.whatsapp}</MetaText>
                          <MetaText>
                            {formatDateBR(order.delivery_date)} as {formatTimeBR(order.delivery_time)}
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
                              onChange={(event) =>
                                requestStatusChange(order.id, order.status, event.target.value)
                              }
                              disabled={loadingOrderId === order.id}
                            >
                              {ORDER_STATUS_OPTIONS.map((option) => (
                                <option
                                  key={option.value}
                                  value={option.value}
                                  disabled={!allowedStatuses.includes(option.value)}
                                >
                                  {option.label}
                                </option>
                              ))}
                            </StatusSelect>
                          </SelectWrap>
                        </td>
                        <td>
                          <Actions>
                            <ActionButton type="button" onClick={() => setActiveOrder(order)} $secondary>
                              Ver pedido
                            </ActionButton>
                            <ActionButton
                              as="a"
                              href={buildWhatsAppLink(order.whatsapp, buildConfirmOrderMessage(order))}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Confirmar no WhatsApp
                            </ActionButton>
                          </Actions>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </TableWrap>
          </>
        ) : (
          <EmptyState>
            <EmptyStateLabel>{currentStatusLabel}</EmptyStateLabel>
            Nenhum pedido encontrado para este filtro. Clique em outro status ou volte para Todos.
          </EmptyState>
        )}
      </TableStage>

      {activeOrder ? (
        <ModalOverlay
          role="presentation"
          onClick={() => setActiveOrder(null)}
        >
          <ModalCard
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle id="order-details-title">Detalhes do pedido</ModalTitle>
              <ModalCloseButton type="button" onClick={() => setActiveOrder(null)}>
                Fechar
              </ModalCloseButton>
            </ModalHeader>
            <OrderDetails order={activeOrder} />
            <ModalActions>
              <ActionButton type="button" onClick={() => copySummary(activeOrder)} $secondary>
                Copiar resumo
              </ActionButton>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      ) : null}

      {pendingStatusChange ? (
        <ModalOverlay
          role="presentation"
          onClick={() => setPendingStatusChange(null)}
        >
          <ModalCard
            role="dialog"
            aria-modal="true"
            aria-labelledby="status-confirmation-title"
            onClick={(event) => event.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle id="status-confirmation-title">
                {pendingStatusChange.nextStatus === "cancelado" ? "Cancelar pedido" : "Finalizar pedido"}
              </ModalTitle>
              <ModalCloseButton type="button" onClick={() => setPendingStatusChange(null)}>
                Fechar
              </ModalCloseButton>
            </ModalHeader>
            <ConfirmText>
              {pendingStatusChange.nextStatus === "cancelado"
                ? "Tem certeza que deseja cancelar este pedido? Essa acao tira o pedido do fluxo ativo da loja."
                : "Tem certeza que deseja marcar este pedido como finalizado? Use isso quando a entrega ou retirada ja estiver concluida."}
            </ConfirmText>
            <ModalActions>
              <ActionButton type="button" $secondary onClick={() => setPendingStatusChange(null)}>
                Voltar
              </ActionButton>
              <ActionButton
                type="button"
                onClick={() => {
                  void persistStatusChange(
                    pendingStatusChange.orderId,
                    pendingStatusChange.nextStatus,
                  );
                  setPendingStatusChange(null);
                }}
              >
                {pendingStatusChange.nextStatus === "cancelado" ? "Confirmar cancelamento" : "Confirmar finalizacao"}
              </ActionButton>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      ) : null}
    </OrdersShell>
  );
}
