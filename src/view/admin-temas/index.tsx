"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styled, { keyframes, css } from "styled-components";
import { media } from "@/utils/media";
import { formatCurrencyBRL } from "@/utils/format";
import type { Database } from "@/types/database";

type DecoStyleRow = Database["public"]["Tables"]["decoration_styles"]["Row"];

// ─── Animations ──────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideRight = keyframes`
  from { opacity: 0; transform: translateX(48px); }
  to   { opacity: 1; transform: translateX(0); }
`;

// ─── Layout ──────────────────────────────────────────────────
const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${fadeUp} 0.3s ease;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const SectionDesc = styled.p`
  margin: 4px 0 0;
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

// ─── Grid / Cards ─────────────────────────────────────────────
const Grid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
  ${media.md} { grid-template-columns: repeat(2, 1fr); }
  ${media.lg} { grid-template-columns: repeat(3, 1fr); }
`;

const Card = styled.div<{ $inactive?: boolean }>`
  background: ${({ theme, $inactive }) => $inactive ? theme.colors.bgSecondary : theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all ${({ theme }) => theme.transitions.base};
  opacity: ${({ $inactive }) => ($inactive ? 0.6 : 1)};

  &:hover { box-shadow: ${({ theme }) => theme.shadows.md}; transform: translateY(-1px); }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

const CardName = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.base};
`;

const TypeBadge = styled.span<{ $type: string }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radii.full};
  white-space: nowrap;
  background: ${({ $type, theme }) =>
    $type === "included"    ? theme.colors.successSoft :
    $type === "fixed_extra" ? theme.colors.primarySoft :
    theme.colors.warningSoft};
  color: ${({ $type, theme }) =>
    $type === "included"    ? theme.colors.success :
    $type === "fixed_extra" ? theme.colors.primary :
    theme.colors.warning};
`;

const PriceBadge = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.success};
`;

const CardDesc = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.4;
`;

const StatusDot = styled.span<{ $active: boolean }>`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $active, theme }) => ($active ? theme.colors.success : theme.colors.textMuted)};
  margin-right: 4px;
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
`;

const ActionBtn = styled.button<{ $danger?: boolean; $outline?: boolean }>`
  flex: 1;
  padding: 7px 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: 1px solid;
  ${({ $danger, $outline, theme }) =>
    $danger
      ? css`
          background: transparent;
          border-color: ${theme.colors.danger};
          color: ${theme.colors.danger};
          &:hover { background: ${theme.colors.dangerSoft}; }
        `
      : $outline
      ? css`
          background: transparent;
          border-color: ${theme.colors.border};
          color: ${theme.colors.text};
          &:hover { background: ${theme.colors.primarySoft}; border-color: ${theme.colors.primary}; }
        `
      : css`
          background: ${theme.colors.primarySoft};
          border-color: ${theme.colors.primary};
          color: ${theme.colors.primary};
          &:hover { background: ${theme.colors.primary}; color: #fff; }
        `}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 24px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

// ─── Drawer ───────────────────────────────────────────────────
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(78, 43, 57, 0.5);
  backdrop-filter: blur(3px);
  animation: ${fadeIn} 0.2s ease;
`;

const Drawer = styled.div`
  position: fixed;
  inset: 0 0 0 auto;
  z-index: 60;
  width: min(480px, 100vw);
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: -8px 0 40px rgba(110, 36, 57, 0.2);
  animation: ${slideRight} 0.28s ease;
  overflow-y: auto;
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.colors.surface};
  z-index: 1;
`;

const DrawerTitle = styled.h2`
  margin: 0;
  font-family: var(--font-heading), serif;
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  color: ${({ theme }) => theme.colors.text};
`;

const CloseBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.dangerSoft};
    border-color: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.danger};
  }
`;

const DrawerBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`;

