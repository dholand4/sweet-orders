"use client";

import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import {
  Brand,
  ContentCard,
  Description,
  LogoutButton,
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

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    router.push("/admin");
    router.refresh();
  }

  return (
    <Shell>
      <PageContainer>
        <Topbar>
          <Brand>
            <Logo size={76} />
            <TitleWrap>
              <Title>{title}</Title>
              <Description>{description}</Description>
            </TitleWrap>
          </Brand>
          <div>
            <Nav>
              <NavLink href="/admin/pedidos" $active={pathname === "/admin/pedidos"}>
                Pedidos
              </NavLink>
              <NavLink href="/admin/opcoes" $active={pathname === "/admin/opcoes"}>
                Opções
              </NavLink>
              <LogoutButton type="button" onClick={handleLogout}>
                Sair
              </LogoutButton>
            </Nav>
          </div>
        </Topbar>
        <ContentCard>{children}</ContentCard>
      </PageContainer>
    </Shell>
  );
}
