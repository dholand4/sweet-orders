"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled, { keyframes, css } from "styled-components";
import { media } from "@/utils/media";
import { formatCurrencyBRL } from "@/utils/format";
import { PRODUCT_TYPE_LABELS } from "@/constants/business";
import type { ProductWithDetails } from "@/services/options";
import type { Database } from "@/types/database";

type FlavorRow = Database["public"]["Tables"]["flavor_options"]["Row"];
type DecoStyleRow = Database["public"]["Tables"]["decoration_styles"]["Row"];

// ─── Animations ──────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
const slideRight = keyframes`
  from { opacity: 0; transform: translateX(48px); }
  to   { opacity: 1; transform: translateX(0); }
`;

// ─── Shared ───────────────────────────────────────────────────
const PageWrap = styled.div`animation: ${fadeUp} 0.3s ease;`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;

const PageDesc = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryHover});
  color: #fff;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border: 0;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(222, 127, 155, 0.4);
  transition: all ${({ theme }) => theme.transitions.base};
  white-space: nowrap;

  &:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(222, 127, 155, 0.5); }
  &:active { transform: translateY(0); }
`;

// ─── Product Grid ─────────────────────────────────────────────
const Grid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;

  ${media.md} { grid-template-columns: repeat(2, 1fr); }
  ${media.xl} { grid-template-columns: repeat(3, 1fr); }
`;

const ProductCard = styled.div<{ $inactive?: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  opacity: ${({ $inactive }) => ($inactive ? 0.65 : 1)};
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const ProductImage = styled.div<{ $url?: string | null }>`
  height: 140px;
  background: ${({ $url, theme }) =>
    $url
      ? `url(${$url}) center/cover no-repeat`
      : `linear-gradient(135deg, ${theme.colors.primarySoft}, ${theme.colors.bgSecondary})`};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: ${({ theme }) => theme.colors.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ProductBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ProductName = styled.h3`
  margin: 0;
  font-family: var(--font-heading), serif;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text};
`;

const ProductMeta = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const Badge = styled.span<{ $color?: string }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background: ${({ $color, theme }) => $color ?? theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primary};
`;

const ProductDesc = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SizesPreview = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

const SizeChip = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  padding: 3px 8px;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ProductActions = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
  background: ${({ theme }) => theme.colors.bgSecondary};
`;

const ActionBtn = styled.button<{ $danger?: boolean; $outline?: boolean }>`
  flex: 1;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: 1px solid;
  ${({ $danger, $outline, theme }) =>
    $danger
      ? css`background: transparent; border-color: ${theme.colors.danger}; color: ${theme.colors.danger};
             &:hover { background: ${theme.colors.dangerSoft}; }`
      : $outline
      ? css`background: transparent; border-color: ${theme.colors.border}; color: ${theme.colors.text};
             &:hover { background: ${theme.colors.primarySoft}; border-color: ${theme.colors.primary}; }`
      : css`background: ${theme.colors.primarySoft}; border-color: ${theme.colors.primary}; color: ${theme.colors.primary};
             &:hover { background: ${theme.colors.primary}; color: #fff; }`}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 24px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

// ─── Drawer ───────────────────────────────────────────────────
const Overlay = styled.div`
  position: fixed; inset: 0; z-index: 50;
  background: rgba(78, 43, 57, 0.5);
  backdrop-filter: blur(3px);
  animation: ${fadeIn} 0.2s ease;
`;

const Drawer = styled.div`
  position: fixed; inset: 0 0 0 auto; z-index: 60;
  width: min(560px, 100vw);
  display: flex; flex-direction: column;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: -8px 0 40px rgba(110,36,57,0.2);
  animation: ${slideRight} 0.28s ease;
  overflow-y: auto;
`;

const DrawerHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 24px 24px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky; top: 0;
  background: ${({ theme }) => theme.colors.surface}; z-index: 1;
`;

const DrawerTitle = styled.h2`
  margin: 0;
  font-family: var(--font-heading), serif;
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  color: ${({ theme }) => theme.colors.text};
`;

const CloseBtn = styled.button`
  width: 32px; height: 32px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent; color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer; font-size: 16px;
  display: flex; align-items: center; justify-content: center;
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover { background: ${({ theme }) => theme.colors.dangerSoft}; border-color: ${({ theme }) => theme.colors.danger}; color: ${({ theme }) => theme.colors.danger}; }
`;

const DrawerBody = styled.div`
  padding: 24px;
  display: flex; flex-direction: column; gap: 20px; flex: 1;
