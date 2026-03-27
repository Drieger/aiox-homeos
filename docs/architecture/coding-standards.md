# HomeOS — Coding Standards

## Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-03-25 | 1.0 | Criação inicial | Aria (@architect) |

---

## 1. TypeScript — Configuração Strict

### tsconfig.json obrigatório

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Regras de Tipagem

- **Nunca usar `any`** — use `unknown` com type guard quando necessário
- **Tipos inferidos do Drizzle** — nunca redefinir manualmente o que o ORM já infere
- **Interfaces vs Types** — use `type` para unions/intersections, `interface` para objetos extensíveis
- **Enums** — evitar enums TypeScript; usar `as const` ou Zod enum em vez disso

```typescript
// ✅ Correto — tipo inferido do schema
import type { Book } from "@/types";

// ❌ Errado — redefinir o que Drizzle já inferiu
type Book = {
  id: string;
  title: string;
  // ...
};

// ✅ Correto — const assertion em vez de enum TypeScript
const BOOK_STATUS = ["unread", "reading", "read"] as const;
type BookStatus = typeof BOOK_STATUS[number];
```

---

## 2. Padrões de Componentes React

### Client vs Server Components

```typescript
// Server Component (padrão no App Router — sem "use client")
// Pode acessar banco diretamente via queries
export default async function BooksPage() {
  const books = await getBooks(); // query direta, sem fetch
  return <BookGrid books={books} />;
}

// Client Component — use apenas quando necessário
"use client";
export function BookFilters() {
  const [status, setStatus] = useState<BookStatus | "all">("all");
  // ...
}
```

**Regra:** Comece como Server Component. Adicione `"use client"` apenas quando precisar de: estado local, eventos do browser, hooks como `useEffect`/`useState`, ou acesso a APIs do browser.

### Estrutura de Arquivo de Componente

```typescript
// 1. Imports externos
import { useState } from "react";
import { Button } from "@/components/ui/button";

// 2. Imports internos
import { useBooks } from "@/hooks/use-books";
import type { Book } from "@/types";

// 3. Tipos/interfaces locais
interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
}

// 4. Componente principal com JSDoc
/**
 * Card de livro exibindo capa, título, autor e badge de status.
 *
 * @param book - Dados do livro a exibir
 * @param onEdit - Callback chamado ao clicar no botão de edição
 *
 * @design Usa `next/image` com `unoptimized` para imagens de covers
 * servidas pela API route — o optimizador do Next.js não funciona
 * com assets dinâmicos fora de `public/`.
 */
export function BookCard({ book, onEdit }: BookCardProps) {
  return (/* ... */);
}
```

### Props e Eventos

- Props de evento sempre tipadas como `(arg: Type) => void`
- Nunca passar `event` de DOM diretamente para cima — extraia o valor antes
- Componentes de formulário usam `react-hook-form` + schema Zod via `zodResolver`

---

## 3. Padrão CQRS Leve

### Separação Queries / Commands

```
src/lib/
├── queries/        # Leitura — sem side effects, retornam dados
│   └── books.ts
└── commands/       # Escrita — com side effects (DB + filesystem)
    └── books.ts
```

### Queries (`src/lib/queries/books.ts`)

Funções puras de leitura. Podem ser chamadas de Server Components diretamente ou de Route Handlers de leitura.

```typescript
import { db } from "@/lib/db";
import { books } from "@/lib/db/schema";
import { eq, like, or } from "drizzle-orm";
import type { BookFilters } from "@/types";

/**
 * Retorna lista de livros com filtros opcionais de status e busca textual.
 *
 * @param filters - Filtros de status e query de busca
 * @returns Array de livros ordenados por created_at DESC
 *
 * @design Usa `like` em vez de FTS5 para simplicidade — volume de dados
 * pessoal não justifica Full-Text Search. Índices em status e author
 * garantem performance suficiente (ver database-schema.md).
 */
export async function getBooks(filters?: BookFilters) {
  // implementação
}

/**
 * Retorna um livro pelo ID ou null se não encontrado.
 *
 * @param id - ULID do livro
 * @returns Livro completo ou null
 */
export async function getBookById(id: string) {
  // implementação
}
```

### Commands (`src/lib/commands/books.ts`)

Funções de escrita com side effects explícitos. Chamadas apenas de Route Handlers.

