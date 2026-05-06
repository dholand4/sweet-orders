import styled, { css } from "styled-components";
import { media } from "@/utils/media";

const interactiveFocus = css`
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const fieldStyles = css`
  min-height: 44px;
  width: 100%;
  padding: 0 ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.normal};
  transition: all 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.focus};
  }

  ${interactiveFocus}
`;

export const FormShell = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  width: 100%;
  padding: ${({ theme }) => theme.space[4]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

export const FormHeading = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

export const FormEyebrow = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

export const FormTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.wine};
  font-family: var(--font-heading), serif;
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: ${({ theme }) => theme.lineHeights.tight};

  ${media.md} {
    font-size: ${({ theme }) => theme.fontSizes["4xl"]};
  }
`;

export const FormDescription = styled.p`
  max-width: 42rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.normal};
`;

export const Section = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  padding-top: ${({ theme }) => theme.space[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const SectionHeader = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
`;

export const SectionTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.wine};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: ${({ theme }) => theme.lineHeights.tight};
`;

export const SectionText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.normal};
`;

export const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  align-items: start;

  ${media.md} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const FullWidth = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};

  ${media.md} {
    grid-column: 1 / -1;
  }
`;

export const TwoThirds = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};

  ${media.md} {
    grid-column: 1 / -1;
  }
`;

export const FieldShell = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

export const Label = styled.label`
  color: ${({ theme }) => theme.colors.wine};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: ${({ theme }) => theme.lineHeights.tight};
`;

export const Input = styled.input`
  ${fieldStyles}
`;

export const Select = styled.select`
  ${fieldStyles}
`;

export const Textarea = styled.textarea`
  ${fieldStyles}
  min-height: 120px;
  padding-block: ${({ theme }) => theme.space[3]};
  resize: vertical;
`;

export const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: ${({ theme }) => theme.lineHeights.normal};
`;

export const NotesCard = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[4]};
  border: 1px solid rgba(255, 217, 154, 0.6);
  border-radius: ${({ theme }) => theme.radii.md};
  background: linear-gradient(135deg, rgba(255, 217, 154, 0.12), rgba(255, 255, 255, 0.96));
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const NotesTitle = styled.strong`
  color: ${({ theme }) => theme.colors.wine};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const NotesList = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.space[3]};
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

export const SwitchGroup = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};

  ${media.md} {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
`;

export const SwitchButton = styled.button<{ $active?: boolean }>`
  min-height: 44px;
  width: 100%;
  padding: 0 ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primarySoft : theme.colors.surface};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.wine : theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: ${({ theme }) => theme.lineHeights.normal};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  ${interactiveFocus}
`;

export const InlineMeta = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  line-height: ${({ theme }) => theme.lineHeights.normal};
`;

export const CepRow = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};

  ${media.md} {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
  }
`;

export const SecondaryButton = styled.button`
  min-height: 44px;
  padding: 0 ${({ theme }) => theme.space[4]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.wine};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  ${interactiveFocus}
`;

export const SummaryCard = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: linear-gradient(180deg, rgba(252, 232, 240, 0.48), rgba(255, 255, 255, 0.98));
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const SummaryGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
`;

export const SummaryItem = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
  align-content: start;
  min-width: 0;
`;

export const SummaryLabel = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const SummaryValue = styled.strong`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: ${({ theme }) => theme.lineHeights.normal};
`;

export const SummaryPriceWrap = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  width: 100%;
`;

export const PrimaryButton = styled.button`
  min-height: 44px;
  padding: 0 ${({ theme }) => theme.space[4]};
  border: 0;
  border-radius: ${({ theme }) => theme.radii.full};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryHover});
  color: ${({ theme }) => theme.colors.surface};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all 0.2s ease;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  ${interactiveFocus}
`;

export const FeedbackCard = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]};
  border: 1px solid rgba(78, 155, 105, 0.24);
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const FeedbackText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.success};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: ${({ theme }) => theme.lineHeights.normal};
`;
