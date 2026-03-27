# HomeOS — Tech Stack

## Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-03-25 | 1.0 | Criação inicial | Aria (@architect) |

---

## Visão Geral

HomeOS é uma aplicação **monolith local** — Next.js 15 com App Router rodando em localhost, sem serviços externos. O stack foi selecionado para maximizar produtividade de desenvolvimento single-dev, tipagem end-to-end e operação 100% offline.

---

## Stack Completo

### Framework & Linguagem

| Tecnologia | Versão | Justificativa |
|-----------|--------|---------------|
| **Next.js** (App Router) | 15+ | Server Components para leitura direta do DB sem API round-trip; Route Handlers para mutações; estrutura de rotas por filesystem. Alternativa considerada: Vite + React — descartada por não ter SSR/RSC, o que eliminaria a vantagem de queries diretas no servidor. |
| **TypeScript** (strict) | 5+ | Strict mode obrigatório (NFR2). Tipos inferidos do Drizzle schema evitam sincronização manual. `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` habilitados. |
| **Node.js** | 18+ | LTS ativo. Requisito mínimo do Next.js 15. |

### Estilo & UI

| Tecnologia | Versão | Justificativa |
|-----------|--------|---------------|
| **Tailwind CSS** | 4+ | v4 usa `@import "tailwindcss"` sem `tailwind.config.js` — configuração zero. CSS variables nativas facilitam integração com shadcn/ui e sistema de temas. |
| **shadcn/ui** | latest | Componentes copiados para `src/components/ui/` — totalmente controláveis, sem versioning externo. Base do Design System (FR3). |
| **Radix UI** | latest | Primitivos de acessibilidade sob o shadcn/ui. WCAG AA out-of-the-box (requisito UI). |
| **Lucide React** | latest | Ícones SVG consistentes, tree-shakeable. Padrão do shadcn/ui. |
| **next-themes** | latest | Theme switching com persistência em localStorage; SSR-safe com `suppressHydrationWarning`. |

### Estado & Dados

| Tecnologia | Versão | Justificativa |
|-----------|--------|---------------|
| **Zustand** | 5+ | Estado UI local (sidebar collapsed, modo do editor). Alternativa considerada: Context API — descartada por re-render em cascata. Redux Toolkit — overhead excessivo para estado simples. |
| **@tanstack/react-query** | 5+ | Cache, loading/error states, invalidação automática após mutações. Usado no Client Components para `/api/books`. Alternativa: SWR — menos ergonômico para mutações com invalidação. |
| **Zod** | 3+ | Validação de schema em API routes (NFR3) e client-side (formulários). Schemas compartilhados entre frontend e backend via `src/lib/validations/`. |

### Banco de Dados

| Tecnologia | Versão | Justificativa |
|-----------|--------|---------------|
| **SQLite** | 3+ | Banco embedded, zero configuração, arquivo único em `data/homeos.db`. Ideal para app local single-user sem necessidade de servidor. WAL mode para durabilidade (NFR4). |
| **better-sqlite3** | latest | Driver síncrono — mais simples para Next.js App Router (sem async no singleton). Alternativa: `sqlite3` (async) — desnecessário para uso single-user local. |
| **Drizzle ORM** | latest | Type-safety end-to-end: schema TypeScript → tipos inferidos → queries tipadas. `drizzle-kit` para geração de migrations auditáveis. Alternativa: Prisma — overhead de processo separado para SQLite local. |

### Editor de Texto

| Tecnologia | Versão | Justificativa |
|-----------|--------|---------------|
| **TipTap** | 2+ | Editor Notion-like baseado em ProseMirror. `@tiptap/starter-kit` inclui H1-H3, listas, código, blockquote. `@tiptap/extension-markdown` para serialização/desserialização Markdown. Notas persistidas como Markdown puro (não HTML). |

### Identificadores

| Tecnologia | Versão | Justificativa |
|-----------|--------|---------------|
| **ulidx** | latest | ULID: sortable por tempo, monotônico, URL-safe. Melhor que UUID v4 para chaves primárias de banco (ordenação natural). |

### Testes

| Tecnologia | Versão | Justificativa |
|-----------|--------|---------------|
| **Vitest** | latest | Compatível com Vite/Next.js. Mais rápido que Jest para ESM. Configurado com `jsdom` environment para component tests. |
| **@testing-library/react** | latest | Component tests com queries semânticas (por role, label, text) — testa comportamento, não implementação. |
| **Playwright** | latest | E2E tests para fluxos completos e para TipTap (ProseMirror não funciona em JSDOM — ver seção de estratégia). |

---

## Diagrama de Camadas

```
┌──────────────────────────────────────────────────────┐
│                   Browser (Client)                    │
│  React Query ──► Client Components ──► Zustand Store  │
│                      │                                │
│              fetch /api/books                         │
└──────────────────────┬───────────────────────────────┘
                       │ HTTP
┌──────────────────────▼───────────────────────────────┐
│                  Next.js Server                       │
│                                                       │
│  App Router                                           │
│  ├── Server Components ──► src/lib/queries/ ──► DB   │
│  └── Route Handlers ───► src/lib/commands/ ──► DB    │
│                                                       │
│  (CQRS Leve: queries = reads, commands = writes)      │
└──────────────────────┬───────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────┐
│                    SQLite                             │
│  data/homeos.db  (WAL mode)                           │
│  data/covers/    (imagens de capa)                   │
└──────────────────────────────────────────────────────┘
```

---

## Decisões Arquiteturais Registradas

### ADR-1: SQLite sobre PostgreSQL/Supabase
**Decisão:** SQLite local.
**Razão:** App 100% offline, single-user. PostgreSQL exigiria Docker ou servidor externo, contradizendo o requisito de rodar com `npm run dev`. SQLite WAL oferece durabilidade suficiente para uso pessoal.

### ADR-2: CQRS Leve sobre Service Layer/Repository Pattern
**Decisão:** `src/lib/queries/` para reads, `src/lib/commands/` para writes.
**Razão:** Separa leitura (sem side effects, testável como funções puras) de escrita (com side effects explícitos como filesystem). Sem overhead de classes, interfaces ou DI. Favorece TDD.

### ADR-3: Markdown para persistência de notas (não HTML)
**Decisão:** TipTap serializa para Markdown antes de salvar no SQLite.
**Razão:** Markdown é legível fora do TipTap, portável para outros editors, versionável se necessário. HTML gerado por ProseMirror é verboso e acoplado.

### ADR-4: Covers fora de `public/`
**Decisão:** `data/covers/` servida via API route `/api/covers/[filename]`.
**Razão:** Arquivos em `public/` são copiados no build e não funcionam para uploads em runtime no Next.js. API route lê do filesystem e serve com Content-Type correto.

### ADR-5: TipTap testado via Playwright (não JSDOM)
**Decisão:** Lógica de save testada unitariamente; comportamento do editor testado via E2E.
**Razão:** ProseMirror usa APIs de DOM (`Selection`, `Range`, `contenteditable`) não implementadas pelo JSDOM. Tentar testar o editor em JSDOM resulta em falsos positivos ou erros de ambiente.

---

*Documento gerado por Aria (@architect) — 2026-03-25*
