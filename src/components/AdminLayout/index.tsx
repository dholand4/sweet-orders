"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import logoImg from "@/assets/logotipo.png";
import { AdminProgressBar } from "@/components/AdminProgressBar";
import {
  Backdrop,
  BrandIcon,
  BrandName,
  BrandSub,
  BrandText,
  Content,
  HamburgerButton,
  LogoutButton,
  Main,
  Nav,
  NavIcon,
  NavLink,
  NavSection,
  NavSectionLabel,
  PageTitle,
  Shell,
  Sidebar,
  SidebarBrand,
  SidebarFooter,
  StoreBadge,
  Topbar,
  TopbarActions,
} from "./style";
import type { AdminLayoutProps } from "./types";

const NAV_ITEMS = [
  { href: "/admin/dashboard",  icon: "◈",  label: "Dashboard" },
  { href: "/admin/pedidos",    icon: "📋", label: "Pedidos" },
  { href: "/admin/produtos",   icon: "🎂", label: "Produtos" },
  { href: "/admin/sabores",    icon: "🍰", label: "Sabores" },
  { href: "/admin/temas",      icon: "🎨", label: "Temas" },
  { href: "/admin/relatorios", icon: "📊", label: "Relatórios" },
  { href: "/admin/configuracoes", icon: "⚙", label: "Configurações" },
];

export function AdminLayout({ title, children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <Shell>
      <AdminProgressBar />
      <Sidebar $open={open}>
        <SidebarBrand>
          <BrandIcon>
              <Image
                src={logoImg}
                alt="Dany Ruivo"
                fill
                style={{ objectFit: "contain" }}
                sizes="44px"
              />
            </BrandIcon>
          <BrandText>
            <BrandName>Dany Ruivo</BrandName>
            <BrandSub>Bolos e Tortas</BrandSub>
          </BrandText>
        </SidebarBrand>

        <Nav>
          <NavSection>
            <NavSectionLabel>Menu</NavSectionLabel>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                $active={pathname === item.href || pathname.startsWith(item.href + "/")}
                onClick={() => setOpen(false)}
              >
                <NavIcon>{item.icon}</NavIcon>
                {item.label}
              </NavLink>
            ))}
          </NavSection>
        </Nav>

        <SidebarFooter>
          <LogoutButton type="button" onClick={handleLogout}>
            <NavIcon>⟵</NavIcon>
            Sair do painel
          </LogoutButton>
        </SidebarFooter>
      </Sidebar>

      {open && <Backdrop onClick={() => setOpen(false)} />}

      <Main>
        <Topbar>
          <HamburgerButton
            type="button"
            aria-label="Abrir menu"
            onClick={() => setOpen(true)}
          >
            ☰
          </HamburgerButton>
          <PageTitle>{title}</PageTitle>
          <TopbarActions>
            <StoreBadge href="/" target="_blank" rel="noreferrer">
              ↗ Ver loja
            </StoreBadge>
          </TopbarActions>
        </Topbar>

        <Content>{children}</Content>
      </Main>
    </Shell>
  );
}
