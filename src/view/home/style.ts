import styled from "styled-components";
import { Container } from "@/components/Container/style";
import { media } from "@/utils/media";

export const PageShell = styled.main`
  min-height: 100vh;
  padding-block: ${({ theme }) => theme.space[3]};
  background:
    radial-gradient(circle at top right, rgba(255, 217, 154, 0.18), transparent 22%),
    linear-gradient(180deg, ${({ theme }) => theme.colors.bg} 0%, ${({ theme }) => theme.colors.bgSecondary} 100%);
`;

export const PageContainer = styled(Container)`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};

  ${media.md} {
    gap: ${({ theme }) => theme.space[4]};
  }
`;

export const ContentGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  align-items: start;

  ${media.lg} {
    grid-template-columns: minmax(0, 1.35fr) minmax(300px, 0.75fr);
    gap: ${({ theme }) => theme.space[4]};
  }
`;

export const InfoCard = styled.aside`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
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

export const InfoTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.wine};
  font-family: var(--font-heading), serif;
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: ${({ theme }) => theme.lineHeights.tight};
`;

export const InfoText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

export const InfoList = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.space[3]};
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

export const HighlightCard = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[4]};
  border: 1px solid rgba(255, 217, 154, 0.6);
  border-radius: ${({ theme }) => theme.radii.md};
  background: linear-gradient(135deg, rgba(255, 217, 154, 0.12), rgba(255, 255, 255, 0.96));
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

export const HighlightLabel = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const HighlightValue = styled.strong`
  color: ${({ theme }) => theme.colors.wine};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: ${({ theme }) => theme.lineHeights.normal};
`;
