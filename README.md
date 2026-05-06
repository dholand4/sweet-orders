# Dany Ruivo - Bolos e Tortas

Sistema de pedidos online feito com Next.js App Router, React, TypeScript, `styled-components`, Supabase, Zod e React Hook Form.

## Visão geral

- Página pública em `/` para envio de pedidos
- Painel admin com senha simples em `/admin`
- Listagem de pedidos em `/admin/pedidos`
- CRUD simples de opções em `/admin/opcoes`
- Integração com WhatsApp via `wa.me` para confirmação manual

## 1. Como instalar

```bash
npm install
```

## 2. Como configurar o `.env.local`

Crie um arquivo `.env.local` na raiz com:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON
ADMIN_PASSWORD=sua-senha-do-admin
NEXT_PUBLIC_STORE_WHATSAPP=5588999792427
```

## 3. Como rodar o SQL no Supabase

1. Acesse o painel do Supabase.
2. Abra o SQL Editor.
3. Copie o conteúdo de `supabase/schema.sql`.
4. Execute o script para criar tabelas e dados iniciais.

Observação:

- O projeto não usa autenticação do Supabase.
- O script desabilita RLS nas tabelas para simplificar o uso com a chave anon neste cenário.

## 4. Como rodar localmente

Depois de instalar as dependências e configurar o `.env.local`:

```bash
npm run dev
```

Abra:

- [http://localhost:3000](http://localhost:3000) para o formulário público
- [http://localhost:3000/admin](http://localhost:3000/admin) para o painel

## 5. Como publicar na Vercel

1. Suba o projeto para um repositório Git.
2. Importe o repositório na Vercel.
3. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_STORE_WHATSAPP`
4. Faça o deploy.

## Estrutura principal

```text
src/
  @types/
  assets/
  components/
  constants/
  providers/
  services/
  utils/
  view/
  app/
  lib/
  types/
supabase/
  schema.sql
public/
  logo.png
```

## Fluxo do pedido

1. Cliente preenche o formulário em `/`.
2. O app salva o pedido no Supabase com status `novo`.
3. O admin visualiza o pedido em `/admin/pedidos`.
4. A recepcionista confirma manualmente pelo botão do WhatsApp.

## Observações

- O valor total é definido pelo tamanho escolhido.
- Não existe pagamento no app.
- Itens do catálogo podem ser desativados sem exclusão definitiva.
