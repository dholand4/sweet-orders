"use client";

import styled, { keyframes } from "styled-components";
import Link from "next/link";
import { media } from "@/utils/media";
import { formatCurrencyBRL, formatDateBR, formatTimeBR, buildWhatsAppLink, buildConfirmOrderMessage } from "@/utils/format";
import { StatusBadge } from "@/components/StatusBadge";
import type { AdminOrder } from "@/@types/orders";

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  ${media.lg} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div<{ $color: string; $delay?: number }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  animation: ${slideUp} 0.4s ease both;
  animation-delay: ${({ $delay }) => $delay ?? 0}ms;
  transition: transform ${({ theme }) => theme.transitions.base}, box-shadow ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
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
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const StatValue = styled.div`
  font-family: var(--font-heading), serif;
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1;
`;

const StatSub = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SectionTitle = styled.h2`
  margin: 0 0 16px;
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
`;

const TableWrap = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;

  th {
    padding: 12px 16px;
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
    padding: 14px 16px;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.text};
    border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
    vertical-align: middle;
  }

  tr:last-child td {
    border-bottom: 0;
  }

  tr:hover td {
    background: ${({ theme }) => theme.colors.bgSecondary};
  }
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

const WaLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: #25d366;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const CardFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgSecondary};
  text-align: right;
`;

const ViewAllLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const QuickLinks = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  ${media.md} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const QuickLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-decoration: none;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    background: ${({ theme }) => theme.colors.primarySoft};
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const QuickLinkIcon = styled.span`
  font-size: 22px;
`;

type DashboardViewProps = {
  stats: {
    total: number;
    novo: number;
    confirmado: number;
    totalRevenue: number;
    todayOrders: number;
  };
  recentOrders: AdminOrder[];
};

export function DashboardView({ stats, recentOrders }: DashboardViewProps) {
  return (
    <PageWrap>
      <StatsGrid>
        <StatCard $color="#3b82f6" $delay={0}>
          <StatHeader>
            <StatLabel>Total de pedidos</StatLabel>
            <StatIcon $bg="rgba(59,130,246,0.12)">📋</StatIcon>
          </StatHeader>
          <StatValue>{stats.total}</StatValue>
          <StatSub>{stats.todayOrders} para hoje</StatSub>
        </StatCard>

        <StatCard $color="#f59e0b" $delay={60}>
          <StatHeader>
            <StatLabel>Aguardando</StatLabel>
            <StatIcon $bg="rgba(245,158,11,0.12)">⏳</StatIcon>
          </StatHeader>
          <StatValue>{stats.novo}</StatValue>
          <StatSub>pedidos novos</StatSub>
        </StatCard>

        <StatCard $color="#10b981" $delay={120}>
          <StatHeader>
            <StatLabel>Confirmados</StatLabel>
            <StatIcon $bg="rgba(16,185,129,0.12)">✅</StatIcon>
          </StatHeader>
          <StatValue>{stats.confirmado}</StatValue>
          <StatSub>em andamento</StatSub>
        </StatCard>

        <StatCard $color="#de7f9b" $delay={180}>
          <StatHeader>
            <StatLabel>Receita total</StatLabel>
            <StatIcon $bg="rgba(222,127,155,0.14)">💰</StatIcon>
          </StatHeader>
          <StatValue style={{ fontSize: "1.5rem" }}>{formatCurrencyBRL(stats.totalRevenue)}</StatValue>
          <StatSub>confirmados + finalizados</StatSub>
        </StatCard>
      </StatsGrid>

      <div>
        <SectionTitle>Últimos pedidos</SectionTitle>
        <Card>
          {recentOrders.length > 0 ? (
            <>
              <TableWrap>
                <Table>
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Produto</th>
                      <th>Entrega</th>
                      <th>Valor</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
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
                        <td><StatusBadge status={order.status} /></td>
                        <td>
                          <WaLink
                            href={buildWhatsAppLink(order.whatsapp, buildConfirmOrderMessage(order))}
                            target="_blank"
                            rel="noreferrer"
                          >
                            📱 WhatsApp
                          </WaLink>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrap>
              <CardFooter>
                <ViewAllLink href="/admin/pedidos">Ver todos os pedidos →</ViewAllLink>
              </CardFooter>
            </>
          ) : (
            <EmptyState>Nenhum pedido ainda.</EmptyState>
          )}
        </Card>
      </div>

      <div>
        <SectionTitle>Atalhos</SectionTitle>
        <QuickLinks>
          <QuickLink href="/admin/pedidos">
            <QuickLinkIcon>📋</QuickLinkIcon>
            Gerenciar pedidos
          </QuickLink>
          <QuickLink href="/admin/produtos">
            <QuickLinkIcon>🎂</QuickLinkIcon>
            Gerenciar produtos
          </QuickLink>
          <QuickLink href="/admin/sabores">
            <QuickLinkIcon>🍰</QuickLinkIcon>
            Gerenciar sabores
          </QuickLink>
        </QuickLinks>
      </div>
    </PageWrap>
  );
}
