# Epic 1 — Foundation & Infrastructure

**Goal:** Configurar o projeto Next.js 15 com todo o stack (Drizzle+SQLite, shadcn/ui, Zustand, React Query, CQRS Leve), implementar o layout shell com sidebar colapsável e tema claro/escuro, entregando a Home page real dentro do route group `(app)` que valida que toda a fundação está operacional e testada.

## Story 1.1 — Project Scaffolding

Como desenvolvedor,
quero um projeto Next.js 15 configurado com TypeScript strict, Tailwind CSS, shadcn/ui e ferramentas de qualidade,
para que todas as stories subsequentes tenham uma base consistente e sem configuração duplicada.

**Acceptance Criteria:**
1. Next.js 15+ criado com App Router e TypeScript strict mode habilitado
2. Tailwind CSS v4 configurado com `@import "tailwindcss"` (sem `tailwind.config.js`)
3. shadcn/ui inicializado com `components.json` apontando para `src/components/ui/`
4. ESLint + Prettier configurados com regras padrão do projeto
5. Vitest + Testing Library instalados com configuração base em `vitest.config.ts`
6. Playwright instalado com configuração base em `playwright.config.ts`
7. `npm run dev`, `npm run build`, `npm run test` e `npm run lint` executam sem erros
8. Estrutura de diretórios criada: `src/app/`, `src/components/`, `src/lib/`, `src/hooks/`, `src/store/`, `src/lib/queries/`, `src/lib/commands/`
9. Pelo menos 1 teste unitário escrito (TDD: test-first) validando a configuração do Vitest

## Story 1.2 — Database Setup

**Status: DONE (implementado conforme PRD original v1.0; limpeza do schema books pendente via Story 1.2-delta)**

Como desenvolvedor,
quero Drizzle ORM configurado com better-sqlite3 e banco SQLite funcional,
para que o sistema tenha uma camada de dados extensível pronta para futuros módulos.

**Acceptance Criteria (revisados em v1.1):**
1. `better-sqlite3`, `drizzle-orm` e `drizzle-kit` instalados
2. `drizzle.config.ts` aponta para `data/homeos.db` e `src/lib/db/migrations/`
3. `src/lib/db/schema.ts` exporta o schema do banco — sem tabelas obrigatórias no escopo v1 (tabela `books` a ser removida via Story 1.2-delta)
4. `src/lib/db/index.ts` exporta singleton do DB seguro para hot reload do Next.js com WAL mode habilitado
5. `npm run db:generate` e `npm run db:migrate` funcionam corretamente
6. `data/homeos.db` adicionado ao `.gitignore`; arquivos de migration não estão no `.gitignore`
7. Testes unitários atualizados para refletir ausência da tabela `books` (via Story 1.2-delta)

> **Nota v1.1:** AC original #3 definia tabela `books` com 11 campos e AC #8 definia tipos `Book` e `NewBook`. Ambos removidos do escopo v1. A migration e os testes serão limpos na Story 1.2-delta.

## Story 1.3 — App Layout Shell

**Status: DONE (implementado; sidebar com "Biblioteca > Livros" — atualização de navegação pendente via Story 1.3-delta)**

Como usuário,
quero navegar entre seções do HomeOS via sidebar persistente,
para que todas as features sejam acessíveis a partir de um ponto central de navegação.

**Acceptance Criteria (revisados em v1.1):**
1. `src/components/layout/app-sidebar.tsx` renderiza sidebar com itens: "Home" (href: `/`) e "Design System" (href: `/design-system`)
2. Sidebar colapsa para modo ícone via botão toggle — estado persistido no Zustand store
3. Rota ativa é destacada visualmente na sidebar
4. Layout root (`src/app/(app)/layout.tsx`) compõe sidebar + área de conteúdo principal via route group `(app)`
5. Em viewport < 768px: sidebar oculta com menu hamburger que abre Sheet (shadcn/ui)
6. Navegação usa `<Link>` do Next.js — sem full page reload
7. Itens "Biblioteca" e "Livros" removidos da sidebar (via Story 1.3-delta)
8. Testes de componente atualizados para refletir nova estrutura de navItems (via Story 1.3-delta)

> **Nota v1.1:** AC original #1 definia "Biblioteca (submenu: Livros)" e AC #7 definia redirect de `/` para `/books`. Ambos substituídos. Código atualizado via Story 1.3-delta.

## Story 1.4 — Global State & Theme

**Status: DONE (implementado; canary page em `/` fora de `(app)` — conversão para Home page real pendente via Story 1.4-delta)**

