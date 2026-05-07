import Link from "next/link";
import styled, { css } from "styled-components";
import { Container } from "@/components/Container/style";
import { media } from "@/utils/media";

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

export const Shell = styled.div`
  min-height: 100vh;
  background:
    radial-gradient(circle at top center, rgba(255, 255, 255, 0.34), transparent 24%),
    linear-gradient(180deg, ${({ theme }) => theme.colors.bg} 0%, ${({ theme }) => theme.colors.bgSecondary} 100%);
`;

export const PageContainer = styled(Container)`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  padding-top: ${({ theme }) => theme.space[4]};
  padding-bottom: ${({ theme }) => theme.space[5]};
`;

export const Topbar = styled.div`
  position: relative;
  overflow: hidden;
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  padding: ${({ theme }) => theme.space[5]};
  border: 1px solid rgba(255, 255, 255, 0.42);
  border-radius: 32px;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.4), transparent 24%),
    linear-gradient(135deg, rgba(247, 204, 216, 0.95) 0%, rgba(231, 150, 173, 0.96) 50%, rgba(141, 41, 64, 0.94) 100%);
  box-shadow: 0 24px 56px -28px rgba(110, 36, 57, 0.34);

  ${media.lg} {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
  }
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
`;

export const TitleWrap = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
`;

export const Title = styled.h1`
  margin: 0;
  color: #fff;
  font-family: var(--font-heading), serif;
  font-size: clamp(2.2rem, 3vw + 1rem, 3.5rem);
  line-height: 1.05;
  text-shadow: 0 10px 24px rgba(110, 36, 57, 0.2);
`;

export const Description = styled.p`
  max-width: 44rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.92);
  font-size: ${({ theme }) => theme.fontSizes.base};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

export const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
  flex-wrap: wrap;
  justify-content: flex-end;
`;

export const NavLink = styled(Link)<{ $active?: boolean }>`
  ${pillButton}
  border: 1px solid rgba(255, 255, 255, 0.34);
  background: ${({ $active }) =>
    $active ? "rgba(255, 255, 255, 0.26)" : "rgba(255, 255, 255, 0.14)"};
  color: #fff;
  backdrop-filter: blur(6px);
`;

export const LogoutButton = styled.button`
  ${pillButton}
  border: 1px solid rgba(255, 255, 255, 0.34);
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(6px);
`;

export const ContentCard = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  padding: ${({ theme }) => theme.space[4]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 24px 56px -34px rgba(110, 36, 57, 0.24);
  backdrop-filter: blur(6px);
`;
