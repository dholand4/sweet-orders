"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { OptionsManager } from "@/components/OptionsManager";
import type { AdminOptionsSnapshot } from "@/services/options";
import { Heading, Text, Title, Wrapper } from "./style";

type AdminOptionsViewProps = {
  snapshot: AdminOptionsSnapshot;
};

export function AdminOptionsView({ snapshot }: AdminOptionsViewProps) {
  return (
    <AdminLayout
      title="Catálogo e opções"
      description="Gerencie produtos, tamanhos, sabores e coberturas sem apagar histórico."
    >
      <Wrapper>
        <Heading>
          <Title>Configurações do catálogo</Title>
          <Text>
            Ative ou desative itens conforme a produção do dia e mantenha o
            formulário do cliente sempre sincronizado com o admin.
          </Text>
        </Heading>
        <OptionsManager snapshot={snapshot} />
      </Wrapper>
    </AdminLayout>
  );
}
