import styled from "styled-components";
import { Container } from "@/components/Container/style";
import { media } from "@/utils/media";

export const PageShell = styled.main`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 16px;
  background:
    radial-gradient(circle at top center, rgba(255, 255, 255, 0.34), transparent 24%),
    linear-gradient(180deg, ${({ theme }) => theme.colors.bg} 0%, ${({ theme }) => theme.colors.bgSecondary} 100%);

  ${media.md} {
    padding: 24px;
  }
`;

export const PageContainer = styled(Container)`
  display: grid;
  place-items: center;
  width: 100%;
  min-height: calc(100dvh - 32px);
  padding-top: 0;
  padding-bottom: 0;

  ${media.md} {
    min-height: calc(100dvh - 48px);
  }
`;
