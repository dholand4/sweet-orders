"use client";

import { AdminLogin } from "@/components/AdminLogin";
import { Header } from "@/components/Header";
import {
  Intro,
  IntroText,
  IntroTitle,
  PageContainer,
  PageShell,
} from "./style";

export function AdminLoginView() {
  return (
    <PageShell>
      <PageContainer>
        <Intro>
          <Header
            title="Painel privado da recepção"
            subtitle="Consulte pedidos recentes, confirme pelo WhatsApp e mantenha o catálogo organizado sem depender de planilhas."
          />
          <IntroTitle>Organização delicada, operação ágil.</IntroTitle>
          <IntroText>
            O painel foi pensado para a rotina da recepção: leitura rápida,
            ações objetivas e acompanhamento claro do status de cada pedido.
          </IntroText>
        </Intro>
        <AdminLogin />
      </PageContainer>
    </PageShell>
  );
}
