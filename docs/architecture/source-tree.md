# HomeOS — Source Tree

## Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-03-25 | 1.0 | Criação inicial | Aria (@architect) |

---

## Estrutura Completa de Diretórios

```
homeos/
├── src/
│   ├── app/                          # Next.js App Router — rotas e layouts
│   │   ├── layout.tsx                # Root layout: providers, fonts, metadata
│   │   ├── page.tsx                  # Redirect → /books
│   │   ├── not-found.tsx             # Página 404 global
│   │   ├── (app)/                    # Route group com AppShell (sidebar + conteúdo)
│   │   │   ├── layout.tsx            # Layout com AppSidebar + main content area
│   │   │   ├── books/
│   │   │   │   ├── page.tsx          # /books — grid de cards com filtros e busca
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # /books/[id] — detalhe: capa, metadados, sinopse, notas
│   │   │   └── design-system/
│   │   │       └── page.tsx          # /design-system — showcase de componentes UI
│   │   └── api/                      # Route Handlers (mutações e dados)
│   │       ├── books/
│   │       │   ├── route.ts          # GET /api/books, POST /api/books
│   │       │   └── [id]/
│   │       │       ├── route.ts      # GET, PATCH, DELETE /api/books/[id]
│   │       │       └── cover/
│   │       │           └── route.ts  # POST /api/books/[id]/cover — upload de capa
│   │       └── covers/
│   │           └── [filename]/
│   │               └── route.ts      # GET /api/covers/[filename] — serve imagens
│   │
│   ├── components/                   # Componentes React reutilizáveis
│   │   ├── ui/                       # shadcn/ui — copiados via CLI, não modificar diretamente
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── sheet.tsx
│   │   │   └── ...                   # demais componentes shadcn/ui
│   │   ├── layout/                   # Componentes de estrutura da aplicação
│   │   │   ├── app-sidebar.tsx       # Sidebar colapsável com menus/submenus
│   │   │   ├── sidebar-nav-item.tsx  # Item de navegação com estado ativo
│   │   │   └── theme-toggle.tsx      # Botão light/dark/system
│   │   ├── books/                    # Componentes do módulo de livros
│   │   │   ├── book-card.tsx         # Card com capa, título, autor, badge de status
│   │   │   ├── book-form.tsx         # Formulário de criação/edição (usado no Dialog)
│   │   │   ├── book-detail.tsx       # Capa + metadados + sinopse inline editável
│   │   │   ├── book-cover-upload.tsx # Input de upload com preview e validação
│   │   │   ├── book-filters.tsx      # Filtro de status + campo de busca com debounce
│   │   │   ├── book-notes-editor.tsx # Editor TipTap com dirty state e modo leitura/edição
│   │   │   └── editor-toolbar.tsx    # Toolbar de formatação do TipTap
│   │   └── providers.tsx             # Client component: QueryClient + ThemeProvider compostos
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-books.ts              # useBooks(filters) — React Query wrapper para /api/books
│   │   ├── use-book.ts               # useBook(id) — React Query wrapper para /api/books/[id]
│   │   └── use-debounce.ts           # Debounce genérico para inputs de busca
│   │
│   ├── lib/                          # Lógica de negócio e utilitários server-side
│   │   ├── db/                       # Camada de banco de dados
│   │   │   ├── index.ts              # Singleton do DB — safe para hot reload (ver padrão abaixo)
│   │   │   ├── schema.ts             # Definição das tabelas Drizzle (fonte de verdade dos tipos)
│   │   │   └── migrations/           # Arquivos SQL gerados por drizzle-kit (versionados no git)
│   │   │       └── 0001_initial.sql
│   │   ├── queries/                  # CQRS: operações de LEITURA (sem side effects)
│   │   │   └── books.ts              # getBooks(filters), getBookById(id)
│   │   ├── commands/                 # CQRS: operações de ESCRITA (com side effects)
│   │   │   └── books.ts              # createBook, updateBook, deleteBook, updateBookNotes
│   │   └── validations/              # Schemas Zod compartilhados frontend ↔ backend
│   │       └── book.ts               # createBookSchema, updateBookSchema, coverUploadSchema
│   │
│   ├── store/                        # Estado global client-side (Zustand)
│   │   └── ui-store.ts               # sidebarCollapsed, theme — com persist middleware
│   │
│   └── types/                        # Tipos TypeScript exportados do projeto
│       └── index.ts                  # Book, NewBook (inferidos do schema Drizzle)
│
├── tests/                            # Testes organizados por tipo
│   ├── unit/                         # Testes unitários (Vitest, sem DOM)
│   │   ├── validations/
│   │   │   └── book.test.ts
│   │   ├── commands/
│   │   │   └── books.test.ts
│   │   └── store/
│   │       └── ui-store.test.ts
│   ├── integration/                  # Testes de integração (Vitest + SQLite :memory:)
│   │   └── api/
│   │       ├── books.test.ts         # GET, POST, PATCH, DELETE /api/books
│   │       └── covers.test.ts        # Upload e validação de covers
│   ├── component/                    # Testes de componente (Vitest + Testing Library)
│   │   ├── book-card.test.tsx
│   │   ├── book-form.test.tsx
│   │   ├── app-sidebar.test.tsx
│   │   └── book-notes-editor.test.tsx
│   └── e2e/                          # Testes E2E (Playwright)
│       ├── books-flow.spec.ts        # Criar livro → editar → detalhe → notas → salvar
│       └── editor.spec.ts            # Comportamento do TipTap (não testável em JSDOM)
│
├── data/                             # Dados runtime (gitignored, exceto migrations)
│   ├── homeos.db                     # Banco SQLite (gitignored)
│   └── covers/                       # Imagens de capa (gitignored)
│       └── .gitkeep
│
├── public/                           # Assets estáticos Next.js
│   └── favicon.ico
│
├── drizzle.config.ts                 # Configuração do drizzle-kit
├── vitest.config.ts                  # Configuração do Vitest
├── playwright.config.ts              # Configuração do Playwright
├── components.json                   # Configuração do shadcn/ui CLI
├── tsconfig.json                     # TypeScript strict mode
├── next.config.ts                    # Configuração do Next.js
├── .gitignore                        # data/homeos.db, data/covers/* (exceto .gitkeep)
└── package.json
```

