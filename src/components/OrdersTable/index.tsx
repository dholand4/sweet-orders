"use client";

import { useEffect, useMemo, useState } from "react";
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
  Pagination,
  PaginationButton,
  PaginationInfo,
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
const PAGE_SIZE = 10;

function getAllowedNextStatuses(currentStatus: string) {
  if (currentStatus === "novo")      return ["novo", "confirmado", "cancelado"] as StatusOptionValue[];
  if (currentStatus === "confirmado") return ["confirmado", "finalizado", "cancelado"] as StatusOptionValue[];
  if (currentStatus === "cancelado")  return ["cancelado"] as StatusOptionValue[];
  if (currentStatus === "finalizado") return ["finalizado"] as StatusOptionValue[];
  return ["novo"] as StatusOptionValue[];
}

function getStatusActionCopy(currentStatus: string, nextStatus: string) {
  if (currentStatus === nextStatus) return null;
  if (nextStatus === "confirmado") return { title: "Confirmar pedido",   description: "Deseja confirmar este pedido agora?",                confirmLabel: "Confirmar pedido" };
  if (nextStatus === "cancelado")  return { title: "Cancelar pedido",    description: "Deseja cancelar este pedido agora?",                  confirmLabel: "Confirmar cancelamento" };
  if (nextStatus === "finalizado") return { title: "Finalizar pedido",   description: "Deseja marcar este pedido como finalizado?",          confirmLabel: "Confirmar finalização" };
  return { title: "Atualizar status", description: "Deseja atualizar o status deste pedido?", confirmLabel: "Confirmar alteração" };
}

function getFlavorsSummary(order: AdminOrder) {
  return [order.flavor_1?.name, order.flavor_2?.name].filter(Boolean).join(" + ") || "-";
}

function getToppingsSummary(order: AdminOrder) {
  return [order.topping_1?.name, order.topping_2?.name].filter(Boolean).join(" + ") || "-";
}

