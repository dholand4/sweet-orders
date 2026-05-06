import Link from "next/link";
import styled, { css } from "styled-components";
import { Container } from "@/components/Container/style";
import { media } from "@/utils/media";

export const Shell = styled.div`
  min-height: 100vh;
  padding-block: ${({ theme }) => theme.space[3]};
  background:
    radial-gradient(circle at top left, rgba(255, 217, 154, 0.18), transparent 28%),
    linear-gradient(180deg, ${({ theme }) => theme.colors.bg} 0%, ${({ theme }) => theme.colors.bgSecondary} 100%);
`;

export const PageContainer = styled(Container)`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

export const Topbar = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  ${media.lg} {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
  }
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
`;

export const TitleWrap = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
`;

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.wine};
  font-family: var(--font-heading), serif;
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  line-height: ${({ theme }) => theme.lineHeights.tight};
`;

export const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.normal};
`;

export const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
  flex-wrap: wrap;
`;

const navButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  transition: all 0.2s ease;
`;

export const NavLink = styled(Link)<{ $active?: boolean }>`
  ${navButtonStyles}
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryHover})` : theme.colors.surface};
  color: ${({ $active, theme }) => ($active ? theme.colors.surface : theme.colors.wine)};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

export const LogoutButton = styled.button`
  ${navButtonStyles}
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.wine};
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

export const ContentCard = styled.section`
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;