`;

const SectionDivider = styled.div`
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
`;

const SectionLabel = styled.h3`
  margin: 0 0 12px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FieldGroup = styled.div`display: flex; flex-direction: column; gap: 6px;`;

const FieldRow = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  width: 100%; padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm}; font-family: inherit;
  transition: border-color ${({ theme }) => theme.transitions.fast}, box-shadow ${({ theme }) => theme.transitions.fast};
  box-sizing: border-box;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; box-shadow: ${({ theme }) => theme.shadows.glow}; }
`;

const Textarea = styled.textarea`
  width: 100%; padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm}; font-family: inherit;
  resize: vertical; min-height: 80px; box-sizing: border-box;
  transition: border-color ${({ theme }) => theme.transitions.fast};
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; box-shadow: ${({ theme }) => theme.shadows.glow}; }
`;

const Select = styled.select`
  width: 100%; padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm}; font-family: inherit;
  box-sizing: border-box; cursor: pointer;
  transition: border-color ${({ theme }) => theme.transitions.fast};
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; box-shadow: ${({ theme }) => theme.shadows.glow}; }
`;

const CheckRow = styled.label`
  display: flex; align-items: center; gap: 8px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text}; cursor: pointer;
`;

// Size management
const SizeList = styled.div`display: flex; flex-direction: column; gap: 8px;`;

const SizeRow = styled.div`
  display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 8px;
  align-items: center;
`;

const SizeInput = styled(Input)`padding: 8px 10px;`;

const RemoveBtn = styled.button`
  width: 32px; height: 32px; flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent; color: ${({ theme }) => theme.colors.danger};
  cursor: pointer; font-size: 14px;
  display: flex; align-items: center; justify-content: center;
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover { background: ${({ theme }) => theme.colors.dangerSoft}; border-color: ${({ theme }) => theme.colors.danger}; }
`;

const AddSizeBtn = styled.button`
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px dashed ${({ theme }) => theme.colors.primary};
  background: transparent; color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer; align-self: flex-start;
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover { background: ${({ theme }) => theme.colors.primarySoft}; }
`;

// Flavor checkbox grid
const CheckGrid = styled.div`
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;

  ${media.sm} { grid-template-columns: repeat(3, 1fr); }
`;

const CheckItem = styled.label<{ $checked: boolean }>`
  display: flex; align-items: center; gap: 6px;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ $checked, theme }) => ($checked ? theme.colors.primary : theme.colors.border)};
  background: ${({ $checked, theme }) => ($checked ? theme.colors.primarySoft : "transparent")};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
`;

const DrawerFooter = styled.div`
  display: flex; gap: 12px;
  padding: 16px 24px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const SaveBtn = styled.button`
  flex: 1; padding: 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryHover});
  color: #fff; font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border: 0; cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  &:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(222,127,155,0.4); }
`;

const CancelBtn = styled.button`
  padding: 12px 20px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm}; cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover { background: ${({ theme }) => theme.colors.bgSecondary}; }
`;

const ErrorMsg = styled.p`
  margin: 0; font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.danger};
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.dangerSoft};
  border-radius: ${({ theme }) => theme.radii.md};
`;

// ─── Types ────────────────────────────────────────────────────
type SizeForm = {
  id?:        string;
  name:       string;
  servings:   string;
  price:      string;
  is_active:  boolean;
  sort_order: number;
};

type ProductForm = {
  id?:                  string;
  name:                 string;
  type:                 "bolo" | "torta" | "outro";
  description:          string;
  image_url:            string;
  max_flavors:          1 | 2;
  max_toppings:         0 | 1 | 2;
  allow_dough_choice:   boolean;
  is_active:            boolean;
  sort_order:           number;
  sizes:                SizeForm[];
  flavor_ids:           string[];
  topping_ids:          string[];
  decoration_style_ids: string[];
};

function emptyProduct(): ProductForm {
  return {
    name: "", type: "bolo", description: "", image_url: "",
    max_flavors: 1, max_toppings: 1, allow_dough_choice: true,
    is_active: true, sort_order: 0, sizes: [], flavor_ids: [], topping_ids: [],
    decoration_style_ids: [],
  };
}

