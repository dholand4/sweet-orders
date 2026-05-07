"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Brand,
  ContentCard,
  Description,
  DrawerBackdrop,
  DrawerCloseButton,
  LogoutButton,
  MenuButton,
  MobileTitle,
  Nav,
  NavLink,
  PageContainer,
  Shell,
  Title,
  TitleWrap,
  Topbar,
} from "./style";
import type { AdminLayoutProps } from "./types";

export function AdminLayout({
  title,
  description,
  children,
}: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    setIsMenuOpen(false);
    router.push("/admin");
    router.refresh();
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <Shell>
      <PageContainer>
        <Topbar>
          <MobileTitle>Painel administrativo</MobileTitle>
          <MenuButton
            type="button"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
          >
            {isMenuOpen ? "Fechar" : "Menu"}
          </MenuButton>

          <Brand>
            <TitleWrap>
              <Title>{title}</Title>
              <Description>{description}</Description>
            </TitleWrap>
          </Brand>

          <div>
            <Nav $open={isMenuOpen}>
              <DrawerCloseButton type="button" onClick={closeMenu}>
                Fechar
              </DrawerCloseButton>
              <NavLink
                href="/admin/pedidos"
                $active={pathname === "/admin/pedidos"}
                onClick={closeMenu}
              >
                Pedidos
              </NavLink>
              <NavLink
                href="/admin/opcoes"
                $active={pathname === "/admin/opcoes"}
                onClick={closeMenu}
              >
                Opções
              </NavLink>
              <LogoutButton type="button" onClick={handleLogout}>
                Sair
              </LogoutButton>
            </Nav>
          </div>
        </Topbar>

        {isMenuOpen ? <DrawerBackdrop role="presentation" onClick={closeMenu} /> : null}

        <ContentCard>{children}</ContentCard>
      </PageContainer>
    </Shell>
  );
}
