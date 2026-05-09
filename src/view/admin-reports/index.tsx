"use client";

import { useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { media } from "@/utils/media";
import { formatCurrencyBRL, formatDateBR, formatTimeBR } from "@/utils/format";
import { StatusBadge } from "@/components/StatusBadge";

/* ── animations ──────────────────────────────────────────────── */

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ── layout ──────────────────────────────────────────────────── */

const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

/* ── filter bar ──────────────────────────────────────────────── */

const FilterCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 20px 24px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const FilterTitle = styled.h2`
  margin: 0 0 16px;
  font-family: var(--font-heading), serif;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.text};
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 12px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FieldLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DateInput = styled.input`
  height: 38px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySoft};
  }
`;

const SearchButton = styled.button`
  height: 38px;
  padding: 0 20px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  cursor: pointer;
  transition: opacity ${({ theme }) => theme.transitions.base};

  &:hover:not(:disabled) { opacity: 0.88; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

/* ── stats grid ──────────────────────────────────────────────── */

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  animation: ${slideUp} 0.35s ease both;

  ${media.lg} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div<{ $delay?: number }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  animation: ${slideUp} 0.35s ease both;
  animation-delay: ${({ $delay }) => $delay ?? 0}ms;
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const StatIcon = styled.div<{ $bg: string }>`
  width: 34px;
  height: 34px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
`;

const StatValue = styled.div`
  font-family: var(--font-heading), serif;
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1;
`;

/* ── table ───────────────────────────────────────────────────── */

const SectionTitle = styled.h2`
  margin: 0 0 14px;
  font-family: var(--font-heading), serif;
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  color: ${({ theme }) => theme.colors.text};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  animation: ${slideUp} 0.4s ease both;
`;

const TableWrap = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 620px;

  th {
    padding: 11px 16px;
    text-align: left;
    font-size: ${({ theme }) => theme.fontSizes.xs};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.textMuted};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.bgSecondary};
  }

  td {
    padding: 13px 16px;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.text};
    border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
    vertical-align: middle;
  }

  tr:last-child td { border-bottom: 0; }
  tr:hover td { background: ${({ theme }) => theme.colors.bgSecondary}; }
`;

const CustomerName = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  display: block;
`;

const MetaText = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const TotalRow = styled.tr`
  background: ${({ theme }) => theme.colors.bgSecondary} !important;

  td {
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    border-top: 2px solid ${({ theme }) => theme.colors.border};
  }
`;

const EmptyState = styled.div`
  padding: 48px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ErrorMsg = styled.div`
  padding: 16px 24px;
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.25);
  border-radius: ${({ theme }) => theme.radii.md};
  color: #dc2626;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

/* ── types ───────────────────────────────────────────────────── */

type ReportOrder = {
  id: string;
  customer_name: string;
  whatsapp: string;
  delivery_date: string;
  delivery_time: string;
  status: string;
  total_price: number;
  created_at: string;
  product: { id: string; name: string } | null;
  product_size: { id: string; name: string } | null;
};

type ReportStats = {
  total: number;
  totalRevenue: number;
  byStatus: {
    novo: number;
    confirmado: number;
    finalizado: number;
    cancelado: number;
  };
};

/* ── helpers ─────────────────────────────────────────────────── */

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function firstDayOfMonthISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

/* ── component ───────────────────────────────────────────────── */

