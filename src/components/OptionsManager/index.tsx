"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { AdminOptionsSnapshot } from "@/services/options";
import { formatCurrencyBRL } from "@/utils/format";
import {
  CardList,
  CheckboxRow,
  ComposerCard,
  ComposerTitle,
  EmptyState,
  FeedbackCard,
  FeedbackRow,
  FieldShell,
  FormGrid,
  GhostButton,
  HelperText,
  Input,
  ItemActions,
  ItemCard,
  ItemForm,
  ItemHead,
  ItemMeta,
  ItemTitle,
  Label,
  PrimaryButton,
  SecondaryButton,
  Section,
  SectionBody,
  SectionCount,
  SectionEyebrow,
  SectionHeader,
  SectionHeading,
  SectionText,
  SectionTitle,
  Select,
  Shell,
  StatusPill,
  ToggleButton,
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

type SimpleItem =
  AdminOptionsSnapshot["productTypes"][number] |
  AdminOptionsSnapshot["flavors"][number] |
  AdminOptionsSnapshot["fillings"][number] |
  AdminOptionsSnapshot["toppings"][number];

type ProductSizeItem = AdminOptionsSnapshot["productSizes"][number];

const sectionConfig = [
  {
    entity: "product_types",
    eyebrow: "Tipos",
    label: "Tipos de produto",
    description: "Base para organizar os tamanhos vinculados no formulario da cliente.",
    sourceKey: "productTypes",
  },
  {
    entity: "flavors",
    eyebrow: "Sabores",
    label: "Sabores",
    description: "Defina o que aparece como massa principal ou sabor da encomenda.",
    sourceKey: "flavors",
  },
  {
    entity: "fillings",
    eyebrow: "Recheios",
    label: "Recheios",
    description: "Mantenha os recheios ativos conforme sua producao do dia.",
    sourceKey: "fillings",
  },
  {
    entity: "toppings",
    eyebrow: "Coberturas",
    label: "Coberturas e estilos",
    description: "Controle coberturas, acabamentos e estilos visuais do bolo.",
    sourceKey: "toppings",
  },
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
  eyebrow: string;
  label: string;
  description: string;
  items: SimpleItem[];
  onSave: (payload: SavePayload) => Promise<boolean>;
};

function SimpleItemEditor({
  entity,
  item,
  onSave,
}: {
  entity: SimpleEntity;
  item: SimpleItem;
  onSave: (payload: SavePayload) => Promise<boolean>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [active, setActive] = useState(item.active);
  const isProductType = entity === "product_types";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const saved = await onSave({
      entity,
      id: item.id,
      name,
      active,
      slug: isProductType ? slugify(name) : undefined,
    });

    if (saved) {
      setIsEditing(false);
    }
  }

  async function handleToggle() {
    const nextActive = !active;
    const saved = await onSave({
      entity,
      id: item.id,
      name,
      active: nextActive,
      slug: isProductType ? slugify(name) : undefined,
    });

    if (saved) {
      setActive(nextActive);
    }
  }

  function handleCancel() {
    setName(item.name);
    setActive(item.active);
    setIsEditing(false);
  }

  return (
    <ItemCard>
      <ItemHead>
        <div>
          <ItemTitle>{item.name}</ItemTitle>
          <ItemMeta>
            {isProductType ? `Slug: ${"slug" in item ? item.slug : ""}` : "Item do catalogo"}
          </ItemMeta>
        </div>
        <StatusPill $active={active}>{active ? "Ativo" : "Inativo"}</StatusPill>
      </ItemHead>

      {isEditing ? (
        <ItemForm onSubmit={handleSubmit}>
          <FieldShell>
            <Label htmlFor={`${entity}-${item.id}-name`}>Nome</Label>
            <Input
              id={`${entity}-${item.id}-name`}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </FieldShell>

          <CheckboxRow>
            <input
              type="checkbox"
              checked={active}
              onChange={(event) => setActive(event.target.checked)}
            />
            Manter ativo
          </CheckboxRow>

          {isProductType ? <HelperText>O slug continua sendo gerado automaticamente.</HelperText> : null}

          <ItemActions>
            <PrimaryButton type="submit">Salvar alteracoes</PrimaryButton>
            <GhostButton type="button" onClick={handleCancel}>
              Cancelar
            </GhostButton>
          </ItemActions>
        </ItemForm>
      ) : (
        <ItemActions>
          <SecondaryButton type="button" onClick={() => setIsEditing(true)}>
            Editar
          </SecondaryButton>
          <ToggleButton type="button" $active={active} onClick={handleToggle}>
            {active ? "Desativar" : "Ativar"}
          </ToggleButton>
        </ItemActions>
      )}
    </ItemCard>
  );
}

function SimpleSection({
  entity,
  eyebrow,
  label,
  description,
  items,
  onSave,
}: SimpleSectionProps) {
  const isProductType = entity === "product_types";

  return (
    <Section>
      <SectionHeader>
        <SectionHeading>
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <SectionTitle>{label}</SectionTitle>
          <SectionText>{description}</SectionText>
        </SectionHeading>
        <SectionCount>{items.length} cadastrados</SectionCount>
      </SectionHeader>

      <SectionBody>
        <ComposerCard
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const name = String(formData.get("name") || "");
            const active = formData.get("active") === "on";
            const saved = await onSave({
              entity,
              name,
              active,
              slug: isProductType ? slugify(name) : undefined,
            });

            if (saved) {
              event.currentTarget.reset();
            }
          }}
        >
          <ComposerTitle>Novo item</ComposerTitle>
          <FormGrid>
            <FieldShell>
              <Label htmlFor={`${entity}-create-name`}>Nome</Label>
              <Input id={`${entity}-create-name`} name="name" placeholder={`Adicionar ${label.toLowerCase()}`} />
            </FieldShell>

            <CheckboxRow>
              <input type="checkbox" name="active" defaultChecked />
              Criar como ativo
            </CheckboxRow>

            {isProductType ? <HelperText>O slug sera criado automaticamente a partir do nome.</HelperText> : null}

            <PrimaryButton type="submit">Cadastrar item</PrimaryButton>
          </FormGrid>
        </ComposerCard>

        {items.length ? (
          <CardList>
            {items.map((item) => (
              <SimpleItemEditor key={item.id} entity={entity} item={item} onSave={onSave} />
            ))}
          </CardList>
        ) : (
          <EmptyState>Nenhum item cadastrado ainda nesta secao.</EmptyState>
        )}
      </SectionBody>
    </Section>
  );
}

