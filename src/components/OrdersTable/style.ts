import styled, { css } from "styled-components";
import { media } from "@/utils/media";

const pillButton = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  transition: all 0.2s ease;
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
    $active ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryHover})` : theme.colors.surface};
  color: ${({ $active, theme }) => ($active ? theme.colors.surface : theme.colors.wine)};
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

export const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};

  ${media.lg} {
    grid-template-columns: minmax(0, 1.6fr) minmax(320px, 0.95fr);
    align-items: start;
  }
`;

export const TableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
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
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  &:focus,
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
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
  border: 1px solid
    ${({ $secondary, theme }) =>
      $secondary ? theme.colors.border : "transparent"};
  background: ${({ $secondary, theme }) =>
    $secondary
      ? theme.colors.surface
      : `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryHover})`};
  color: ${({ $secondary, theme }) =>
    $secondary ? theme.colors.wine : theme.colors.surface};
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.space[4]};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  background: ${({ theme }) => theme.colors.surface};
`;
