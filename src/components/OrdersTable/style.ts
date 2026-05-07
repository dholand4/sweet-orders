import styled, { css } from "styled-components";
import { media } from "@/utils/media";

const pillButton = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 ${({ theme }) => theme.space[4]};
  border-radius: 999px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

export const OrdersShell = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

export const Filters = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
  flex-wrap: wrap;
`;

export const FilterLink = styled.a<{ $active?: boolean }>`
  ${pillButton}
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryHover})` : "rgba(255, 255, 255, 0.85)"};
  color: ${({ $active, theme }) => ($active ? theme.colors.surface : theme.colors.wine)};
  cursor: pointer;
`;

export const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};

  ${media.lg} {
    grid-template-columns: minmax(0, 1.55fr) minmax(320px, 0.95fr);
    align-items: start;
  }
`;

export const TableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(253, 241, 244, 0.86));
  box-shadow: 0 20px 48px -36px rgba(110, 36, 57, 0.32);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: ${({ theme }) => theme.space[3]};
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    vertical-align: top;
  }

  th {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: ${({ theme }) => theme.fontSizes.xs};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  tbody tr {
    transition: background 0.15s ease;
  }

  tbody tr:hover {
    background: rgba(255, 255, 255, 0.68);
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
`;

export const CustomerName = styled.strong`
  color: ${({ theme }) => theme.colors.wine};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const MetaText = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.normal};
`;

export const StatusSelect = styled.select`
  min-height: 44px;
  min-width: 10rem;
  padding: 0 ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  &:focus,
  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.focus};
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
`;

export const SelectWrap = styled.div`
  margin-top: ${({ theme }) => theme.space[2]};
`;

export const ActionButton = styled.button<{ $secondary?: boolean }>`
  ${pillButton}
  border: 1px solid ${({ $secondary, theme }) => ($secondary ? theme.colors.border : "transparent")};
  background: ${({ $secondary, theme }) =>
    $secondary
      ? "rgba(255, 255, 255, 0.88)"
      : `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryHover})`};
  color: ${({ $secondary, theme }) => ($secondary ? theme.colors.wine : theme.colors.surface)};
  cursor: pointer;
`;

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.space[4]};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: 24px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  background: rgba(255, 255, 255, 0.78);
`;
