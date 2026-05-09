"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled, { keyframes } from "styled-components";
import type { StoreSettings } from "@/services/settings";

const fadeUp = keyframes`from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`
  max-width: 520px;
  animation: ${fadeUp} 0.3s ease;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
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

const Hint = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
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
  box-sizing: border-box;
  transition: border-color 0.15s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }
`;

const SaveBtn = styled.button`
  align-self: flex-start;
  padding: 11px 28px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryHover});
  color: #fff;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border: 0;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(222,127,155,0.4);
  transition: all 0.2s;

  &:disabled { opacity: 0.6; cursor: not-allowed; }
  &:not(:disabled):hover { transform: translateY(-1px); }
`;

const Feedback = styled.p<{ $error?: boolean }>`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ $error, theme }) => ($error ? theme.colors.danger : theme.colors.success)};
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $error, theme }) => ($error ? theme.colors.dangerSoft : theme.colors.successSoft)};
`;

type Props = { settings: StoreSettings };

export function SettingsView({ settings }: Props) {
  const router = useRouter();
  const [whatsapp,   setWhatsapp]   = useState(settings.whatsapp);
  const [storeName,  setStoreName]  = useState(settings.store_name);
  const [saving,     setSaving]     = useState(false);
  const [message,    setMessage]    = useState("");
  const [isError,    setIsError]    = useState(false);

  async function handleSave() {
    if (!whatsapp.trim()) { setIsError(true); setMessage("Informe o WhatsApp da loja."); return; }
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp, store_name: storeName }),
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) throw new Error(data.message ?? "Erro ao salvar.");
      setIsError(false);
      setMessage(data.message ?? "Salvo com sucesso.");
      router.refresh();
    } catch (e) {
      setIsError(true);
      setMessage(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Wrap>
      <Card>
        <FieldGroup>
          <Label htmlFor="s-wpp">WhatsApp da loja</Label>
          <Hint>Número que recebe as confirmações dos pedidos. Digite com DDD, sem formatação.</Hint>
          <Input
            id="s-wpp"
            placeholder="88999792427"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            maxLength={13}
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="s-name">Nome da loja</Label>
          <Input
            id="s-name"
            placeholder="Dany Ruivo - Bolos e Tortas"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
        </FieldGroup>

        {message && <Feedback $error={isError}>{message}</Feedback>}

        <SaveBtn type="button" disabled={saving} onClick={handleSave}>
          {saving ? "Salvando..." : "Salvar configurações"}
        </SaveBtn>
      </Card>
    </Wrap>
  );
}
