import styled, { css } from "styled-components";
import { media } from "@/utils/media";

const fadeSlideIn = css`
  animation: fadeSlideIn 0.28s ease;

  @keyframes fadeSlideIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

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

export const FiltersPanel = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(253, 241, 244, 0.82));
`;

export const Filters = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  grid-template-columns: repeat(5, minmax(0, 1fr));

  @media (max-width: 767px) {
    align-items: stretch;
  }

  ${media.md} {
    display: flex;
    flex-wrap: wrap;
    grid-template-columns: none;
  }
`;

export const FilterIcon = styled.span<{
  $active?: boolean;
  $status: "todos" | "novo" | "confirmado" | "finalizado" | "cancelado";
}>`
  width: 18px;
  height: 18px;
  border-radius: 999px;
  flex-shrink: 0;
  background: ${({ $active, $status, theme }) => {
    if ($active) {
      return "rgba(255,255,255,0.34)";
    }

    return theme.colors.primarySoft;
  }};
  display: inline-block;

  ${media.md} {
    display: none;
  }

  @media (max-width: 767px) {
    background: ${({ $active, $status, theme }) => {
      if ($active) {
        return "rgba(255,255,255,0.92)";
      }

      const mobilePalette = {
        todos: "#ffffff",
        novo: "#4b7bec",
        confirmado: "#4e9b69",
        finalizado: "#2f2f2f",
        cancelado: "#c94b63",
      } as const;

      return mobilePalette[$status];
    }};
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22);
  }
`;

export const FilterText = styled.span`
  @media (max-width: 767px) {
    display: none;
  }
`;

export const FilterButton = styled.button<{ $active?: boolean }>`
  ${pillButton}
  gap: ${({ theme }) => theme.space[2]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryHover})` : "rgba(255, 255, 255, 0.85)"};
  color: ${({ $active, theme }) => ($active ? theme.colors.surface : theme.colors.wine)};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: ${({ $active, theme }) => ($active ? theme.shadows.sm : "none")};

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.24) 50%, transparent 100%);
    transform: translateX(-120%);
    transition: transform 0.35s ease;
  }

  &:hover::after {
    transform: translateX(120%);
  }

  @media (max-width: 767px) {
    min-width: 52px;
    width: 52px;
    padding: 0;
    gap: 0;
  }
`;

export const DateFilters = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};

  ${media.md} {
    grid-template-columns: minmax(0, 220px) auto;
    align-items: end;
    justify-content: start;
  }
`;

export const DateField = styled.label`
  display: grid;
  gap: 6px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const DateInput = styled.input`
  min-height: 44px;
  width: 100%;
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

export const ClearDateButton = styled.button`
  ${pillButton}
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.88);
  color: ${({ theme }) => theme.colors.wine};
  cursor: pointer;
`;

export const TableWrap = styled.div`
  ${fadeSlideIn}
  will-change: transform, opacity;
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(253, 241, 244, 0.86));
  box-shadow: 0 20px 48px -36px rgba(110, 36, 57, 0.32);

  @media (max-width: 767px) {
    display: none;
  }
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
  display: grid;
  gap: ${({ theme }) => theme.space[2]};

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, max-content));
    align-items: start;
  }
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
  ${fadeSlideIn}
  will-change: transform, opacity;
  padding: ${({ theme }) => theme.space[4]};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: 24px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  background: rgba(255, 255, 255, 0.78);
`;

export const EmptyStateLabel = styled.div`
  margin-bottom: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.colors.wine};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const TableStage = styled.div`
  display: grid;
  min-height: 420px;
`;

export const MobileList = styled.div`
  ${fadeSlideIn}
  display: grid;
  gap: ${({ theme }) => theme.space[3]};

  ${media.md} {
    display: none;
  }
`;

export const MobileCard = styled.article`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(253, 241, 244, 0.88));
  box-shadow: 0 18px 40px -32px rgba(110, 36, 57, 0.32);
`;

export const MobileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[2]};
  align-items: flex-start;
`;

export const MobileBody = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

export const MobileRow = styled.div`
  display: grid;
  gap: 2px;
`;

export const MobileLabel = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const MobileValue = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.normal};
`;

export const MobileFooter = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

export const MobileActions = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  grid-template-columns: 1fr 1fr;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(116, 116, 116, 0.82);
`;

export const ModalCard = styled.div`
  width: min(100%, 720px);
  max-height: min(90dvh, 800px);
  overflow: auto;
  padding: ${({ theme }) => theme.space[4]};
  border-radius: 28px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.99), rgba(253, 241, 244, 0.9));
  box-shadow: 0 24px 64px -28px rgba(58, 29, 42, 0.38);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

export const ModalTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.wine};
  font-family: var(--font-heading), serif;
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  line-height: ${({ theme }) => theme.lineHeights.tight};
`;

export const ModalCloseButton = styled.button`
  ${pillButton}
  min-width: 44px;
  padding: 0 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.88);
  color: ${({ theme }) => theme.colors.wine};
  cursor: pointer;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[2]};
  margin-top: ${({ theme }) => theme.space[3]};
  flex-wrap: wrap;
`;

export const ConfirmText = styled.p`
  margin: 0 0 ${({ theme }) => theme.space[4]};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.base};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;
