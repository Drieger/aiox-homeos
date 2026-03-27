# Technical Assumptions

## Repository Structure

Monorepo single app — sem workspaces. App pessoal local sem múltiplos serviços.

## Service Architecture

**Monolith — Next.js 15 App Router com API Routes internas e CQRS Leve:**

- **Leitura:** Server Components e Client Components via React Query → `src/lib/queries/` → Drizzle → SQLite
- **Escrita:** Route Handlers → `src/lib/commands/` → Drizzle + side effects → SQLite

```
Leitura:  Component → src/lib/queries/{module}.ts → db (Drizzle)
Escrita:  Route Handler → src/lib/commands/{module}.ts → db + side effects
```

Decisão: CQRS Leve escolhido sobre Service Layer simples e Repository Pattern por separar claramente reads (sem side effects, diretos e testáveis) de writes (com side effects explícitos), sem overhead de classes ou injeção de dependência. Funções puras facilitam TDD.

## Testing Requirements

**Full Testing Pyramid — TDD obrigatório:**

| Camada | Tool | Escopo |
|--------|------|--------|
| Unit | Vitest | Utilitários, validações Zod, commands, queries |
| Integration | Vitest + SQLite `:memory:` | API Route Handlers |
| Component | Testing Library + Vitest | AppSidebar, ThemeToggle, componentes do Design System |
| E2E | Playwright | Navegação entre rotas, tema claro/escuro, Design System interativo |

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
| Estado UI | Zustand | 5+ |
| Dados server | React Query (@tanstack/react-query) | 5+ |
| Validação | Zod | 3+ |
| Tema | next-themes | latest |
| Testes unit/int/component | Vitest + Testing Library | latest |
| Testes E2E | Playwright | latest |

## Additional Technical Assumptions

- Colunas do banco de dados em inglês (obrigatório)
- Todas as funções não-triviais com JSDoc incluindo decisão de design
- `drizzle-kit generate` sempre seguido de commit dos arquivos gerados

---
