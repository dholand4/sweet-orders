"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import {
  LoginButton,
  LoginCard,
  LoginError,
  LoginField,
  LoginForm,
  LoginHeader,
  LoginHelper,
  LoginInput,
  LoginLabel,
  LoginText,
  LoginTitle,
} from "./style";
import type { AdminLoginProps } from "./types";

export function AdminLogin({ title = "Entrar no painel" }: AdminLoginProps) {
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
        throw new Error(payload.message || "Senha invalida.");
      }

      router.push("/admin/pedidos");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Nao foi possivel acessar o painel.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <LoginCard>
      <LoginHeader>
        <Logo size={108} priority />
        <LoginTitle>{title === "Entrar no painel" ? "Painel administrativo" : title}</LoginTitle>
        <LoginText>
          Use a senha da recepcao para abrir o painel, revisar pedidos e manter o
          catalogo atualizado com seguranca.
        </LoginText>
      </LoginHeader>

      <LoginForm onSubmit={handleSubmit}>
        <LoginField>
          <LoginLabel htmlFor="adminPassword">Senha</LoginLabel>
          <LoginInput
            id="adminPassword"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <LoginHelper>Somente pessoas autorizadas devem acessar esta area.</LoginHelper>
        </LoginField>

        {error ? <LoginError>{error}</LoginError> : null}

        <LoginButton type="submit" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar no admin"}
        </LoginButton>
      </LoginForm>
    </LoginCard>
  );
}