Como usuário,
quero alternar entre tema claro e escuro com minha preferência salva,
para que o sistema respeite minha escolha visual entre sessões.

**Acceptance Criteria (revisados em v1.1):**
1. `next-themes` instalado e `ThemeProvider` configurado no root layout
2. `src/store/ui-store.ts` define store Zustand com: `sidebarCollapsed` (boolean) e `theme` (light/dark/system)
3. `src/components/layout/theme-toggle.tsx` alterna tema e reflete estado atual
4. Tema persiste entre reloads via `next-themes` + localStorage
5. `QueryClientProvider` do React Query envolve o app no root layout
6. Todos os providers compostos em `src/components/providers.tsx` (client component único)
7. `src/app/(app)/page.tsx` é a Home page real — dentro do route group `(app)`, herdando layout com sidebar — exibe título "HomeOS" (via Story 1.4-delta)
8. `src/app/page.tsx` (canary) removida — rota `/` serve a Home page via route group `(app)` (via Story 1.4-delta)
9. Testes unitários (TDD) para o Zustand store: validar mutations de `sidebarCollapsed` e `theme`

> **Nota v1.1:** AC original #7 definia canary page fora de `(app)` com links para `/design-system`. Substituído: canary convertida em Home page real dentro de `(app)`. Código atualizado via Story 1.4-delta.

---

## Story 1.2-delta — Remoção do Schema Books

**Status: PENDING**

Como desenvolvedor,
quero remover o schema e a migration da tabela `books` do codebase,
para que o banco de dados não contenha artefatos de uma funcionalidade removida do escopo v1.

**Acceptance Criteria:**
1. Export `books` removido de `src/lib/db/schema.ts` — arquivo pode ficar com schema vazio
2. Migration `0000_cooing_carlie_cooper.sql` removida de `src/lib/db/migrations/`
3. Snapshots de meta (`meta/0000_snapshot.json`) removidos; `_journal.json` resetado para estado vazio
4. Tipos `Book` e `NewBook` removidos de `src/types/index.ts`
5. `tests/unit/db/schema.test.ts` removido ou substituído por placeholder sem referências a books
6. `data/homeos.db` deletado localmente; banco recriado via `npm run db:migrate` para validar estado limpo
7. `npm run test` e `npm run build` passam sem erros

## Story 1.3-delta — Atualização da Sidebar

**Status: PENDING**

Como desenvolvedor,
quero atualizar `app-sidebar.tsx` para refletir a nova estrutura de navegação (Home + Design System),
para que a sidebar não referencie rotas ou seções removidas do escopo v1.

**Acceptance Criteria:**
1. `navItems` em `src/components/layout/app-sidebar.tsx` atualizado para: `[{ label: "Home", href: "/", icon: Home }, { label: "Design System", href: "/design-system", icon: Palette }]`
2. Imports de `BookOpen` e `List` removidos do arquivo
3. Nenhuma referência a "Biblioteca", "Livros" ou `/books` permanece no componente
4. `tests/component/app-sidebar.test.tsx` atualizado: remover assertions de "Biblioteca"/"Livros", adicionar assertions de "Home"/"Design System"
5. `npm run test` e `npm run lint` passam sem erros

## Story 1.4-delta — Conversão da Canary Page em Home Page Real

**Status: PENDING**

Como usuário,
quero que a rota `/` seja a Home page real do HomeOS com sidebar visível,
para que o ponto de entrada do sistema tenha a mesma estrutura de navegação de todas as outras páginas.

**Acceptance Criteria:**
1. `src/app/(app)/page.tsx` criado como Home page real — dentro do route group `(app)` para herdar o layout com sidebar
2. Home page exibe título "HomeOS" — layout simples, sem links de navegação adicionais (a sidebar já provê navegação)
3. `src/app/page.tsx` (canary page fora de `(app)`) removida — rota `/` passa a ser servida por `src/app/(app)/page.tsx`
4. Sidebar exibe item "Home" como ativo ao visitar `/`
5. Nenhuma referência a `/books` ou links extras permanece na Home page
6. Teste de componente (TDD): validar que a Home page renderiza o título "HomeOS"
7. Teste E2E (Playwright): navegar para `/`, validar que sidebar está visível e item "Home" está ativo
8. `npm run test`, `npm run build` e `npm run lint` passam sem erros

**Depende de:** Story 1.3-delta (sidebar deve ter item "Home" para o active state funcionar)

---
