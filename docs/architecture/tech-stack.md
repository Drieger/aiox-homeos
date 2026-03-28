# HomeOS — Tech Stack

## Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-03-25 | 1.0 | Criação inicial | Aria (@architect) |
| 2026-03-28 | 1.1 | ADR-6 (editor KB), ADR-5 generalizado, seção KB Markdown Stack | Aria (@architect) |

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
| **TipTap** | 2+ | ~~Planejado para módulo Books (removido v1.1 — nunca instalado). Ver ADR-6.~~ |
| **@uiw/react-md-editor** | latest | Editor Markdown raw para o módulo Knowledge Base (Epic 3). Paradigma raw-MD+preview (não WYSIWYG). Inclui editor CodeMirror + preview integrado. Ver ADR-6. |

### KB Markdown Stack (Epic 3)

| Tecnologia | Versão | Justificativa |
|-----------|--------|---------------|
| **react-markdown** | latest | Renderização de Markdown no preview do KB. Suporta plugins remark/rehype customizados (wiki-links). |
| **remark-gfm** | latest | GitHub Flavored Markdown: tabelas, checkboxes, strikethrough. |
| **rehype-highlight** | latest | Syntax highlight em code blocks no preview (via lowlight). |
| **@tailwindcss/typography** | latest | Classes `prose` para tipografia elegante no preview. Integrado via `@plugin "@tailwindcss/typography"` no `globals.css` (sintaxe Tailwind v4). |

### Identificadores

| Tecnologia | Versão | Justificativa |
|-----------|--------|---------------|
| **ulidx** | latest | ULID: sortable por tempo, monotônico, URL-safe. Melhor que UUID v4 para chaves primárias de banco (ordenação natural). |

### Testes

| Tecnologia | Versão | Justificativa |
|-----------|--------|---------------|
| **Vitest** | latest | Compatível com Vite/Next.js. Mais rápido que Jest para ESM. Configurado com `jsdom` environment para component tests. |
| **@testing-library/react** | latest | Component tests com queries semânticas (por role, label, text) — testa comportamento, não implementação. |
| **Playwright** | latest | E2E tests para fluxos completos e para editores ricos (ProseMirror/CodeMirror não funcionam em JSDOM — ver ADR-5). |

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
**Decisão:** Conteúdo de documentos persiste como Markdown puro no SQLite.
**Razão:** Markdown é legível fora do editor, portável, versionável. HTML gerado por editores ricos é verboso e acoplado à implementação do editor.

### ADR-4: Covers fora de `public/`
**Decisão:** `data/covers/` servida via API route `/api/covers/[filename]`.
**Razão:** Arquivos em `public/` são copiados no build e não funcionam para uploads em runtime no Next.js. API route lê do filesystem e serve com Content-Type correto.

### ADR-5: Editores ricos testados via Playwright (não JSDOM)
**Decisão:** Lógica de negócio (save, debounce, Server Actions) testada unitariamente via Vitest; comportamento interativo do editor testado via Playwright E2E.
**Razão:** ProseMirror (TipTap) e CodeMirror (`@uiw/react-md-editor`) usam APIs de DOM (`Selection`, `Range`, `contenteditable`) não implementadas pelo JSDOM. Testes de editor em JSDOM produzem falsos positivos ou erros de ambiente.

### ADR-6: KB usa `@uiw/react-md-editor` (não TipTap)
**Decisão:** O módulo Knowledge Base (Epic 3) usa `@uiw/react-md-editor` para edição Markdown raw + preview renderizado.
**Razão:** TipTap era planejado para o módulo Books (WYSIWYG) que foi removido em v1.1 e nunca instalado. O KB adota paradigma diferente — o usuário escreve Markdown diretamente e alterna para visualização renderizada. `@uiw/react-md-editor` é projetado exatamente para esse caso de uso, sem a complexidade do ProseMirror/TipTap.

### ADR-7: FTS5 com external content table + triggers
**Decisão:** `documents_fts` é uma FTS5 external content table (`content=documents`). Sincronização mantida via triggers SQL (AFTER INSERT/UPDATE/DELETE em `documents`).
**Razão:** External content FTS5 evita duplicação de dados no banco. Triggers garantem consistência automática sem lógica na camada de aplicação. A alternativa (rebuild manual do índice) seria frágil e dependente da camada de aplicação para manter a busca atualizada.

---

*Documento gerado por Aria (@architect) — 2026-03-25*
