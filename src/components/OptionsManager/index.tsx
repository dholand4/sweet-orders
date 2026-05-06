"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminOptionsSnapshot } from "@/services/options";
import {
  Actions,
  Button,
  CheckboxRow,
  ErrorText,
  FormCard,
  Grid,
  Input,
  Section,
  SectionHeader,
  SectionText,
  SectionTitle,
  Select,
  Shell,
  StatusText,
  SuccessText,
} from "./style";
import type { OptionsManagerProps } from "./types";

type SimpleEntity = "product_types" | "flavors" | "fillings" | "toppings";

type SavePayload =
  | {
      entity: SimpleEntity;
      id?: string;
      name: string;
      slug?: string;
      active: boolean;
    }
  | {
      entity: "product_sizes";
      id?: string;
      name: string;
      productTypeId: string;
      servings: string;
      price: number;
      active: boolean;
    };

const sectionConfig = [
  { entity: "product_types", label: "Tipos de produto", sourceKey: "productTypes" },
  { entity: "flavors", label: "Sabores", sourceKey: "flavors" },
  { entity: "fillings", label: "Recheios", sourceKey: "fillings" },
  { entity: "toppings", label: "Coberturas e estilos", sourceKey: "toppings" },
] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type SimpleSectionProps = {
  entity: SimpleEntity;
  label: string;
  items: AdminOptionsSnapshot["productTypes"] | AdminOptionsSnapshot["flavors"];
  onSave: (payload: SavePayload) => Promise<void>;
};

function SimpleSection({ entity, label, items, onSave }: SimpleSectionProps) {
  const isProductType = entity === "product_types";

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>{label}</SectionTitle>
        <SectionText>Cadastre, edite e desative opções sem apagar histórico.</SectionText>
      </SectionHeader>
      <Grid>
        <FormCard
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const name = String(formData.get("name") || "");
            const active = formData.get("active") === "on";
            await onSave({
              entity,
              name,
              active,
              slug: isProductType ? slugify(name) : undefined,
            });
            event.currentTarget.reset();
          }}
        >
          <strong>Novo item</strong>
          <Input name="name" placeholder={`Adicionar ${label.toLowerCase()}`} />
          <CheckboxRow>
            <input type="checkbox" name="active" defaultChecked />
            Ativo
          </CheckboxRow>
          <Button type="submit">Salvar</Button>
        </FormCard>
        {items.map((item) => (
          <FormCard
            key={item.id}
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const name = String(formData.get("name") || "");
              const active = formData.get("active") === "on";
              await onSave({
                entity,
                id: item.id,
                name,
                active,
                slug: isProductType ? slugify(name) : undefined,
              });
            }}
          >
            <strong>Editar item</strong>
            <Input name="name" defaultValue={item.name} />
            <CheckboxRow>
              <input type="checkbox" name="active" defaultChecked={item.active} />
              Ativo
            </CheckboxRow>
            {isProductType ? <StatusText>Slug gerado automaticamente.</StatusText> : null}
            <Button type="submit" $secondary>
              Atualizar
            </Button>
          </FormCard>
        ))}
      </Grid>
    </Section>
  );
}

export function OptionsManager({ snapshot }: OptionsManagerProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  async function save(payload: SavePayload) {
    setFeedback("");
    setError("");

    const response = await fetch("/api/admin/options", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setError(result.message || "Não foi possível salvar.");
      return;
    }

    setFeedback("Opção salva com sucesso.");
    router.refresh();
  }

  return (
    <Shell>
      {feedback ? <SuccessText>{feedback}</SuccessText> : null}
      {error ? <ErrorText>{error}</ErrorText> : null}

      {sectionConfig.map((section) => (
        <SimpleSection
          key={section.entity}
          entity={section.entity}
          label={section.label}
          items={snapshot[section.sourceKey]}
          onSave={save}
        />
      ))}

      <Section>
        <SectionHeader>
          <SectionTitle>Tamanhos e preços</SectionTitle>
          <SectionText>
            Vincule cada tamanho ao tipo de produto correto e ajuste os preços sem
            apagar os registros antigos.
          </SectionText>
        </SectionHeader>
        <Grid>
          <FormCard
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              await save({
                entity: "product_sizes",
                name: String(formData.get("name") || ""),
                productTypeId: String(formData.get("productTypeId") || ""),
                servings: String(formData.get("servings") || ""),
                price: Number(formData.get("price") || 0),
                active: formData.get("active") === "on",
              });
              event.currentTarget.reset();
            }}
          >
            <strong>Novo tamanho</strong>
            <Select name="productTypeId" defaultValue="">
              <option value="" disabled>
                Selecione o tipo
              </option>
              {snapshot.productTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Select>
            <Input name="name" placeholder="Ex.: Bolo 16cm (1 recheio + cobertura)" />
            <Input name="servings" placeholder="Ex.: 10 fatias" />
            <Input name="price" type="number" step="0.01" placeholder="70.00" />
            <CheckboxRow>
              <input type="checkbox" name="active" defaultChecked />
              Ativo
            </CheckboxRow>
            <Button type="submit">Salvar</Button>
          </FormCard>

          {snapshot.productSizes.map((item) => (
            <FormCard
              key={item.id}
              onSubmit={async (event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                await save({
                  entity: "product_sizes",
                  id: item.id,
                  name: String(formData.get("name") || ""),
                  productTypeId: String(formData.get("productTypeId") || ""),
                  servings: String(formData.get("servings") || ""),
                  price: Number(formData.get("price") || 0),
                  active: formData.get("active") === "on",
                });
              }}
            >
              <strong>Editar tamanho</strong>
              <Select name="productTypeId" defaultValue={item.product_type_id}>
                {snapshot.productTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Select>
              <Input name="name" defaultValue={item.name} />
              <Input name="servings" defaultValue={item.servings ?? ""} />
              <Input
                name="price"
                type="number"
                step="0.01"
                defaultValue={item.price}
              />
              <CheckboxRow>
                <input type="checkbox" name="active" defaultChecked={item.active} />
                Ativo
              </CheckboxRow>
              <Button type="submit" $secondary>
                Atualizar
              </Button>
            </FormCard>
          ))}
        </Grid>
      </Section>
    </Shell>
  );
}
