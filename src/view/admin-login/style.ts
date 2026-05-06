import styled from "styled-components";
import { Container } from "@/components/Container/style";
import { media } from "@/utils/media";

export const PageShell = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding-block: ${({ theme }) => theme.space[4]};
  background:
    radial-gradient(circle at top left, rgba(255, 217, 154, 0.18), transparent 28%),
    linear-gradient(180deg, ${({ theme }) => theme.colors.bg} 0%, ${({ theme }) => theme.colors.bgSecondary} 100%);
`;

export const PageContainer = styled(Container)`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};

  ${media.lg} {
    grid-template-columns: minmax(0, 1fr) minmax(360px, 30rem);
    align-items: center;
  }
`;

export const Intro = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
`;

export const IntroTitle = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.wine};
  font-family: var(--font-heading), serif;
  font-size: ${({ theme }) => theme.fontSizes["4xl"]};
  line-height: ${({ theme }) => theme.lineHeights.tight};
`;

export const IntroText = styled.p`
  max-width: 34rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.base};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;