```typescript
import { db } from "@/lib/db";
import { books } from "@/lib/db/schema";
import { unlink } from "node:fs/promises";
import { ulid } from "ulidx";
import type { NewBook } from "@/types";

/**
 * Cria um novo livro no banco de dados.
 *
 * @param data - Dados validados do novo livro (sem id/timestamps)
 * @returns Livro criado com id e timestamps gerados
 *
 * @design ID gerado como ULID (não UUID v4) para ordenação temporal
 * natural nas queries sem ORDER BY explícito.
 */
export async function createBook(data: NewBook) {
  const now = new Date().toISOString();
  const id = ulid();
  // implementação
}

/**
 * Deleta um livro e remove a imagem de capa do filesystem se existir.
 *
 * @param id - ULID do livro a deletar
 *
 * @design Side effect de filesystem (remoção da capa) é responsabilidade
 * do command, não do Route Handler, para garantir atomicidade lógica.
 * Falha silenciosa na remoção do arquivo (arquivo já inexistente é OK).
 */
export async function deleteBook(id: string) {
  // implementação
}

/**
 * Atualiza apenas o campo notes de um livro.
 *
 * @param id - ULID do livro
 * @param notes - Conteúdo Markdown das notas (não HTML)
 *
 * @design Command dedicado para notas evita que o save do editor
 * acidentalmente sobrescreva outros campos do livro enviados
 * parcialmente do cliente.
 */
export async function updateBookNotes(id: string, notes: string) {
  // implementação
}
```

### Route Handlers

Route Handlers são o ponto de entrada de escrita. Fazem: parsing → validação Zod → command → resposta.

```typescript
// src/app/api/books/route.ts
import { createBookSchema } from "@/lib/validations/book";
import { createBook } from "@/lib/commands/books";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createBookSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const book = await createBook(parsed.data);
  return Response.json(book, { status: 201 });
}
```

---

## 4. Padrão de Testes (TDD)

### Princípio Fundamental

**Test-First:** O teste é escrito antes da implementação. O ciclo é: Red → Green → Refactor.

### Pirâmide de Testes

```
         /\
        /E2E\         Playwright — fluxos completos e TipTap
       /──────\
      /Component\     Testing Library — renderização e interação
     /────────────\
    / Integration  \  Vitest + SQLite :memory: — Route Handlers
   /────────────────\
  /      Unit        \ Vitest — validações, commands, queries, store
 /────────────────────\
```

### Testes Unitários (Vitest)

```typescript
// tests/unit/validations/book.test.ts
import { describe, it, expect } from "vitest";
import { createBookSchema } from "@/lib/validations/book";

describe("createBookSchema", () => {
  it("rejeita livro sem título", () => {
    const result = createBookSchema.safeParse({ author: "Autor" });
    expect(result.success).toBe(false);
  });

  it("aceita ano de lançamento entre 1000 e ano atual", () => {
    const result = createBookSchema.safeParse({
      title: "Livro",
      author: "Autor",
      releaseYear: 2023,
    });
    expect(result.success).toBe(true);
  });
});
```

### Testes de Integração (SQLite :memory:)

```typescript
// tests/integration/api/books.test.ts
import { describe, it, expect, beforeEach } from "vitest";

// Substituir o singleton de DB por uma instância :memory: antes dos testes
vi.mock("@/lib/db", () => ({
  db: createInMemoryDb(), // helper que cria e migra SQLite em memória
}));

describe("POST /api/books", () => {
  it("cria livro e retorna 201", async () => {
    const response = await POST(new Request("http://test/api/books", {
      method: "POST",
      body: JSON.stringify({ title: "Duna", author: "Herbert" }),
    }));
    expect(response.status).toBe(201);
    const book = await response.json();
    expect(book.title).toBe("Duna");
  });
});
```

### Testes de Componente (Testing Library)

```typescript
// tests/component/book-card.test.tsx
import { render, screen } from "@testing-library/react";
import { BookCard } from "@/components/books/book-card";

describe("BookCard", () => {
  it("exibe título e autor do livro", () => {
    render(<BookCard book={mockBook} onEdit={vi.fn()} />);
    expect(screen.getByText("Duna")).toBeInTheDocument();
    expect(screen.getByText("Frank Herbert")).toBeInTheDocument();
  });

  it("exibe badge de status correto", () => {
    render(<BookCard book={{ ...mockBook, status: "reading" }} onEdit={vi.fn()} />);
    expect(screen.getByText("Lendo")).toBeInTheDocument();
  });
});
```

### Testes E2E (Playwright) — TipTap

```typescript
// tests/e2e/editor.spec.ts
import { test, expect } from "@playwright/test";

test("salvar notas no editor TipTap", async ({ page }) => {
  await page.goto("/books/01ABCDEF...");
  await page.getByRole("button", { name: "Editar notas" }).click();
  await page.locator(".tiptap").click();
  await page.keyboard.type("Minha nota de teste");
  await page.getByRole("button", { name: /Não salvo/i }).click();
  await expect(page.getByText(/Salvo às/)).toBeVisible();
});
```