function productToForm(p: ProductWithDetails): ProductForm {
  return {
    id:                   p.id,
    name:                 p.name,
    type:                 p.type,
    description:          p.description ?? "",
    image_url:            p.image_url ?? "",
    max_flavors:          p.max_flavors,
    max_toppings:         p.max_toppings,
    allow_dough_choice:   p.allow_dough_choice,
    is_active:            p.is_active,
    sort_order:           p.sort_order,
    sizes:                p.sizes.map((s) => ({
      id:         s.id,
      name:       s.name,
      servings:   s.servings ?? "",
      price:      String(s.price),
      is_active:  s.is_active,
      sort_order: s.sort_order,
    })),
    flavor_ids:           p.allowed_flavors.map((f) => f.id),
    topping_ids:          p.allowed_toppings.map((f) => f.id),
    decoration_style_ids: p.allowed_decoration_styles.map((d) => d.id),
  };
}

function newSize(index: number): SizeForm {
  return { name: "", servings: "", price: "", is_active: true, sort_order: index };
}

// ─── Component ────────────────────────────────────────────────
type ProductsViewProps = {
  products:      ProductWithDetails[];
  allFlavors:    FlavorRow[];
  allDecoStyles: DecoStyleRow[];
};

export function ProductsView({ products: initialProducts, allFlavors, allDecoStyles }: ProductsViewProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState<ProductForm>(emptyProduct);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const flavorsForRecheio   = allFlavors.filter((f) => f.type !== "cobertura");
  const flavorsForCobertura = allFlavors.filter((f) => f.type !== "recheio");

  function openCreate() {
    setForm(emptyProduct());
    setError("");
    setDrawerOpen(true);
  }

  function openEdit(p: ProductWithDetails) {
    setForm(productToForm(p));
    setError("");
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setError("");
  }

  function addSize() {
    setForm((f) => ({ ...f, sizes: [...f.sizes, newSize(f.sizes.length)] }));
  }

  function removeSize(index: number) {
    setForm((f) => ({ ...f, sizes: f.sizes.filter((_, i) => i !== index) }));
  }

  function updateSize(index: number, field: keyof SizeForm, value: string | boolean | number) {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));
  }

  function toggleFlavorId(id: string) {
    setForm((f) => ({
      ...f,
      flavor_ids: f.flavor_ids.includes(id)
        ? f.flavor_ids.filter((fid) => fid !== id)
        : [...f.flavor_ids, id],
    }));
  }

  function toggleToppingId(id: string) {
    setForm((f) => ({
      ...f,
      topping_ids: f.topping_ids.includes(id)
        ? f.topping_ids.filter((tid) => tid !== id)
        : [...f.topping_ids, id],
    }));
  }

  function toggleDecoStyleId(id: string) {
    setForm((f) => ({
      ...f,
      decoration_style_ids: f.decoration_style_ids.includes(id)
        ? f.decoration_style_ids.filter((did) => did !== id)
        : [...f.decoration_style_ids, id],
    }));
  }

  async function handleSave() {
    if (!form.name.trim()) { setError("Nome é obrigatório."); return; }
    setSaving(true);
    setError("");
    try {
      const body = {
        ...form,
        sizes: form.sizes.map((s, i) => ({
          ...s,
          price:      parseFloat(s.price) || 0,
          sort_order: i,
        })),
      };
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = (await res.json()) as { message?: string };
      if (!res.ok) throw new Error(payload.message ?? "Erro ao salvar.");
      setDrawerOpen(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id: string, is_active: boolean) {
    const prev = products;
    setProducts((p) => p.map((item) => item.id === id ? { ...item, is_active } : item));
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setProducts(prev);
    }
  }

  return (
    <PageWrap>
      <Toolbar>
        <PageDesc>
          {products.length} produto{products.length !== 1 ? "s" : ""} cadastrado{products.length !== 1 ? "s" : ""}
        </PageDesc>
        <AddButton type="button" onClick={openCreate}>+ Novo produto</AddButton>
      </Toolbar>

      {products.length === 0 ? (
        <EmptyState>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎂</div>
          <p>Nenhum produto cadastrado ainda.</p>
        </EmptyState>
      ) : (
        <Grid>
          {products.map((p) => (
            <ProductCard key={p.id} $inactive={!p.is_active}>
              <ProductImage $url={p.image_url}>
                {!p.image_url && "🎂"}
              </ProductImage>
              <ProductBody>
                <ProductName>{p.name}</ProductName>
                <ProductMeta>
                  <Badge>{PRODUCT_TYPE_LABELS[p.type]}</Badge>
                  {!p.is_active && <Badge $color="rgba(0,0,0,0.06)">Inativo</Badge>}
                  <Badge>{p.max_flavors === 2 ? "2 sabores" : "1 sabor"}</Badge>
                  {p.max_toppings > 0 && (
                    <Badge>{p.max_toppings === 2 ? "2 coberturas" : "1 cobertura"}</Badge>
                  )}
                </ProductMeta>
                {p.description && <ProductDesc>{p.description}</ProductDesc>}
                {p.sizes.length > 0 && (
                  <SizesPreview>
                    {p.sizes.slice(0, 4).map((s) => (
                      <SizeChip key={s.id}>{s.name} · {formatCurrencyBRL(s.price)}</SizeChip>
                    ))}
                    {p.sizes.length > 4 && (
                      <SizeChip>+{p.sizes.length - 4}</SizeChip>
                    )}
                  </SizesPreview>
                )}
              </ProductBody>
              <ProductActions>
                <ActionBtn $outline type="button" onClick={() => openEdit(p)}>Editar</ActionBtn>
                <ActionBtn
                  $danger={p.is_active}
                  type="button"
                  onClick={() => handleToggle(p.id, !p.is_active)}
                >
                  {p.is_active ? "Desativar" : "Ativar"}
                </ActionBtn>
              </ProductActions>
            </ProductCard>
          ))}
        </Grid>
      )}

      {drawerOpen && (
        <>
          <Overlay onClick={closeDrawer} />
          <Drawer>
            <DrawerHeader>
              <DrawerTitle>{form.id ? "Editar produto" : "Novo produto"}</DrawerTitle>
              <CloseBtn type="button" onClick={closeDrawer}>✕</CloseBtn>
            </DrawerHeader>

            <DrawerBody>
              {/* Informações básicas */}
              <FieldGroup>
                <Label htmlFor="p-name">Nome *</Label>
                <Input id="p-name" placeholder="Ex.: Naked Cake" value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
              </FieldGroup>

              <FieldRow>
                <FieldGroup>
                  <Label htmlFor="p-type">Tipo *</Label>
                  <Select id="p-type" value={form.type}
                    onChange={(e) => setForm((s) => ({ ...s, type: e.target.value as ProductForm["type"] }))}>
                    <option value="bolo">Bolo</option>
                    <option value="torta">Torta</option>
                    <option value="outro">Outro</option>
                  </Select>
                </FieldGroup>
                <FieldGroup>
                  <Label htmlFor="p-order">Ordem</Label>
                  <Input id="p-order" type="number" min={0} value={form.sort_order}
                    onChange={(e) => setForm((s) => ({ ...s, sort_order: Number(e.target.value) }))} />
                </FieldGroup>
              </FieldRow>

              <FieldGroup>
                <Label htmlFor="p-desc">Descrição</Label>
                <Textarea id="p-desc" placeholder="Descrição exibida para o cliente..." value={form.description}
                  onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="p-img">URL da imagem</Label>
                <Input id="p-img" type="url" placeholder="https://..." value={form.image_url}
                  onChange={(e) => setForm((s) => ({ ...s, image_url: e.target.value }))} />
              </FieldGroup>

              {/* Configurações */}
              <SectionDivider>
                <SectionLabel>Configurações</SectionLabel>
                <FieldRow>
                  <FieldGroup>
                    <Label htmlFor="p-maxflavors">Máx. sabores</Label>
                    <Select id="p-maxflavors" value={form.max_flavors}
                      onChange={(e) => setForm((s) => ({ ...s, max_flavors: Number(e.target.value) as 1 | 2 }))}>
                      <option value={1}>1 sabor</option>
                      <option value={2}>2 sabores</option>
                    </Select>
                  </FieldGroup>
                  <FieldGroup>
                    <Label htmlFor="p-maxtoppings">Máx. coberturas</Label>
                    <Select id="p-maxtoppings" value={form.max_toppings}
                      onChange={(e) => setForm((s) => ({ ...s, max_toppings: Number(e.target.value) as 0 | 1 | 2 }))}>
                      <option value={0}>Sem cobertura</option>
                      <option value={1}>1 cobertura</option>
                      <option value={2}>2 coberturas</option>
                    </Select>
                  </FieldGroup>
                </FieldRow>
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                  <CheckRow>
                    <input type="checkbox" checked={form.allow_dough_choice}
                      onChange={(e) => setForm((s) => ({ ...s, allow_dough_choice: e.target.checked }))} />
                    Permitir escolha de massa (branca / chocolate)
                  </CheckRow>
                  <CheckRow>
                    <input type="checkbox" checked={form.is_active}
                      onChange={(e) => setForm((s) => ({ ...s, is_active: e.target.checked }))} />
                    Ativo (visível para clientes)
                  </CheckRow>
                </div>
              </SectionDivider>

              {/* Tamanhos */}
              <SectionDivider>
                <SectionLabel>Tamanhos e preços</SectionLabel>
                <SizeList>
                  {form.sizes.map((size, i) => (
                    <SizeRow key={i}>
                      <SizeInput placeholder="Tamanho" value={size.name}
                        onChange={(e) => updateSize(i, "name", e.target.value)} />
                      <SizeInput placeholder="Porções" value={size.servings}
                        onChange={(e) => updateSize(i, "servings", e.target.value)} />
                      <SizeInput placeholder="Preço (R$)" type="number" min={0} step={0.01} value={size.price}
                        onChange={(e) => updateSize(i, "price", e.target.value)} />
                      <RemoveBtn type="button" onClick={() => removeSize(i)}>✕</RemoveBtn>
                    </SizeRow>
                  ))}
                </SizeList>
                <AddSizeBtn type="button" onClick={addSize} style={{ marginTop: 8 }}>
                  + Adicionar tamanho
                </AddSizeBtn>
              </SectionDivider>

              {/* Recheios permitidos */}
              <SectionDivider>
                <SectionLabel>Recheios permitidos ({form.flavor_ids.length} selecionados)</SectionLabel>
                <CheckGrid>
                  {flavorsForRecheio.map((f) => (
                    <CheckItem key={f.id} $checked={form.flavor_ids.includes(f.id)}>
                      <input type="checkbox" checked={form.flavor_ids.includes(f.id)}
                        onChange={() => toggleFlavorId(f.id)} style={{ margin: 0 }} />
                      {f.name}
                    </CheckItem>
                  ))}
                </CheckGrid>
              </SectionDivider>

              {/* Coberturas (creme) permitidas */}
              {form.max_toppings > 0 && (
                <SectionDivider>
                  <SectionLabel>Coberturas / Creme ({form.topping_ids.length} selecionado{form.topping_ids.length !== 1 ? "s" : ""})</SectionLabel>
                  <CheckGrid>
                    {flavorsForCobertura.map((f) => (
                      <CheckItem key={f.id} $checked={form.topping_ids.includes(f.id)}>
                        <input type="checkbox" checked={form.topping_ids.includes(f.id)}
                          onChange={() => toggleToppingId(f.id)} style={{ margin: 0 }} />
                        {f.name}
                      </CheckItem>
                    ))}
                  </CheckGrid>
                </SectionDivider>
              )}

              {/* Estilos decorativos permitidos */}
              <SectionDivider>
                <SectionLabel>Estilos decorativos ({form.decoration_style_ids.length} selecionado{form.decoration_style_ids.length !== 1 ? "s" : ""})</SectionLabel>
                <CheckGrid>
                  {allDecoStyles.map((d) => (
                    <CheckItem key={d.id} $checked={form.decoration_style_ids.includes(d.id)}>
                      <input type="checkbox" checked={form.decoration_style_ids.includes(d.id)}
                        onChange={() => toggleDecoStyleId(d.id)} style={{ margin: 0 }} />
                      {d.name}
                      {d.price_type === "fixed_extra" && d.price_extra != null && ` (+R$${Number(d.price_extra).toFixed(2)})`}
                      {d.price_type === "negotiate" && " (a combinar)"}
                    </CheckItem>
                  ))}
                </CheckGrid>
              </SectionDivider>

              {error && <ErrorMsg>{error}</ErrorMsg>}
            </DrawerBody>

            <DrawerFooter>
              <CancelBtn type="button" onClick={closeDrawer}>Cancelar</CancelBtn>
              <SaveBtn type="button" disabled={saving} onClick={handleSave}>
                {saving ? "Salvando..." : "Salvar produto"}
              </SaveBtn>
            </DrawerFooter>
          </Drawer>
        </>
      )}
    </PageWrap>
  );
}
