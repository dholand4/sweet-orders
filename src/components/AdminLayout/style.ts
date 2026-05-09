import Link from "next/link";
import styled, { css, keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to   { transform: translateX(0); }
`;

// ─── Shell (root layout) ────────────────────────────────────
export const Shell = styled.div`
  display: flex;
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.adminBg};
`;

// ─── Sidebar ────────────────────────────────────────────────
export const Sidebar = styled.aside<{ $open: boolean }>`
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 90;
  display: flex;
  flex-direction: column;
  width: 256px;
  background: ${({ theme }) => theme.colors.adminSurface};
  border-right: 1px solid ${({ theme }) => theme.colors.adminBorder};
  padding: 0;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.adminBorder} transparent;
  transition: transform ${({ theme }) => theme.transitions.slow};

  @media (max-width: 1023px) {
    transform: translateX(${({ $open }) => ($open ? "0" : "-100%")});
    animation: ${({ $open }) => $open ? css`${slideIn} 0.28s ease` : "none"};
  }

  @media (min-width: 1024px) {
    position: sticky;
    top: 0;
    height: 100dvh;
    transform: none;
    flex-shrink: 0;
  }
`;

// ─── Sidebar brand ──────────────────────────────────────────
export const SidebarBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 28px 20px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.adminBorder};
`;

export const BrandIcon = styled.div`
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(222, 127, 155, 0.30);
`;

export const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
`;

export const BrandName = styled.span`
  font-family: var(--font-heading), serif;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.adminText};
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const BrandSub = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.adminTextMuted};
  white-space: nowrap;
`;

// ─── Nav ────────────────────────────────────────────────────
export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 16px 12px;
  flex: 1;
`;

export const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 8px;
`;

export const NavSectionLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.adminTextMuted};
  padding: 8px 8px 4px;
`;

export const NavLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ $active, theme }) =>
    $active ? theme.fontWeights.semibold : theme.fontWeights.normal};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.adminActiveText : theme.colors.adminTextMuted};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.adminActive : "transparent"};
  border: 1px solid ${({ $active, theme }) =>
    $active ? theme.colors.adminBorderHover : "transparent"};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.adminSurfaceHover};
    color: ${({ theme }) => theme.colors.adminText};
    border-color: ${({ theme }) => theme.colors.adminBorder};
  }
`;

export const NavIcon = styled.span`
  font-size: 16px;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
`;

// ─── Sidebar footer ─────────────────────────────────────────
export const SidebarFooter = styled.div`
  padding: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.adminBorder};
`;

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: rgba(239, 68, 68, 0.8);
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  text-align: left;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border-color: rgba(239, 68, 68, 0.2);
  }
`;

// ─── Backdrop ───────────────────────────────────────────────
export const Backdrop = styled.button`
  position: fixed;
  inset: 0;
  z-index: 80;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  border: 0;
  animation: ${fadeIn} 0.2s ease;
  cursor: default;

  @media (min-width: 1024px) {
    display: none;
  }
`;

// ─── Main area ──────────────────────────────────────────────
export const Main = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.bg};
`;

// ─── Topbar ─────────────────────────────────────────────────
export const Topbar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  height: 60px;
  background: rgba(253, 241, 244, 0.92);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(8px);

  @media (min-width: 1024px) {
    padding: 0 32px;
  }
`;

export const HamburgerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  font-size: 18px;
  transition: all ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.primarySoft};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

export const PageTitle = styled.h1`
  flex: 1;
  margin: 0;
  font-family: var(--font-heading), serif;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TopbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

export const StoreBadge = styled.a`
  display: none;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radii.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primarySoft};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  @media (min-width: 640px) {
    display: flex;
  }
`;

// ─── Content ────────────────────────────────────────────────
export const Content = styled.main`
  flex: 1;
  padding: 24px 20px;

  @media (min-width: 1024px) {
    padding: 32px;
  }
`;
