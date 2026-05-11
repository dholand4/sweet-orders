# sweet-orders

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.x-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-ready-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Styled--Components-6.x-DB7093?style=for-the-badge&logo=styled-components&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-deploy-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

> Sistema de pedidos online para confeitarias — cliente monta o pedido pelo app, admin acompanha pelo painel e confirma pelo WhatsApp com mensagem pronta.

---

## Índice

- [Sobre](#-sobre)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Como rodar](#-como-rodar)
- [Banco de dados](#-banco-de-dados)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Deploy](#-deploy)

---

## Sobre

O **sweet-orders** é um sistema de pedidos online para confeitarias. O cliente acessa a página pública, monta o pedido escolhendo tipo de produto, tamanho, sabor, recheio e cobertura, informa os dados de entrega e envia. O pedido aparece instantaneamente no painel admin, onde a recepcionista pode acompanhar o status e confirmar pelo WhatsApp com mensagem já formatada — sem precisar digitar nada.

---

## Funcionalidades

**Página pública**
- 🎂 Formulário de pedido com seleção dinâmica por tipo de produto
- 💰 Valor total exibido automaticamente ao selecionar o tamanho
- 📱 Botão para o cliente chamar a loja no WhatsApp após o envio
- 📋 Exibição de observações comerciais (taxa de entrega, extras)

**Painel admin**
- 🔐 Acesso protegido por senha via variável de ambiente
- 📊 Listagem de pedidos com filtro por status
- 🔄 Alteração de status: `novo`, `em_analise`, `confirmado`, `cancelado`, `finalizado`
- 💬 Botão para confirmar pedido pelo WhatsApp com mensagem pronta
- 📋 Botão para copiar resumo do pedido
- ⚙️ CRUD de catálogo: tipos, tamanhos, sabores, recheios e coberturas
- 🔕 Desativar itens do catálogo sem exclusão definitiva

---

## Arquitetura

```
┌─────────────────────────────────────────────┐
│           Cliente (página pública)          │
│  / → formulário de pedido                  │
└─────────────────────┬───────────────────────┘
                      │ Server Actions
┌─────────────────────▼───────────────────────┐
│            Next.js App Router               │
│  /admin         → painel com senha          │
│  /admin/pedidos → listagem e detalhes       │
│  /admin/opcoes  → CRUD do catálogo          │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│                 Supabase                    │
│  PostgreSQL + anon key (sem auth)           │
└─────────────────────────────────────────────┘
```

**Fluxo do pedido:**
1. Cliente preenche o formulário em `/`
2. Pedido salvo no Supabase com status `novo`
3. Admin visualiza em `/admin/pedidos`
4. Recepcionista confirma pelo botão do WhatsApp com mensagem pronta

### Estrutura de pastas

```
src/
├── app/                  # rotas Next.js App Router
├── components/           # componentes reutilizáveis
├── lib/                  # supabase.ts e utilitários
├── types/                # database.ts e tipos globais
├── utils/                # format.ts (BRL, data, WhatsApp)
├── services/             # chamadas ao Supabase
└── constants/
supabase/
└── schema.sql            # tabelas e dados iniciais
public/
└── logo.png
```

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| Next.js 14 App Router | Framework e roteamento |
| TypeScript | Tipagem estática |
| Styled-Components | Estilização |
| Supabase | Banco de dados PostgreSQL |
| Zod | Validação de formulários |
| React Hook Form | Gerenciamento de formulários |

---

## Como rodar

### Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com)

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/dholand4/sweet-orders.git

# Entrar na pasta do projeto
cd sweet-orders

# Instalar as dependências
npm install
```

### Executar

```bash
npm run dev
```

Acesse:
- `http://localhost:3000` — formulário público
- `http://localhost:3000/admin` — painel administrativo

---

## Banco de dados

1. Acesse o painel do [Supabase](https://supabase.com)
2. Abra o **SQL Editor**
3. Copie o conteúdo de `supabase/schema.sql`
4. Execute o script — as tabelas e dados iniciais serão criados automaticamente

> O projeto não usa autenticação do Supabase. O script desabilita RLS para uso com a chave anon.

### Tabelas criadas

| Tabela | Descrição |
|---|---|
| `product_types` | Tipos de produto (Naked Cake, Chantininho...) |
| `product_sizes` | Tamanhos e preços por tipo |
| `flavors` | Sabores disponíveis |
| `fillings` | Recheios disponíveis |
| `toppings` | Coberturas e estilos |
| `orders` | Pedidos realizados pelos clientes |

---

## ⚙️ Variáveis de ambiente

Crie um arquivo `.env.local` na raiz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON
ADMIN_PASSWORD=sua-senha-do-admin
NEXT_PUBLIC_STORE_WHATSAPP=5500999999999
```

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto no Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon do Supabase |
| `ADMIN_PASSWORD` | Senha de acesso ao painel admin |
| `NEXT_PUBLIC_STORE_WHATSAPP` | Número do WhatsApp da loja com DDI |

---

## 🌐 Deploy

### Vercel (recomendado)

1. Suba o repositório para o GitHub
2. Importe o repositório na [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente no painel da Vercel
4. Faça o deploy
