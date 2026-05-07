"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { OptionsManager } from "@/components/OptionsManager";
import type { AdminOptionsSnapshot } from "@/services/options";
import { Eyebrow, Heading, Text, Title, Wrapper } from "./style";

type AdminOptionsViewProps = {
  snapshot: AdminOptionsSnapshot;
};

export function AdminOptionsView({ snapshot }: AdminOptionsViewProps) {
  return (
    <AdminLayout
      title="Catalogo e opcoes"
      description="Gerencie produtos, tamanhos, sabores e coberturas sem apagar historico."
    >
      <Wrapper>
        <Heading>
          <Eyebrow>Painel da loja</Eyebrow>
          <Title>Configuracoes do catalogo</Title>
          <Text>
            Ative ou desative itens conforme a producao do dia e mantenha o
            formulario da cliente sempre sincronizado com o admin.
          </Text>
        </Heading>
        <OptionsManager snapshot={snapshot} />
      </Wrapper>
    </AdminLayout>
  );
}
