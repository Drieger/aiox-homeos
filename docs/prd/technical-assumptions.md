# Technical Assumptions

## Repository Structure

Monorepo single app — sem workspaces. App pessoal local sem múltiplos serviços.

## Service Architecture

**Monolith — Next.js 15 App Router com API Routes internas e CQRS Leve:**

- **Leitura:** Server Components e Client Components via React Query → `src/lib/queries/` → Drizzle → SQLite
- **Escrita:** Route Handlers → `src/lib/commands/` → Drizzle + side effects → SQLite

```
Leitura:  Component → src/lib/queries/books.ts → db (Drizzle)
Escrita:  Route Handler → src/lib/commands/books.ts → db + filesystem
```

Decisão: CQRS Leve escolhido sobre Service Layer simples e Repository Pattern por separar claramente reads (sem side effects, diretos e testáveis) de writes (com side effects explícitos), sem overhead de classes ou injeção de dependência. Funções puras facilitam TDD.

## Testing Requirements

**Full Testing Pyramid — TDD obrigatório:**

| Camada | Tool | Escopo |
|--------|------|--------|
| Unit | Vitest | Utilitários, validações Zod, commands, queries |
| Integration | Vitest + SQLite `:memory:` | API Route Handlers |
| Component | Testing Library + Vitest | BookForm, BookCard, AppSidebar, componentes críticos |
| E2E | Playwright | Fluxo completo: criar livro, editar notas, salvar |

Nota: TipTap (ProseMirror) não é testável via JSDOM — lógica de save é testada unitariamente; comportamento do editor é testado via Playwright E2E.

## Stack Completo

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | Next.js (App Router) | 15+ |
| Linguagem | TypeScript (strict) | 5+ |
| Estilo | Tailwind CSS | 4+ |
| UI Components | shadcn/ui + Radix UI | latest |
| Ícones | Lucide React | latest |
| ORM | Drizzle ORM | latest |
| DB Driver | better-sqlite3 | latest |
| DB | SQLite | 3+ |
| Editor | TipTap (StarterKit + Markdown) | 2+ |
| Estado UI | Zustand | 5+ |
| Dados server | React Query (@tanstack/react-query) | 5+ |
| Validação | Zod | 3+ |
| IDs | ulidx (ULID) | latest |
| Tema | next-themes | latest |
| Testes unit/int/component | Vitest + Testing Library | latest |
| Testes E2E | Playwright | latest |

## Additional Technical Assumptions

- Colunas do banco de dados em inglês (obrigatório)
- Todas as funções não-triviais com JSDoc incluindo decisão de design
- `drizzle-kit generate` sempre seguido de commit dos arquivos gerados
- Cover images: JPEG/PNG/WebP, limite 2MB; armazenadas em `data/covers/{bookId}.{ext}` (fora de `public/` para evitar problemas com Next.js estático em runtime); servidas via `/api/covers/[filename]`
- Notas salvas manualmente via botão explícito com dirty state indicator
- Índices SQLite em `status` e `author` para performance de filtros/busca

---
