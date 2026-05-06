"use client";

import { Header } from "@/components/Header";
import { OrderForm } from "@/components/OrderForm";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import type { PublicOptionsSnapshot } from "@/services/options";
import { buildStoreWhatsAppLink } from "@/utils/format";
import {
  ContentGrid,
  HighlightCard,
  HighlightLabel,
  HighlightValue,
  InfoCard,
  InfoList,
  InfoText,
  InfoTitle,
  PageContainer,
  PageShell,
} from "./style";

type HomeViewProps = {
  options: PublicOptionsSnapshot;
};

export function HomeView({ options }: HomeViewProps) {
  return (
    <PageShell>
      <PageContainer>
        <Header
          adminHref="/admin"
          title="Encomende bolos e tortas com um formulario simples e elegante"
          subtitle="Informe seus dados, escolha o tipo de produto, sabores e entrega. A confirmacao final acontece no WhatsApp, sem pagamento online nesta etapa."
        />
        <ContentGrid>
          <OrderForm options={options} />
          <InfoCard>
            <div>
              <InfoTitle>Informacoes rapidas</InfoTitle>
              <InfoText>
                O formulario foi organizado para voce preencher em poucos minutos
                e enviar uma solicitacao clara para a equipe.
              </InfoText>
            </div>

            <HighlightCard>
              <HighlightLabel>Como funciona</HighlightLabel>
              <HighlightValue>
                Voce envia a solicitacao e a recepcionista confirma o pedido
                manualmente pelo WhatsApp.
              </HighlightValue>
            </HighlightCard>

            <div>
              <InfoTitle>O que pedir por aqui</InfoTitle>
              <InfoList>
                <li>Bolos tradicionais, scrap cakes, chantininho e tortas.</li>
                <li>Escolha de tamanho, sabor, recheio e cobertura.</li>
                <li>Tema opcional com espaco para descrever a ideia.</li>
                <li>Endereco manual ou apoio por CEP para agilizar.</li>
              </InfoList>
            </div>

            <div>
              <InfoTitle>Importante saber</InfoTitle>
              <InfoList>
                <li>Taxa extra pode ser aplicada em bairros mais distantes.</li>
                <li>Tema em papel fotografico tem custo adicional.</li>
                <li>Tema 3D e detalhes especiais sao combinados depois.</li>
              </InfoList>
            </div>

            <WhatsAppButton
              href={buildStoreWhatsAppLink(
                "Ola! Gostaria de tirar uma duvida antes de enviar meu pedido.",
              )}
              label="Falar com a loja no WhatsApp"
              variant="secondary"
            />
          </InfoCard>
        </ContentGrid>
      </PageContainer>
    </PageShell>
  );
}
