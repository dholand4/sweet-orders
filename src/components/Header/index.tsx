import { Logo } from "@/components/Logo";
import {
  AdminLink,
  BrandBlock,
  Eyebrow,
  HeaderShell,
  HeaderSubtitle,
  HeaderTitle,
  HeaderTop,
  TextBlock,
} from "./style";
import type { HeaderProps } from "./types";

export function Header({
  title = "Pedidos online com toque artesanal",
  subtitle = "Monte sua encomenda com carinho e envie sua solicitação. A equipe da Dany Ruivo confirma tudo pelo WhatsApp com você.",
  adminHref,
}: HeaderProps) {
  return (
    <HeaderShell>
      <HeaderTop>
        <BrandBlock>
          <Logo size={88} priority />
          <TextBlock>
            <Eyebrow>Confeitaria premium</Eyebrow>
            <HeaderTitle>Dany Ruivo</HeaderTitle>
          </TextBlock>
        </BrandBlock>
        {adminHref ? <AdminLink href={adminHref}>Entrar no admin</AdminLink> : null}
      </HeaderTop>
      <div>
        <HeaderSubtitle>{title}</HeaderSubtitle>
        <HeaderSubtitle>{subtitle}</HeaderSubtitle>
      </div>
    </HeaderShell>
  );
}