> **Regra TipTap:** Nunca testar o comportamento do editor em JSDOM. Use Playwright para qualquer teste que precise interagir com o ProseMirror (`contenteditable`, `Selection`, cursor).

---

## 5. Padrão JSDoc com Decisões de Design

### Quando documentar

Toda função **não-trivial** deve ter JSDoc. "Não-trivial" significa: lógica de negócio, side effects, decisões não óbvias, ou funções de API pública de módulo.

Funções triviais (getters simples, mappers diretos) não precisam de JSDoc.

### Template Obrigatório

```typescript
/**
 * [O que a função faz — uma linha clara]
 *
 * @param paramName - [Descrição do parâmetro]
 * @returns [O que retorna, incluindo casos de null/undefined]
 * @throws [Se lança exceção, quando e qual tipo]
 *
 * @design [Decisão de design: POR QUE foi implementado assim.
 * Mencionar alternativas consideradas e descartadas quando relevante.
 * Esta seção é obrigatória para funções com escolhas não-óbvias.]
 *
 * @example
 * const book = await getBookById("01ABCDEFG...");
 * if (!book) redirect("/books");
 */
```

### Exemplos de Decisões de Design para Documentar

- Por que usar `better-sqlite3` síncrono vs driver async
- Por que serializar notas como Markdown (não HTML)
- Por que o singleton do DB usa `globalThis` (ver seção abaixo)
- Por que covers ficam em `data/` e não em `public/`
- Por que um command dedicado para `updateBookNotes`

---

## 6. Singleton do DB — Padrão Seguro para Hot Reload

O Next.js em desenvolvimento faz hot reload dos módulos Node.js. Se o singleton for criado diretamente no módulo, cada reload cria uma nova conexão SQLite, eventualmente esgotando conexões.

### Implementação Segura

```typescript
// src/lib/db/index.ts
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { join } from "node:path";
import * as schema from "./schema";

/**
 * Singleton do banco de dados SQLite com proteção contra hot reload do Next.js.
 *
 * @returns Instância do Drizzle ORM com a conexão SQLite ativa
 *
 * @design Em desenvolvimento, o Next.js recarrega módulos Node.js a cada
 * alteração de arquivo. Sem este padrão, cada reload criaria uma nova
 * conexão `better-sqlite3`, acumulando conexões abertas indefinidamente.
 *
 * A solução usa `globalThis` como cache: a primeira chamada cria e armazena
 * a instância; chamadas subsequentes (pós-reload) recuperam a instância já
 * existente. Em produção (`next build`), o módulo é carregado uma única vez
 * e o `globalThis` é desnecessário — mas não prejudica.
 *
 * Referência: https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof createDb> | undefined;
};

function createDb() {
  const dbPath = join(process.cwd(), "data", "homeos.db");
  const sqlite = new Database(dbPath);

  // WAL mode para durabilidade e performance (NFR4)
  sqlite.pragma("journal_mode = WAL");

  return drizzle(sqlite, { schema });
}

export const db = globalForDb.db ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}
```

---

## 7. Validações Zod — Schemas Compartilhados

```typescript
// src/lib/validations/book.ts
import { z } from "zod";

const currentYear = new Date().getFullYear();

export const createBookSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  author: z.string().min(1, "Autor é obrigatório"),
  releaseYear: z.number().int().min(1000).max(currentYear).optional(),
  readingYear: z.number().int().min(1000).max(currentYear).optional(),
  status: z.enum(["unread", "reading", "read"]).default("unread"),
});

export const updateBookSchema = createBookSchema.partial();

export const coverUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => f.size <= 2 * 1024 * 1024, "Arquivo deve ter no máximo 2MB")
    .refine(
      (f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type),
      "Formato inválido — use JPEG, PNG ou WebP"
    ),
});

// Tipos inferidos — usar em toda a aplicação
export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
```

---

## 8. Convenções de Resposta HTTP

| Situação | Status | Body |
|----------|--------|------|
| Criação bem-sucedida | 201 | Recurso criado |
| Operação bem-sucedida sem retorno | 204 | — |
| Validação falhou | 422 | `{ error, details: ZodFlattenedErrors }` |
| Recurso não encontrado | 404 | `{ error: "Not found" }` |
| Erro interno | 500 | `{ error: "Internal server error" }` |

---

*Documento gerado por Aria (@architect) — 2026-03-25*
