"use client";

import { Logo } from "@/components/Logo";
import { OrderForm } from "@/components/OrderForm";
import type { PublicCatalog } from "@/services/options";
import {
  AdminLink,
  ContentWrap,
  Footer,
  Hero,
  HeroContainer,
  HeroContent,
  HeroGlow,
  HeroLogoFrame,
  HeroLogoWrap,
  HeroSubtitle,
  HeroTitle,
  HeroTopBar,
  PageShell,
} from "./style";

type HomeViewProps = {
  catalog: PublicCatalog;
};

export function HomeView({ catalog }: HomeViewProps) {
  return (
    <PageShell>
      <Hero>
        <HeroGlow />
        <HeroContainer>
          <HeroTopBar>
            <div />
            <AdminLink href="/admin">Entrar no admin</AdminLink>
          </HeroTopBar>

          <HeroContent>
            <HeroLogoWrap>
              <HeroLogoFrame>
                <Logo size={168} priority />
              </HeroLogoFrame>
            </HeroLogoWrap>
            <HeroTitle>Dany Ruivo</HeroTitle>
            <HeroSubtitle>
              Monte seu pedido em poucos passos. Bolos e tortas feitos com carinho,
              do seu jeito, com confirmação final diretamente no WhatsApp.
            </HeroSubtitle>
          </HeroContent>
        </HeroContainer>
      </Hero>

      <ContentWrap>
        <OrderForm catalog={catalog} />
      </ContentWrap>

      <Footer>Feito com carinho para adoçar os seus pedidos.</Footer>
    </PageShell>
  );
}
