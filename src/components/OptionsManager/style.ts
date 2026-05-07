import styled, { css } from "styled-components";
import { media } from "@/utils/media";

const controlStyles = css`
  min-height: 46px;
  width: 100%;
  padding: 0 ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus,
  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.focus};
  }
`;

const cardShell = css`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(253, 241, 244, 0.88));
  box-shadow: 0 20px 48px -36px rgba(110, 36, 57, 0.32);
`;

const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 ${({ theme }) => theme.space[4]};
  border-radius: 999px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

export const Shell = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

export const FeedbackRow = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

export const FeedbackCard = styled.div<{ $tone: "success" | "error" }>`
  padding: ${({ theme }) => theme.space[3]};
  border-radius: 18px;
  border: 1px solid
    ${({ $tone }) =>
      $tone === "success" ? "rgba(78, 155, 105, 0.24)" : "rgba(178, 77, 105, 0.24)"};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ $tone, theme }) =>
    $tone === "success" ? theme.colors.success : theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const Section = styled.section`
  ${cardShell}
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  padding: ${({ theme }) => theme.space[4]};
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
  align-items: flex-start;
  flex-wrap: wrap;
`;

export const SectionHeading = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
`;

export const SectionEyebrow = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

export const SectionTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.wine};
  font-family: var(--font-heading), serif;
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  line-height: ${({ theme }) => theme.lineHeights.tight};
`;

export const SectionText = styled.p`
  max-width: 42rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

export const SectionCount = styled.div`
  padding: 10px 14px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.wine};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const SectionBody = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};

  ${media.xl} {
    grid-template-columns: minmax(0, 320px) minmax(0, 1fr);
    align-items: start;
  }
`;

export const ComposerCard = styled.form`
  ${cardShell}
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]};
`;

export const ComposerTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.wine};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

export const FormGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
`;

export const FieldShell = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

export const Label = styled.label`
  color: ${({ theme }) => theme.colors.wine};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const Input = styled.input`
  ${controlStyles}
`;

export const Select = styled.select`
  ${controlStyles}
`;

export const CheckboxRow = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export const HelperText = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  line-height: ${({ theme }) => theme.lineHeights.normal};
`;

export const PrimaryButton = styled.button`
  ${buttonBase}
  border: 0;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryHover});
  color: ${({ theme }) => theme.colors.surface};
`;

export const SecondaryButton = styled.button`
  ${buttonBase}
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.wine};
`;

export const GhostButton = styled.button`
  ${buttonBase}
  border: 1px dashed ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.72);
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ToggleButton = styled.button<{ $active?: boolean }>`
  ${buttonBase}
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primarySoft : "rgba(255,255,255,0.78)"};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.wine : theme.colors.textMuted};
`;

export const CardList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};

  ${media.md} {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }
`;

export const ItemCard = styled.article`
  ${cardShell}
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]};
`;

export const ItemHead = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
  align-items: flex-start;
`;

export const ItemTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.wine};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

export const ItemMeta = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.normal};
`;

export const StatusPill = styled.span<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primarySoft : "rgba(154, 106, 121, 0.12)"};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.wine : theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  white-space: nowrap;
`;

export const ItemForm = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
`;

export const ItemActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
  flex-wrap: wrap;
`;

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.space[4]};
  border-radius: 20px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.72);
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`;