function ProductSizeEditor({
  item,
  productTypes,
  onSave,
}: {
  item: ProductSizeItem;
  productTypes: AdminOptionsSnapshot["productTypes"];
  onSave: (payload: SavePayload) => Promise<boolean>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [productTypeId, setProductTypeId] = useState(item.product_type_id);
  const [servings, setServings] = useState(item.servings ?? "");
  const [price, setPrice] = useState(String(item.price));
  const [active, setActive] = useState(item.active);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const saved = await onSave({
      entity: "product_sizes",
      id: item.id,
      name,
      productTypeId,
      servings,
      price: Number(price || 0),
      active,
    });

    if (saved) {
      setIsEditing(false);
    }
  }

  async function handleToggle() {
    const nextActive = !active;
    const saved = await onSave({
      entity: "product_sizes",
      id: item.id,
      name,
      productTypeId,
      servings,
      price: Number(price || 0),
      active: nextActive,
    });

    if (saved) {
      setActive(nextActive);
    }
  }

  function handleCancel() {
    setName(item.name);
    setProductTypeId(item.product_type_id);
    setServings(item.servings ?? "");
    setPrice(String(item.price));
    setActive(item.active);
    setIsEditing(false);
  }

  const productTypeName =
    productTypes.find((productType) => productType.id === productTypeId)?.name ?? "Sem tipo";

  return (
    <ItemCard>
      <ItemHead>
        <div>
          <ItemTitle>{name}</ItemTitle>
          <ItemMeta>
            <span>{productTypeName}</span>
            <span>{servings || "Sem faixa de fatias informada"}</span>
            <span>{formatCurrencyBRL(Number(price || 0))}</span>
          </ItemMeta>
        </div>
        <StatusPill $active={active}>{active ? "Ativo" : "Inativo"}</StatusPill>
      </ItemHead>

      {isEditing ? (
        <ItemForm onSubmit={handleSubmit}>
          <FieldShell>
            <Label htmlFor={`size-${item.id}-type`}>Tipo de produto</Label>
            <Select
              id={`size-${item.id}-type`}
              value={productTypeId}
              onChange={(event) => setProductTypeId(event.target.value)}
            >
              {productTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Select>
          </FieldShell>

          <FieldShell>
            <Label htmlFor={`size-${item.id}-name`}>Descricao</Label>
            <Input
              id={`size-${item.id}-name`}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </FieldShell>

          <FieldShell>
            <Label htmlFor={`size-${item.id}-servings`}>Faixa de fatias</Label>
            <Input
              id={`size-${item.id}-servings`}
              value={servings}
              onChange={(event) => setServings(event.target.value)}
            />
          </FieldShell>

          <FieldShell>
            <Label htmlFor={`size-${item.id}-price`}>Preco</Label>
            <Input
              id={`size-${item.id}-price`}
              type="number"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />
          </FieldShell>

          <CheckboxRow>
            <input
              type="checkbox"
              checked={active}
              onChange={(event) => setActive(event.target.checked)}
            />
            Manter ativo
          </CheckboxRow>

          <ItemActions>
            <PrimaryButton type="submit">Salvar alteracoes</PrimaryButton>
            <GhostButton type="button" onClick={handleCancel}>
              Cancelar
            </GhostButton>
          </ItemActions>
        </ItemForm>
      ) : (
        <ItemActions>
          <SecondaryButton type="button" onClick={() => setIsEditing(true)}>
            Editar
          </SecondaryButton>
          <ToggleButton type="button" $active={active} onClick={handleToggle}>
            {active ? "Desativar" : "Ativar"}
          </ToggleButton>
        </ItemActions>
      )}
    </ItemCard>
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
      setError(result.message || "Nao foi possivel salvar.");
      return false;
    }

    setFeedback("Alteracao salva com sucesso.");
    router.refresh();
    return true;
  }

  return (
    <Shell>
      {(feedback || error) ? (
        <FeedbackRow>
          {feedback ? <FeedbackCard $tone="success">{feedback}</FeedbackCard> : null}
          {error ? <FeedbackCard $tone="error">{error}</FeedbackCard> : null}
        </FeedbackRow>
      ) : null}

      {sectionConfig.map((section) => (
        <SimpleSection
          key={section.entity}
          entity={section.entity}
          eyebrow={section.eyebrow}
          label={section.label}
          description={section.description}
          items={snapshot[section.sourceKey]}
          onSave={save}
        />
      ))}

      <Section>
        <SectionHeader>
          <SectionHeading>
            <SectionEyebrow>Tamanhos</SectionEyebrow>
            <SectionTitle>Tamanhos e precos</SectionTitle>
            <SectionText>
              Vincule cada tamanho ao tipo correto e atualize preco, rendimento e disponibilidade sem perder historico.
            </SectionText>
          </SectionHeading>
          <SectionCount>{snapshot.productSizes.length} cadastrados</SectionCount>
        </SectionHeader>

        <SectionBody>
          <ComposerCard
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const saved = await save({
                entity: "product_sizes",
                name: String(formData.get("name") || ""),
                productTypeId: String(formData.get("productTypeId") || ""),
                servings: String(formData.get("servings") || ""),
                price: Number(formData.get("price") || 0),
                active: formData.get("active") === "on",
              });

              if (saved) {
                event.currentTarget.reset();
              }
            }}
          >
            <ComposerTitle>Novo tamanho</ComposerTitle>
            <FormGrid>
              <FieldShell>
                <Label htmlFor="product-size-create-type">Tipo de produto</Label>
                <Select id="product-size-create-type" name="productTypeId" defaultValue="">
                  <option value="" disabled>
                    Selecione o tipo
                  </option>
                  {snapshot.productTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Select>
              </FieldShell>

              <FieldShell>
                <Label htmlFor="product-size-create-name">Descricao</Label>
                <Input
                  id="product-size-create-name"
                  name="name"
                  placeholder="Ex.: Bolo 16cm (1 recheio + cobertura)"
                />
              </FieldShell>

              <FieldShell>
                <Label htmlFor="product-size-create-servings">Faixa de fatias</Label>
                <Input id="product-size-create-servings" name="servings" placeholder="Ex.: 10 fatias" />
              </FieldShell>

              <FieldShell>
                <Label htmlFor="product-size-create-price">Preco</Label>
                <Input
                  id="product-size-create-price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="70.00"
                />
              </FieldShell>

              <CheckboxRow>
                <input type="checkbox" name="active" defaultChecked />
                Criar como ativo
              </CheckboxRow>

              <PrimaryButton type="submit">Cadastrar tamanho</PrimaryButton>
            </FormGrid>
          </ComposerCard>

          {snapshot.productSizes.length ? (
            <CardList>
              {snapshot.productSizes.map((item) => (
                <ProductSizeEditor
                  key={item.id}
                  item={item}
                  productTypes={snapshot.productTypes}
                  onSave={save}
                />
              ))}
            </CardList>
          ) : (
            <EmptyState>Nenhum tamanho cadastrado ainda.</EmptyState>
          )}
        </SectionBody>
      </Section>
    </Shell>
  );
}