export function ReportsView() {
  const [from, setFrom] = useState(firstDayOfMonthISO);
  const [to, setTo] = useState(todayISO);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<ReportOrder[] | null>(null);
  const [stats, setStats] = useState<ReportStats | null>(null);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/reports?from=${from}&to=${to}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.message ?? "Erro ao carregar relatório.");
        return;
      }

      setOrders(json.orders);
      setStats(json.stats);
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  const revenueOrders = orders?.filter((o) =>
    ["confirmado", "finalizado"].includes(o.status),
  ) ?? [];

  return (
    <PageWrap>
      {/* ── filter ── */}
      <FilterCard>
        <FilterTitle>Filtrar por período</FilterTitle>
        <FilterRow>
          <FieldGroup>
            <FieldLabel htmlFor="rep-from">De</FieldLabel>
            <DateInput
              id="rep-from"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="rep-to">Até</FieldLabel>
            <DateInput
              id="rep-to"
              type="date"
              value={to}
              min={from}
              onChange={(e) => setTo(e.target.value)}
            />
          </FieldGroup>

          <SearchButton onClick={fetchReport} disabled={loading}>
            {loading ? "Buscando…" : "Buscar"}
          </SearchButton>
        </FilterRow>
      </FilterCard>

      {error && <ErrorMsg>{error}</ErrorMsg>}

      {/* ── stats ── */}
      {stats && (
        <StatsGrid>
          <StatCard $delay={0}>
            <StatHeader>
              <StatLabel>Total de pedidos</StatLabel>
              <StatIcon $bg="rgba(59,130,246,0.12)">📋</StatIcon>
            </StatHeader>
            <StatValue>{stats.total}</StatValue>
          </StatCard>

          <StatCard $delay={60}>
            <StatHeader>
              <StatLabel>Receita confirmada</StatLabel>
              <StatIcon $bg="rgba(16,185,129,0.12)">💰</StatIcon>
            </StatHeader>
            <StatValue style={{ fontSize: "1.4rem" }}>
              {formatCurrencyBRL(stats.totalRevenue)}
            </StatValue>
          </StatCard>

          <StatCard $delay={120}>
            <StatHeader>
              <StatLabel>Finalizados</StatLabel>
              <StatIcon $bg="rgba(99,102,241,0.12)">✅</StatIcon>
            </StatHeader>
            <StatValue>{stats.byStatus.finalizado}</StatValue>
          </StatCard>

          <StatCard $delay={180}>
            <StatHeader>
              <StatLabel>Cancelados</StatLabel>
              <StatIcon $bg="rgba(239,68,68,0.1)">✕</StatIcon>
            </StatHeader>
            <StatValue>{stats.byStatus.cancelado}</StatValue>
          </StatCard>
        </StatsGrid>
      )}

      {/* ── orders table ── */}
      {orders !== null && (
        <div>
          <SectionTitle>
            Pedidos{" "}
            <span style={{ fontWeight: 400, fontSize: "1rem", color: "inherit", opacity: 0.6 }}>
              ({orders.length})
            </span>
          </SectionTitle>

          <Card>
            {orders.length > 0 ? (
              <TableWrap>
                <Table>
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Produto</th>
                      <th>Entrega</th>
                      <th>Valor</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <CustomerName>{order.customer_name}</CustomerName>
                          <MetaText>{order.whatsapp}</MetaText>
                        </td>
                        <td>
                          <MetaText>{order.product?.name ?? "-"}</MetaText>
                          <MetaText>{order.product_size?.name ?? "-"}</MetaText>
                        </td>
                        <td>
                          <MetaText>{formatDateBR(order.delivery_date)}</MetaText>
                          <MetaText>{formatTimeBR(order.delivery_time)}</MetaText>
                        </td>
                        <td>{formatCurrencyBRL(order.total_price)}</td>
                        <td>
                          <StatusBadge status={order.status} />
                        </td>
                      </tr>
                    ))}

                    {revenueOrders.length > 0 && (
                      <TotalRow>
                        <td colSpan={3} style={{ textAlign: "right" }}>
                          Total confirmado + finalizado
                        </td>
                        <td>{formatCurrencyBRL(stats!.totalRevenue)}</td>
                        <td />
                      </TotalRow>
                    )}
                  </tbody>
                </Table>
              </TableWrap>
            ) : (
              <EmptyState>Nenhum pedido encontrado no período selecionado.</EmptyState>
            )}
          </Card>
        </div>
      )}

      {orders === null && !loading && (
        <EmptyState style={{ color: "inherit" }}>
          Selecione um período e clique em <strong>Buscar</strong> para ver o relatório.
        </EmptyState>
      )}
    </PageWrap>
  );
}
