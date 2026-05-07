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
  padding: ${({ theme }) => theme.space[4]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 32px;
  background: #d9859c;
  box-shadow: 0 24px 56px -28px rgba(110, 36, 57, 0.34);

  @media (max-width: 767px) {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    padding: ${({ theme }) => theme.space[3]};
    border-radius: 24px;
  }

  ${media.lg} {
    padding: ${({ theme }) => theme.space[5]};
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
  }
`;

export const Brand = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};

  @media (max-width: 767px) {
    display: none;
  }
`;

export const MobileTitle = styled.span`
  color: #fff;
  font-family: var(--font-heading), serif;
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: ${({ theme }) => theme.lineHeights.tight};

  ${media.md} {
    display: none;
  }
`;

export const MenuButton = styled.button`
  ${pillButton}
  border: 1px solid rgba(255, 255, 255, 0.34);
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  cursor: pointer;
  justify-self: end;
  backdrop-filter: blur(6px);

  ${media.md} {
    display: none;
  }
`;

export const TitleWrap = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
`;

export const Title = styled.h1`
  margin: 0;
  color: #fff;
  font-family: var(--font-heading), serif;
  font-size: clamp(1.9rem, 4vw + 0.9rem, 3.5rem);
  line-height: 1.05;
  text-shadow: 0 10px 24px rgba(110, 36, 57, 0.2);
`;

export const Description = styled.p`
  max-width: 44rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.92);
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.normal};

  ${media.md} {
    font-size: ${({ theme }) => theme.fontSizes.base};
    line-height: ${({ theme }) => theme.lineHeights.relaxed};
  }
`;

export const Nav = styled.nav<{ $open?: boolean }>`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};

  @media (max-width: 767px) {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 80;
    width: min(82vw, 320px);
    padding: ${({ theme }) => theme.space[4]};
    flex-direction: column;
    justify-content: flex-start;
    border-left: 1px solid rgba(255, 255, 255, 0.32);
    background:
      linear-gradient(180deg, rgba(255, 245, 248, 0.98), rgba(246, 206, 218, 0.98)),
      ${({ theme }) => theme.colors.surface};
    box-shadow: -18px 0 42px -24px rgba(58, 29, 42, 0.38);
    transform: translateX(${({ $open }) => ($open ? "0" : "108%")});
    transition: transform 0.28s ease;
  }

  ${media.md} {
    flex-wrap: nowrap;
    justify-content: flex-start;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  ${media.lg} {
    justify-content: flex-end;
    overflow: visible;
  }
`;

export const DrawerBackdrop = styled.button`
  position: fixed;
  inset: 0;
  z-index: 70;
  border: 0;
  background: rgba(78, 43, 57, 0.48);

  ${media.md} {
    display: none;
  }
`;

export const DrawerCloseButton = styled.button`
  ${pillButton}
  align-self: flex-end;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.84);
  color: ${({ theme }) => theme.colors.wine};
  cursor: pointer;

  ${media.md} {
    display: none;
  }
`;

export const NavLink = styled(Link)<{ $active?: boolean }>`
  ${pillButton}
  flex: 0 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.34);
  background: ${({ $active }) =>
    $active ? "rgba(255, 255, 255, 0.26)" : "rgba(255, 255, 255, 0.14)"};
  color: #fff;
  backdrop-filter: blur(6px);

  @media (max-width: 767px) {
    width: 100%;
    justify-content: center;
    border-color: ${({ theme }) => theme.colors.border};
    background: ${({ $active, theme }) =>
      $active
        ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryHover})`
        : "rgba(255, 255, 255, 0.88)"};
    color: ${({ $active, theme }) => ($active ? theme.colors.surface : theme.colors.wine)};
    backdrop-filter: none;
  }
`;

export const LogoutButton = styled.button`
  ${pillButton}
  flex: 0 0 auto;
  border: 1px solid rgba(255, 221, 221, 0.28);
  background: rgba(179, 54, 82, 0.88);
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(6px);

  @media (max-width: 767px) {
    width: 100%;
    background: linear-gradient(135deg, #cf4d66, #aa2944);
    border-color: rgba(170, 41, 68, 0.18);
    backdrop-filter: none;
  }
`;

export const ContentCard = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  padding: ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 24px 56px -34px rgba(110, 36, 57, 0.24);
  backdrop-filter: blur(6px);

  ${media.md} {
    padding: ${({ theme }) => theme.space[4]};
  }
`;