export function OrdersTable({ orders, selectedStatus }: OrdersTableProps) {
  const [activeOrder,        setActiveOrder]        = useState<AdminOrder | null>(null);
  const [loadingOrderId,     setLoadingOrderId]     = useState("");
  const [currentStatus,      setCurrentStatus]      = useState(selectedStatus);
  const [selectedDate,       setSelectedDate]       = useState("");
  const [localOrders,        setLocalOrders]        = useState(orders);
  const [currentPage,        setCurrentPage]        = useState(1);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    orderId: string;
    currentStatus: string;
    nextStatus: string;
  } | null>(null);

  const visibleOrders = useMemo(() => {
    return localOrders.filter((order) => {
      const matchStatus = currentStatus === "todos" || order.status === currentStatus;
      const matchDate   = selectedDate ? order.delivery_date === selectedDate : true;
      return matchStatus && matchDate;
    });
  }, [currentStatus, localOrders, selectedDate]);

  const totalPages = Math.max(1, Math.ceil(visibleOrders.length / PAGE_SIZE));
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return visibleOrders.slice(start, start + PAGE_SIZE);
  }, [currentPage, visibleOrders]);

  const currentStatusLabel =
    currentStatus === "todos"
      ? "Todos os pedidos"
      : ORDER_STATUS_OPTIONS.find((o) => o.value === currentStatus)?.label ?? "Pedidos";

  useEffect(() => { setLocalOrders(orders); }, [orders]);
  useEffect(() => { setCurrentPage(1); }, [currentStatus, selectedDate]);
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [currentPage, totalPages]);

  async function persistStatusChange(orderId: string, status: string) {
    const previousOrders = localOrders;
    setLoadingOrderId(orderId);
    setLocalOrders((cur) => cur.map((o) => o.id === orderId ? { ...o, status } : o));
    if (activeOrder?.id === orderId) setActiveOrder({ ...activeOrder, status });

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const p = (await res.json()) as { message?: string };
        throw new Error(p.message ?? "Não foi possível atualizar o status.");
      }
    } catch (error) {
      setLocalOrders(previousOrders);
      if (activeOrder?.id === orderId) {
        setActiveOrder(previousOrders.find((o) => o.id === orderId) ?? null);
      }
      window.alert(error instanceof Error ? error.message : "Erro ao atualizar o status.");
    } finally {
      setLoadingOrderId("");
    }
  }

  function requestStatusChange(orderId: string, current: string, next: string) {
    if (current === next) return;
    setPendingStatusChange({ orderId, currentStatus: current, nextStatus: next });
  }

  async function copySummary(order: AdminOrder) {
    await navigator.clipboard.writeText(buildOrderSummary(order));
  }

  return (
    <OrdersShell>
      <FiltersPanel>
        <Filters>
          <FilterButton type="button" $active={currentStatus === "todos"} onClick={() => setCurrentStatus("todos")}>
            <FilterIcon $active={currentStatus === "todos"} $status="todos" />
            <FilterText>Todos</FilterText>
          </FilterButton>
          {ORDER_STATUS_OPTIONS.map((option) => (
            <FilterButton
              key={option.value}
              type="button"
              $active={currentStatus === option.value}
              onClick={() => setCurrentStatus(option.value)}
            >
              <FilterIcon $active={currentStatus === option.value} $status={option.value} />
              <FilterText>{option.label}</FilterText>
            </FilterButton>
          ))}
        </Filters>

        <DateFilters>
          <DateField>
            Filtrar por data
            <DateInput type="date" value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)} />
          </DateField>
          {selectedDate && (
            <ClearDateButton type="button" onClick={() => setSelectedDate("")}>Limpar data</ClearDateButton>
          )}
        </DateFilters>
      </FiltersPanel>

      <TableStage>
        {visibleOrders.length > 0 ? (
          <>
            {/* Mobile */}
            <MobileList>
              {paginatedOrders.map((order) => {
                const allowed = getAllowedNextStatuses(order.status);
                return (
                  <MobileCard key={`m-${order.id}`}>
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
                        <MobileValue>{order.product?.name ?? "-"}</MobileValue>
                        <MobileValue>{order.product_size?.name ?? "-"}</MobileValue>
                      </MobileRow>
                      <MobileRow>
                        <MobileLabel>Recheio</MobileLabel>
                        <MobileValue>{getFlavorsSummary(order)}</MobileValue>
                      </MobileRow>
                      <MobileRow>
                        <MobileLabel>Cobertura</MobileLabel>
                        <MobileValue>{getToppingsSummary(order)}</MobileValue>
                      </MobileRow>
                      <MobileRow>
                        <MobileLabel>Entrega</MobileLabel>
                        <MobileValue>{formatDateBR(order.delivery_date)} às {formatTimeBR(order.delivery_time)}</MobileValue>
                      </MobileRow>
                      <MobileRow>
                        <MobileLabel>Valor</MobileLabel>
                        <MobileValue>{formatCurrencyBRL(order.total_price)}</MobileValue>
                      </MobileRow>
                    </MobileBody>
                    <MobileFooter>
                      <StatusSelect
                        value={order.status}
                        disabled={loadingOrderId === order.id}
                        onChange={(e) => requestStatusChange(order.id, order.status, e.target.value)}
                      >
                        {ORDER_STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}
                            disabled={!allowed.includes(opt.value)}>
                            {opt.label}
                          </option>
                        ))}
                      </StatusSelect>
                      <MobileActions>
                        <ActionButton type="button" $secondary onClick={() => setActiveOrder(order)}>Ver pedido</ActionButton>
                        <ActionButton as="a"
                          href={buildWhatsAppLink(order.whatsapp, buildConfirmOrderMessage(order))}
                          target="_blank" rel="noreferrer">
                          WhatsApp
                        </ActionButton>
                      </MobileActions>
                    </MobileFooter>
                  </MobileCard>
                );
              })}
            </MobileList>

            {/* Desktop */}
            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Produto & Recheio</th>
                    <th>Entrega</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => {
                    const allowed = getAllowedNextStatuses(order.status);
                    return (
                      <tr key={order.id}>
                        <td>
                          <CustomerName>{order.customer_name}</CustomerName>
                          <MetaText>{order.whatsapp}</MetaText>
                        </td>
                        <td>
                          <MetaText>{order.product?.name ?? "-"} · {order.product_size?.name ?? "-"}</MetaText>
                          <MetaText>Recheio: {getFlavorsSummary(order)}</MetaText>
                          {(order.topping_1 || order.topping_2) && (
                            <MetaText>Cobertura: {getToppingsSummary(order)}</MetaText>
                          )}
                        </td>
                        <td>
                          <MetaText>{formatDateBR(order.delivery_date)}</MetaText>
                          <MetaText>{formatTimeBR(order.delivery_time)}</MetaText>
                        </td>
                        <td>{formatCurrencyBRL(order.total_price)}</td>
                        <td>
                          <StatusBadge status={order.status} />
                          <SelectWrap>
                            <StatusSelect
                              value={order.status}
                              disabled={loadingOrderId === order.id}
                              onChange={(e) => requestStatusChange(order.id, order.status, e.target.value)}
                            >
                              {ORDER_STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}
                                  disabled={!allowed.includes(opt.value)}>
                                  {opt.label}
                                </option>
                              ))}
                            </StatusSelect>
                          </SelectWrap>
                        </td>
                        <td>
                          <Actions>
                            <ActionButton type="button" $secondary onClick={() => setActiveOrder(order)}>
                              Ver pedido
                            </ActionButton>
                            <ActionButton as="a"
                              href={buildWhatsAppLink(order.whatsapp, buildConfirmOrderMessage(order))}
                              target="_blank" rel="noreferrer">
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

            {totalPages > 1 && (
              <Pagination>
                <PaginationButton type="button" disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                  Anterior
                </PaginationButton>
                <PaginationInfo>Página {currentPage} de {totalPages}</PaginationInfo>
                <PaginationButton type="button" disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                  Próxima
                </PaginationButton>
              </Pagination>
            )}
          </>
        ) : (
          <EmptyState>
            <EmptyStateLabel>{currentStatusLabel}</EmptyStateLabel>
            Nenhum pedido encontrado para este filtro.
          </EmptyState>
        )}
      </TableStage>

      {/* Modal: detalhes do pedido */}
      {activeOrder && (
        <ModalOverlay role="presentation" onClick={() => setActiveOrder(null)}>
          <ModalCard role="dialog" aria-modal="true" aria-labelledby="order-details-title"
            onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle id="order-details-title">Detalhes do pedido</ModalTitle>
              <ModalCloseButton type="button" onClick={() => setActiveOrder(null)}>Fechar</ModalCloseButton>
            </ModalHeader>
            <OrderDetails order={activeOrder} />
            <ModalActions>
              <ActionButton type="button" $secondary onClick={() => copySummary(activeOrder)}>
                Copiar resumo
              </ActionButton>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* Modal: confirmação de mudança de status */}
      {pendingStatusChange && (
        <ModalOverlay role="presentation" onClick={() => setPendingStatusChange(null)}>
          <ModalCard role="dialog" aria-modal="true" aria-labelledby="status-confirm-title"
            onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle id="status-confirm-title">
                {getStatusActionCopy(pendingStatusChange.currentStatus, pendingStatusChange.nextStatus)?.title ?? "Atualizar status"}
              </ModalTitle>
              <ModalCloseButton type="button" onClick={() => setPendingStatusChange(null)}>Fechar</ModalCloseButton>
            </ModalHeader>
            <ConfirmText>
              {getStatusActionCopy(pendingStatusChange.currentStatus, pendingStatusChange.nextStatus)?.description}
            </ConfirmText>
            <ModalActions>
              <ActionButton type="button" $secondary onClick={() => setPendingStatusChange(null)}>Voltar</ActionButton>
              <ActionButton type="button" onClick={() => {
                void persistStatusChange(pendingStatusChange.orderId, pendingStatusChange.nextStatus);
                setPendingStatusChange(null);
              }}>
                {getStatusActionCopy(pendingStatusChange.currentStatus, pendingStatusChange.nextStatus)?.confirmLabel}
              </ActionButton>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </OrdersShell>
  );
}