---

## Convenções de Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componentes | `kebab-case.tsx` | `book-card.tsx` |
| Hooks | `use-kebab-case.ts` | `use-books.ts` |
| Stores | `kebab-case-store.ts` | `ui-store.ts` |
| Queries | `kebab-case.ts` em `lib/queries/` | `queries/books.ts` |
| Commands | `kebab-case.ts` em `lib/commands/` | `commands/books.ts` |
| Validations | `kebab-case.ts` em `lib/validations/` | `validations/book.ts` |
| Testes | `*.test.ts(x)` ou `*.spec.ts` (E2E) | `book-card.test.tsx` |
| Rotas API | `route.ts` por convenção Next.js | `app/api/books/route.ts` |

---

## Aliases de Import (tsconfig paths)

```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@/components/*": ["./src/components/*"],
    "@/lib/*": ["./src/lib/*"],
    "@/hooks/*": ["./src/hooks/*"],
    "@/store/*": ["./src/store/*"],
    "@/types/*": ["./src/types/*"]
  }
}
```

> Todos os imports internos usam alias `@/` — nunca caminhos relativos com `../../`.

---

## Route Group `(app)`

O diretório `(app)` é um **route group** do Next.js — o parêntese não aparece na URL. Ele serve para compartilhar o layout com sidebar entre `/books` e `/design-system` sem afetar o root layout (que é mais genérico). A rota `/` (root) redireciona para `/books` sem pertencer ao grupo.

---

*Documento gerado por Aria (@architect) — 2026-03-25*