const DrawerFooter = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px 24px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-family: inherit;
  transition: border-color ${({ theme }) => theme.transitions.fast};
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: border-color ${({ theme }) => theme.transitions.fast};
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-family: inherit;
  transition: border-color ${({ theme }) => theme.transitions.fast};
  box-sizing: border-box;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }
`;

const CheckRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`;

const SaveBtn = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryHover});
  color: #fff;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border: 0;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};

  &:disabled { opacity: 0.6; cursor: not-allowed; }
  &:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(222, 127, 155, 0.4); }
`;

const CancelBtn = styled.button`
  padding: 12px 20px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover { background: ${({ theme }) => theme.colors.bgSecondary}; }
`;

const ErrorMsg = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.danger};
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.dangerSoft};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const InfoNote = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: ${({ theme }) => theme.radii.md};
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
`;

// ─── Form type ────────────────────────────────────────────────
type DecoForm = {
  id?: string;
  name: string;
  price_type: "included" | "fixed_extra" | "negotiate";
  price_extra: string;
  description: string;
  is_active: boolean;
  sort_order: number;
};

const emptyForm: DecoForm = {
  name: "", price_type: "included", price_extra: "", description: "", is_active: true, sort_order: 0,
};

const PRICE_LABELS: Record<string, string> = {
  included:    "Incluso",
  fixed_extra: "Valor fixo extra",
  negotiate:   "A combinar",
};

// ─── Component ────────────────────────────────────────────────
type Props = { decoStyles: DecoStyleRow[] };

