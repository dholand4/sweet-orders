import styled from "styled-components";

export const PriceCard = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
  width: 100%;
  padding: ${({ theme }) => theme.space[4]};
  border: 1px solid rgba(255, 217, 154, 0.58);
  border-radius: ${({ theme }) => theme.radii.md};
  background: linear-gradient(135deg, rgba(255, 217, 154, 0.18), rgba(255, 255, 255, 0.98));
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const PriceCaption = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const PriceValue = styled.strong`
  color: ${({ theme }) => theme.colors.wine};
  font-family: var(--font-heading), serif;
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: ${({ theme }) => theme.lineHeights.tight};
`;
