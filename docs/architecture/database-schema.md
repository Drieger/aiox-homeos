# HomeOS — Database Schema

## Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-03-25 | 1.0 | Criação inicial | Aria (@architect) |

---

## Visão Geral

HomeOS usa SQLite como banco de dados local com Drizzle ORM. O schema é a **única fonte de verdade** para tipos TypeScript — todos os tipos `Book` e `NewBook` são inferidos do schema, nunca definidos manualmente.

**Modo WAL** habilitado para durabilidade (NFR4): `PRAGMA journal_mode = WAL`.
**Colunas em inglês** obrigatório (NFR5).

---

## Schema Drizzle

```typescript
// src/lib/db/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/**
 * Tabela principal de livros.
 *
 * @design Todos os nomes de coluna em inglês (NFR5).
 * IDs como ULID (TEXT) — sortable por tempo, sem colisão,
 * URL-safe. Alternativa (INTEGER autoincrement) descartada
 * por não ser portável e por revelar volume de registros.
 *
 * cover_path armazena apenas o caminho relativo à raiz do projeto
 * (ex: "data/covers/01ABCDEF.jpg") — não a URL completa, para
 * evitar acoplamento com o hostname.
 *
 * notes persistidas como Markdown puro — não HTML. O TipTap
 * serializa/desserializa via @tiptap/extension-markdown.
 */
export const books = sqliteTable("books", {
  /** ULID gerado pelo application layer via ulidx */
  id: text("id").primaryKey(),

  /** Título do livro — obrigatório */
  title: text("title").notNull(),

  /** Autor do livro — obrigatório */
  author: text("author").notNull(),

  /** Ano de publicação original — opcional */
  release_year: integer("release_year"),

  /** Ano em que o usuário leu — opcional */
  reading_year: integer("reading_year"),

  /**
   * Status de leitura.
   * Valores: "unread" | "reading" | "read"
   * Default: "unread"
   */
  status: text("status", { enum: ["unread", "reading", "read"] })
    .notNull()
    .default("unread"),

  /**
   * Caminho relativo da imagem de capa.
   * Ex: "data/covers/01ABCDEF.jpg"
   * Null quando o livro não tem capa.
   */
  cover_path: text("cover_path"),

  /** Sinopse do livro em texto livre — editável inline na página de detalhe */
  synopsis: text("synopsis"),

  /** Notas do usuário em formato Markdown — editadas via TipTap */
  notes: text("notes"),

  /** ISO 8601 timestamp — gerado no application layer */
  created_at: text("created_at").notNull(),

  /** ISO 8601 timestamp — atualizado em cada write via command */
  updated_at: text("updated_at").notNull(),
});
```

---

## Tipos Inferidos

```typescript
// src/types/index.ts
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { books } from "@/lib/db/schema";

/**
 * Tipo completo de um livro retornado do banco.
 * Inferido do schema Drizzle — não definir manualmente.
 */
export type Book = InferSelectModel<typeof books>;

/**
 * Tipo para inserção de um novo livro.
 * `id`, `created_at` e `updated_at` são opcionais (gerados no command).
 * Inferido do schema Drizzle.
 */
export type NewBook = InferInsertModel<typeof books>;
```

### Campos por tipo

| Campo | `Book` | `NewBook` |
|-------|--------|-----------|
| `id` | `string` | `string?` |
| `title` | `string` | `string` |
| `author` | `string` | `string` |
| `release_year` | `number \| null` | `number \| null \| undefined` |
| `reading_year` | `number \| null` | `number \| null \| undefined` |
| `status` | `"unread" \| "reading" \| "read"` | `"unread" \| "reading" \| "read" \| undefined` |
| `cover_path` | `string \| null` | `string \| null \| undefined` |
| `synopsis` | `string \| null` | `string \| null \| undefined` |
| `notes` | `string \| null` | `string \| null \| undefined` |
| `created_at` | `string` | `string?` |
| `updated_at` | `string` | `string?` |

---

## Índices