export function TemasView({ decoStyles: initialDecoStyles }: Props) {
  const router = useRouter();
  const [decoStyles, setDecoStyles] = useState(initialDecoStyles);
  const [open,       setOpen]       = useState(false);
  const [form,       setForm]       = useState<DecoForm>(emptyForm);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState("");

  useEffect(() => { setDecoStyles(initialDecoStyles); }, [initialDecoStyles]);

  function openCreate() { setForm(emptyForm); setError(""); setOpen(true); }

  function openEdit(d: DecoStyleRow) {
    setForm({
      id: d.id, name: d.name, price_type: d.price_type,
      price_extra: d.price_extra != null ? String(d.price_extra) : "",
      description: d.description ?? "", is_active: d.is_active, sort_order: d.sort_order,
    });
    setError("");
    setOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim()) { setError("Nome é obrigatório."); return; }
    setSaving(true);
    setError("");
    try {
      const body = {
        ...form,
        price_extra: form.price_type === "fixed_extra" && form.price_extra
          ? parseFloat(form.price_extra)
          : null,
      };
      const res = await fetch("/api/admin/decoration-styles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = (await res.json()) as { message?: string };
      if (!res.ok) throw new Error(payload.message ?? "Erro ao salvar.");
      setOpen(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id: string, is_active: boolean) {
    const prev = decoStyles;
    setDecoStyles((d) => d.map((item) => item.id === id ? { ...item, is_active } : item));
    try {
      const res = await fetch("/api/admin/decoration-styles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setDecoStyles(prev);
    }
  }

  function closeDrawer() { setOpen(false); setError(""); }

  return (
    <PageWrap>
      <SectionHeader>
        <div>
          <SectionTitle>Estilos de Tema</SectionTitle>
          <SectionDesc>
            {decoStyles.length} estilo{decoStyles.length !== 1 ? "s" : ""} cadastrado{decoStyles.length !== 1 ? "s" : ""}
          </SectionDesc>
        </div>
        <AddButton type="button" onClick={openCreate}>+ Novo estilo</AddButton>
      </SectionHeader>

      {decoStyles.length === 0 ? (
        <EmptyState><p>Nenhum estilo de tema cadastrado ainda.</p></EmptyState>
      ) : (
        <Grid>
          {decoStyles.map((d) => (
            <Card key={d.id} $inactive={!d.is_active}>
              <CardHeader>
                <CardName>{d.name}</CardName>
                <TypeBadge $type={d.price_type}>{PRICE_LABELS[d.price_type]}</TypeBadge>
              </CardHeader>
              {d.price_type === "fixed_extra" && d.price_extra != null && (
                <PriceBadge>+{formatCurrencyBRL(d.price_extra)}</PriceBadge>
              )}
              {d.price_type === "negotiate" && (
                <PriceBadge style={{ color: "inherit", opacity: 0.7 }}>Preço a combinar</PriceBadge>
              )}
              {d.description && <CardDesc>{d.description}</CardDesc>}
              <span style={{ fontSize: "0.75rem" }}>
                <StatusDot $active={d.is_active} />{d.is_active ? "Ativo" : "Inativo"}
              </span>
              <CardActions>
                <ActionBtn $outline type="button" onClick={() => openEdit(d)}>Editar</ActionBtn>
                <ActionBtn $danger={d.is_active} type="button" onClick={() => handleToggle(d.id, !d.is_active)}>
                  {d.is_active ? "Desativar" : "Ativar"}
                </ActionBtn>
              </CardActions>
            </Card>
          ))}
        </Grid>
      )}

      {open && (
        <>
          <Overlay onClick={closeDrawer} />
          <Drawer>
            <DrawerHeader>
              <DrawerTitle>{form.id ? "Editar estilo" : "Novo estilo de tema"}</DrawerTitle>
              <CloseBtn type="button" onClick={closeDrawer}>✕</CloseBtn>
            </DrawerHeader>

            <DrawerBody>
              <FieldGroup>
                <Label htmlFor="ds-name">Nome *</Label>
                <Input
                  id="ds-name"
                  placeholder="Ex.: Tema Padrão, Tema 3D Elaborado..."
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                />
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="ds-price-type">Tipo de preço *</Label>
                <Select
                  id="ds-price-type"
                  value={form.price_type}
                  onChange={(e) => setForm((s) => ({ ...s, price_type: e.target.value as DecoForm["price_type"] }))}
                >
                  <option value="included">Incluso (sem custo extra)</option>
                  <option value="fixed_extra">Valor fixo extra</option>
                  <option value="negotiate">A combinar com a confeiteira</option>
                </Select>
              </FieldGroup>

              {form.price_type === "fixed_extra" && (
                <FieldGroup>
                  <Label htmlFor="ds-price-extra">Valor extra (R$) *</Label>
                  <Input
                    id="ds-price-extra"
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="10.00"
                    value={form.price_extra}
                    onChange={(e) => setForm((s) => ({ ...s, price_extra: e.target.value }))}
                  />
                </FieldGroup>
              )}

              {form.price_type === "negotiate" && (
                <InfoNote>
                  Pedidos com este estilo terão o valor combinado diretamente no WhatsApp.
                </InfoNote>
              )}

              <FieldGroup>
                <Label htmlFor="ds-desc">Descrição</Label>
                <Textarea
                  id="ds-desc"
                  placeholder="Descrição opcional para o cliente..."
                  value={form.description}
                  onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                />
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="ds-order">Ordem de exibição</Label>
                <Input
                  id="ds-order"
                  type="number"
                  min={0}
                  value={form.sort_order}
                  onChange={(e) => setForm((s) => ({ ...s, sort_order: Number(e.target.value) }))}
                />
              </FieldGroup>

              <CheckRow>
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((s) => ({ ...s, is_active: e.target.checked }))}
                />
                Ativo (aparece para os clientes)
              </CheckRow>

              {error && <ErrorMsg>{error}</ErrorMsg>}
            </DrawerBody>

            <DrawerFooter>
              <CancelBtn type="button" onClick={closeDrawer}>Cancelar</CancelBtn>
              <SaveBtn type="button" disabled={saving} onClick={handleSave}>
                {saving ? "Salvando..." : form.id ? "Salvar alterações" : "Criar estilo"}
              </SaveBtn>
            </DrawerFooter>
          </Drawer>
        </>
      )}
    </PageWrap>
  );
}
