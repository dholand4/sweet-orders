"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import {
  LoginButton,
  LoginCard,
  LoginError,
  LoginField,
  LoginInput,
  LoginLabel,
  LoginText,
  LoginTitle,
} from "./style";
import type { AdminLoginProps } from "./types";

export function AdminLogin({ title = "Painel administrativo" }: AdminLoginProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message || "Senha inválida.");
      }

      router.push("/admin/pedidos");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível acessar o painel.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <LoginCard>
      <div>
        <LoginTitle>{title}</LoginTitle>
        <LoginText>
          Acesse o painel para acompanhar pedidos, atualizar status e manter as
          opções do catálogo sempre em dia.
        </LoginText>
      </div>
      <form onSubmit={handleSubmit}>
        <LoginField>
          <LoginLabel htmlFor="adminPassword">Senha</LoginLabel>
          <LoginInput
            id="adminPassword"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </LoginField>
        {error ? <LoginError>{error}</LoginError> : null}
        <LoginButton type="submit" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar no admin"}
        </LoginButton>
      </form>
    </LoginCard>
  );
}
