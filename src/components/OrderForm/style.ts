import styled, { css } from "styled-components";
import { media } from "@/utils/media";

const interactiveFocus = css`
  &:focus-visible {
    outline: 2px solid rgba(233, 30, 99, 0.35);
    outline-offset: 2px;
  }
`;

const fieldStyles = css`
  width: 100%;
  min-height: 42px;
  padding: 0 0.85rem;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fff;
  color: var(--ink);
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.normal};
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder {
    color: var(--muted);
  }

  &:focus {
    border-color: var(--rose-5);
    box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.15);
  }

  ${interactiveFocus}
`;

const cardStyles = css`
  border: 1px solid var(--line);
  border-radius: 24px;
  background: #fff;
  box-shadow: var(--shadow-card);
`;

export const Shell = styled.div`
  display: grid;
  gap: 24px;
  width: 100%;
  max-width: 100%;

  ${media.lg} {
    grid-template-columns: minmax(0, 1fr) 360px;
    align-items: start;
  }
`;

export const Form = styled.form`
  display: grid;
  gap: 24px;
  width: 100%;
  max-width: 100%;
`;

export const MainColumn = styled.div`
  display: grid;
  gap: 24px;
  min-width: 0;
`;

export const Aside = styled.aside`
  min-width: 0;

  ${media.lg} {
    position: sticky;
    top: 24px;
  }
`;

export const Section = styled.section`
  ${cardStyles}
  padding: 24px;

  ${media.md} {
    padding: 32px;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

export const StepIcon = styled.div`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: #fff;
  background: linear-gradient(135deg, var(--rose-4), var(--rose-5));
  box-shadow: 0 8px 20px -10px rgba(233, 30, 99, 0.6);
  font-size: 1rem;
`;

export const SectionHeading = styled.div`
  display: grid;
  gap: 4px;
`;

export const StepLabel = styled.span`
  color: var(--rose-5);
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: var(--ink);
  font-family: var(--font-heading), serif;
  font-size: clamp(1.75rem, 2vw + 1rem, 2.15rem);
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: 1.1;
`;

export const SectionText = styled.p`
  margin: 0;
  color: var(--muted);
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.normal};
`;

export const Grid = styled.div`
  display: grid;
  gap: 16px;
  margin-top: 24px;

  ${media.md} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const FullWidth = styled.div`
  display: grid;
  gap: 8px;

  ${media.md} {
    grid-column: 1 / -1;
  }
`;

export const FieldShell = styled.div`
  display: grid;
  gap: 6px;
`;

export const FieldMessage = styled.div`
  min-height: 18px;
  display: flex;
  align-items: flex-start;
`;

export const Label = styled.label`
  color: var(--ink);
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const Input = styled.input`
  ${fieldStyles}
`;

export const SelectWrap = styled.div`
  position: relative;

  &::after {
    content: "▾";
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--rose-6);
    pointer-events: none;
  }
`;

export const Select = styled.select`
  ${fieldStyles}
  appearance: none;
  padding-right: 40px;
`;

export const Textarea = styled.textarea`
  ${fieldStyles}
  min-height: 110px;
  padding-top: 0.7rem;
  padding-bottom: 0.7rem;
  resize: vertical;
`;

export const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const InlineMeta = styled.span`
  color: var(--muted);
  font-size: ${({ theme }) => theme.fontSizes.xs};
  line-height: ${({ theme }) => theme.lineHeights.normal};
`;

export const RadioGrid = styled.div`
  display: grid;
  gap: 12px;

  ${media.md} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const RadioCard = styled.button<{ $active?: boolean }>`
  width: 100%;
  padding: 16px;
  border: 1px solid ${({ $active }) => ($active ? "var(--rose-5)" : "var(--line)")};
  border-radius: 14px;
  background: ${({ $active }) => ($active ? "var(--rose-2)" : "#fff")};
  display: flex;
  gap: 12px;
  align-items: center;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }

  ${interactiveFocus}
`;

export const RadioDot = styled.span<{ $active?: boolean }>`
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  border: 2px solid var(--rose-5);
  border-radius: 999px;
  display: grid;
  place-items: center;

  &::after {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--rose-5);
    opacity: ${({ $active }) => ($active ? 1 : 0)};
  }
`;

export const RadioContent = styled.span`
  display: grid;
  gap: 2px;
`;

export const RadioTitle = styled.span`
  color: var(--ink);
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const RadioText = styled.span`
  color: var(--muted);
  font-size: ${({ theme }) => theme.fontSizes.xs};
`;

export const CepRow = styled.div`
  display: grid;
  gap: 8px;

  ${media.md} {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
  }
`;

export const SearchButton = styled.button`
  min-height: 42px;
  padding: 0 16px;
  border: 0;
  border-radius: 12px;
  background: var(--rose-2);
  color: var(--rose-6);
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: var(--rose-3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }

  ${interactiveFocus}
`;

export const SummaryCard = styled.div`
  ${cardStyles}
  display: grid;
  gap: 20px;
  padding: 24px;
`;

export const SummaryBadge = styled.div`
  color: var(--rose-5);
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const SummaryTitle = styled.h3`
  margin: 0;
  color: var(--ink);
  font-family: var(--font-heading), serif;
  font-size: 2rem;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: 1.1;
`;

export const SummaryList = styled.dl`
  display: grid;
  gap: 12px;
  margin: 0;
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--line);

  &:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }
`;

export const SummaryTerm = styled.dt`
  color: var(--muted);
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const SummaryDescription = styled.dd`
  margin: 0;
  color: var(--ink);
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: right;
`;

export const PriceBox = styled.div`
  padding: 16px;
  border-radius: 16px;
  background: var(--rose-2);
`;

export const PriceLabel = styled.div`
  color: var(--muted);
  font-size: ${({ theme }) => theme.fontSizes.xs};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const PriceValue = styled.div`
  margin-top: 4px;
  color: var(--rose-6);
  font-family: var(--font-heading), serif;
  font-size: clamp(2rem, 2vw + 1rem, 2.4rem);
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: 1;
`;

export const PriceText = styled.p`
  margin: 4px 0 0;
  color: var(--muted);
  font-size: ${({ theme }) => theme.fontSizes.xs};
  line-height: ${({ theme }) => theme.lineHeights.normal};
`;

export const PrimaryButton = styled.button`
  width: 100%;
  min-height: 48px;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--rose-4) 0%, var(--rose-5) 50%, var(--rose-6) 100%);
  color: #fff;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  box-shadow: var(--shadow-soft);
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.15s ease;

  &:hover:not(:disabled) {
    opacity: 0.95;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }

  ${interactiveFocus}
`;

export const SummaryFootnote = styled.p`
  margin: 0;
  text-align: center;
  color: var(--muted);
  font-size: ${({ theme }) => theme.fontSizes.xs};
  line-height: ${({ theme }) => theme.lineHeights.normal};
`;

export const NotesCard = styled.div`
  ${cardStyles}
  display: grid;
  gap: 12px;
  padding: 20px 24px;
`;

export const NotesTitle = styled.strong`
  color: var(--ink);
  font-size: ${({ theme }) => theme.fontSizes.base};
`;

export const NotesList = styled.ul`
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
  color: var(--muted);
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

export const FeedbackCard = styled.div`
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(78, 155, 105, 0.24);
  background: #fff;
`;

export const FeedbackText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.success};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: ${({ theme }) => theme.lineHeights.normal};
`;
