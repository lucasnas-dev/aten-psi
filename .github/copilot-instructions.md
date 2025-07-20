## Visão Geral da Arquitetura

Este é um aplicativo web multilocatário (multi-tenant) construído com Next.js (App Router), TypeScript, Drizzle ORM e PostgreSQL. A autenticação é gerenciada por `better-auth` e as interações com o backend são feitas principalmente através de Server Actions seguras.

A UI é construída com **shadcn/ui**, que utiliza Tailwind CSS e Radix UI.

### Principais Diretórios

- `src/app`: Contém as rotas da aplicação. Note o diretório `(protected)`, que agrupa rotas que exigem autenticação.
- `src/actions`: Onde residem as Server Actions. Este é o principal meio de comunicação com o servidor para mutações e buscas de dados.
- `src/db`: Contém o esquema do banco de dados (`schema.ts`) definido com Drizzle ORM e a configuração da conexão.
- `src/lib`: Código de suporte, incluindo a configuração de autenticação (`auth.ts`) e, mais importante, o cliente de Server Actions seguras (`auth-safe-action.ts`).
- `src/components/ui`: Componentes da UI gerados pelo `shadcn/ui`.

## Padrão Central: Ações Seguras por Tenant

A pedra angular da nossa arquitetura de backend é o isolamento de dados por _tenant_. Quase toda operação de banco de dados deve ser escopada para o tenant do usuário autenticado.

Para garantir isso, usamos um cliente de Server Action personalizado definido em `src/lib/auth-safe-action.ts`.

**Sempre use `tenantActionClient` para criar Server Actions que manipulam dados de um tenant.**

Este cliente é um middleware que:

1.  Verifica se o usuário está autenticado.
2.  Recupera o `tenantId` associado ao usuário.
3.  Injeta o `tenantId` no contexto (`ctx`) da action.

### Exemplo de Server Action

Veja `src/actions/upsert-patient/index.ts` como referência.

```typescript
// src/actions/upsert-patient/index.ts

import { tenantActionClient } from "@/lib/auth-safe-action";
import { upsertPatientSchema } from "./schema";
// ...

export const upsertPatient = tenantActionClient
  .inputSchema(upsertPatientSchema) // 1. Valida a entrada com Zod
  .action(async ({ parsedInput, ctx }) => {
    // 2. Recebe a entrada validada e o contexto
    // ...
    // 3. Usa ctx.user.tenantId para escopar a operação de DB
    await db.insert(patients).values({
      // ... outros campos
      tenant_id: ctx.user.tenantId,
    });
    // ...
  });
```

## Fluxo de Trabalho de Desenvolvimento

### Comandos Essenciais

- `npm run dev`: Inicia o servidor de desenvolvimento do Next.js.
- `npm run lint`: Executa o linter para verificar a qualidade do código.
- `npm run db:generate`: Gera os arquivos de migração do Drizzle com base nas alterações em `src/db/schema.ts`.
- `npm run db:push`: Aplica as alterações do esquema diretamente no banco de dados (ótimo para desenvolvimento, mas use migrações em produção).
- `npm run db:studio`: Abre o Drizzle Studio, uma GUI para visualizar e editar os dados do seu banco de dados.

### Frontend: Client Components e Server Actions

- **Para buscar dados**: Use a Server Action apropriada (ex: `getPatients`) com o hook `useAction` de `next-safe-action/hooks` em um Client Component (`"use client"`). Isso facilita o manuseio de estados de carregamento e erro. Veja `src/app/(protected)/patients/page.tsx` como exemplo.
- **Para enviar dados (formulários)**: Use Server Actions com `useAction` para uma experiência de usuário aprimorada, ou como a prop `action` de um `<form>`. Sempre valide os dados de entrada com um esquema Zod.

## Modelo de Dados e ORM

- O esquema do banco de dados está em `src/db/schema.ts`. Ao fazer alterações neste arquivo, lembre-se de gerar uma nova migração (`npm run db:generate`).
- As consultas ao banco de dados são feitas usando o cliente Drizzle (`db`) importado de `src/db/index.ts`.
- Preste atenção às relações definidas no final de `schema.ts` para entender como as tabelas se conectam.