```typescript
// Adicionados no schema via index() do Drizzle
import { index } from "drizzle-orm/sqlite-core";

export const books = sqliteTable(
  "books",
  {
    // ... campos acima ...
  },
  (table) => ({
    /**
     * Índice em status para filtros na listagem (FR5: filtrar por status).
     *
     * @design Cardinalidade baixa (3 valores) mas volume de linhas
     * pessoal justifica o índice para consistência com a estratégia
     * de query (WHERE status = ?).
     */
    statusIdx: index("books_status_idx").on(table.status),

    /**
     * Índice em author para busca textual (FR5: buscar por autor).
     *
     * @design LIKE '%query%' não usa índice B-tree padrão, mas
     * LIKE 'query%' (prefixo) usa. Para busca de prefixo parcial
     * o índice ajuda; para busca de substring no meio não ajuda.
     * Volume pessoal torna isso aceitável sem FTS5.
     */
    authorIdx: index("books_author_idx").on(table.author),
  })
);
```

---

## Configuração do drizzle-kit

```typescript
// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./data/homeos.db",
  },
} satisfies Config;
```

---

## Política de Migrations

### Fluxo obrigatório

```bash
# 1. Modificar schema.ts
# 2. Gerar migration SQL
npm run db:generate    # → drizzle-kit generate

# 3. Aplicar migration
npm run db:migrate     # → drizzle-kit migrate

# 4. Commitar o arquivo gerado (obrigatório)
git add src/lib/db/migrations/
git commit -m "chore(db): add migration XXXX_description"
```

### Regras

| Regra | Detalhe |
|-------|---------|
| **Migrations versionadas no git** | `src/lib/db/migrations/` nunca no `.gitignore` (NFR6) |
| **`data/homeos.db` no gitignore** | Banco de dados é runtime, não fonte de código |
| **`drizzle-kit generate` antes de `migrate`** | Nunca escrever SQL manualmente |
| **Um commit por migration** | Facilita rastreabilidade e rollback manual |
| **Nunca modificar migration existente** | Criar nova migration para alterações |
| **Nomear migrações descritivamente** | `0001_initial_books.sql`, `0002_add_notes_index.sql` |

### Scripts no package.json

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
}
```

---

## .gitignore — Entradas de Banco

```gitignore
# Banco de dados SQLite (runtime — não versionado)
data/homeos.db
data/homeos.db-wal
data/homeos.db-shm

# Covers de livros (runtime — não versionados)
data/covers/*
!data/covers/.gitkeep

# migrations NÃO estão no gitignore — são versionadas
# src/lib/db/migrations/ → commitado
```

---

## Estrutura de Arquivos de Cover

```
data/
└── covers/
    ├── .gitkeep              # Mantém o diretório no git
    ├── 01ABCDEFGH.jpg        # {bookId}.{ext}
    ├── 01IJKLMNOP.png
    └── 01QRSTUVWX.webp
```

**Convenção de nome:** `{bookId}.{extensão original}`
**Formatos aceitos:** `.jpg`, `.jpeg`, `.png`, `.webp`
**Tamanho máximo:** 2MB (validado antes do upload — NFR/FR9)
**Remoção:** Ao deletar o livro, o command remove o arquivo via `fs.unlink`

---

## Consultas de Referência

### Listar livros com filtros

```typescript
// src/lib/queries/books.ts
export async function getBooks(filters?: { status?: BookStatus; q?: string }) {
  let query = db.select().from(books);

  if (filters?.status) {
    query = query.where(eq(books.status, filters.status));
  }

  if (filters?.q) {
    query = query.where(
      or(
        like(books.title, `%${filters.q}%`),
        like(books.author, `%${filters.q}%`)
      )
    );
  }

  return query.orderBy(desc(books.created_at));
}
```

### Atualizar apenas notas

```typescript
// src/lib/commands/books.ts
export async function updateBookNotes(id: string, notes: string) {
  await db
    .update(books)
    .set({ notes, updated_at: new Date().toISOString() })
    .where(eq(books.id, id));
}
```

---

*Documento gerado por Aria (@architect) — 2026-03-25*
