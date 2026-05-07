"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled, { keyframes, css } from "styled-components";
import { media } from "@/utils/media";
import { FLAVOR_TYPE_LABELS } from "@/constants/business";
import type { Database } from "@/types/database";

type FlavorRow = Database["public"]["Tables"]["flavor_options"]["Row"];

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

// ─── Layout ───────────────────────────────────────────────────
const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: ${fadeUp} 0.3s ease;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
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

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(222, 127, 155, 0.5);
  }

  &:active {
    transform: translateY(0);
  }
`;

// ─── Grid ─────────────────────────────────────────────────────
const Grid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;

  ${media.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.lg} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FlavorCard = styled.div<{ $inactive?: boolean }>`
  background: ${({ theme, $inactive }) =>
    $inactive ? theme.colors.bgSecondary : theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all ${({ theme }) => theme.transitions.base};
  opacity: ${({ $inactive }) => ($inactive ? 0.6 : 1)};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-1px);
  }
`;

const FlavorHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

const FlavorName = styled.span`
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
    $type === "recheio"  ? theme.colors.infoSoft :
    $type === "cobertura"? theme.colors.warningSoft :
    theme.colors.primarySoft};
  color: ${({ $type, theme }) =>
    $type === "recheio"  ? theme.colors.info :
    $type === "cobertura"? theme.colors.warning :
    theme.colors.primary};
`;

const FlavorDesc = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.4;
`;

const FlavorActions = styled.div`
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

const StatusDot = styled.span<{ $active: boolean }>`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $active, theme }) => ($active ? theme.colors.success : theme.colors.textMuted)};
  margin-right: 4px;
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
  transition: border-color ${({ theme }) => theme.transitions.fast}, box-shadow ${({ theme }) => theme.transitions.fast};
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

const DrawerFooter = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px 24px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(222, 127, 155, 0.4);
  }
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

  &:hover {
    background: ${({ theme }) => theme.colors.bgSecondary};
  }
`;

const ErrorMsg = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.danger};
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.dangerSoft};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 24px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

type FormState = {
  id?: string;
  name: string;
  type: "recheio" | "cobertura" | "ambos";
  description: string;
  is_active: boolean;
  sort_order: number;
};

const emptyForm: FormState = {
  name:        "",
  type:        "ambos",
  description: "",
  is_active:   true,
  sort_order:  0,
};

export function FlavorsView({ flavors: initialFlavors }: { flavors: FlavorRow[] }) {
  const router = useRouter();
  const [flavors, setFlavors] = useState(initialFlavors);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function openCreate() {
    setForm(emptyForm);
    setError("");
    setDrawerOpen(true);
  }

  function openEdit(f: FlavorRow) {
    setForm({
      id:          f.id,
      name:        f.name,
      type:        f.type,
      description: f.description ?? "",
      is_active:   f.is_active,
      sort_order:  f.sort_order,
    });
    setError("");
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setError("");
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setError("Nome é obrigatório.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/flavor-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
    const prev = flavors;
    setFlavors((f) => f.map((item) => item.id === id ? { ...item, is_active } : item));
    try {
      const res = await fetch("/api/admin/flavor-options", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setFlavors(prev);
    }
  }

  return (
    <PageWrap>
      <Toolbar>
        <PageDesc>
          {flavors.length} sabor{flavors.length !== 1 ? "es" : ""} cadastrado{flavors.length !== 1 ? "s" : ""}
        </PageDesc>
        <AddButton type="button" onClick={openCreate}>
          + Novo sabor
        </AddButton>
      </Toolbar>

      {flavors.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🍰</EmptyIcon>
          <p>Nenhum sabor cadastrado ainda.</p>
        </EmptyState>
      ) : (
        <Grid>
          {flavors.map((f) => (
            <FlavorCard key={f.id} $inactive={!f.is_active}>
              <FlavorHeader>
                <FlavorName>{f.name}</FlavorName>
                <TypeBadge $type={f.type}>{FLAVOR_TYPE_LABELS[f.type]}</TypeBadge>
              </FlavorHeader>
              {f.description && <FlavorDesc>{f.description}</FlavorDesc>}
              <span style={{ fontSize: "0.75rem", color: "inherit" }}>
                <StatusDot $active={f.is_active} />
                {f.is_active ? "Ativo" : "Inativo"}
              </span>
              <FlavorActions>
                <ActionBtn $outline type="button" onClick={() => openEdit(f)}>
                  Editar
                </ActionBtn>
                <ActionBtn
                  $danger={f.is_active}
                  type="button"
                  onClick={() => handleToggle(f.id, !f.is_active)}
                >
                  {f.is_active ? "Desativar" : "Ativar"}
                </ActionBtn>
              </FlavorActions>
            </FlavorCard>
          ))}
        </Grid>
      )}

      {drawerOpen && (
        <>
          <Overlay onClick={closeDrawer} />
          <Drawer>
            <DrawerHeader>
              <DrawerTitle>{form.id ? "Editar sabor" : "Novo sabor"}</DrawerTitle>
              <CloseBtn type="button" onClick={closeDrawer}>✕</CloseBtn>
            </DrawerHeader>

            <DrawerBody>
              <FieldGroup>
                <Label htmlFor="fo-name">Nome *</Label>
                <Input
                  id="fo-name"
                  placeholder="Ex.: Chocolate, Ninho, Chantininho..."
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                />
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="fo-type">Tipo *</Label>
                <Select
                  id="fo-type"
                  value={form.type}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, type: e.target.value as FormState["type"] }))
                  }
                >
                  <option value="ambos">Recheio e Cobertura</option>
                  <option value="recheio">Recheio</option>
                  <option value="cobertura">Cobertura</option>
                </Select>
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="fo-desc">Descrição</Label>
                <Textarea
                  id="fo-desc"
                  placeholder="Descrição opcional..."
                  value={form.description}
                  onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                />
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="fo-order">Ordem de exibição</Label>
                <Input
                  id="fo-order"
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
                {saving ? "Salvando..." : "Salvar sabor"}
              </SaveBtn>
            </DrawerFooter>
          </Drawer>
        </>
      )}
    </PageWrap>
  );
}
