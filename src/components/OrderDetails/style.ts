import styled from "styled-components";
import { media } from "@/utils/media";

export const DetailsShell = styled.aside`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: linear-gradient(180deg, rgba(252, 232, 240, 0.38), rgba(255, 255, 255, 0.98));
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (max-width: 767px) {
    padding: ${({ theme }) => theme.space[1]} 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }
`;

export const DetailsTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.wine};
  font-family: var(--font-heading), serif;
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  line-height: ${({ theme }) => theme.lineHeights.tight};

  ${media.md} {
    font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  }
`;

export const DetailsText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

export const DetailGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};

  @media (max-width: 767px) {
    gap: ${({ theme }) => theme.space[2]};
  }
`;

export const DetailItem = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
  padding-bottom: ${({ theme }) => theme.space[2]};
  border-bottom: 1px solid rgba(219, 178, 192, 0.45);

  &:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }
`;

export const DetailLabel = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const DetailValue = styled.strong`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: ${({ theme }) => theme.lineHeights.normal};
`;
