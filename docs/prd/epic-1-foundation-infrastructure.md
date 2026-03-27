# Epic 1 — Foundation & Infrastructure

**Goal:** Configurar o projeto Next.js 15 com todo o stack (Drizzle+SQLite, shadcn/ui, Zustand, React Query, CQRS Leve), implementar o layout shell com sidebar colapsável e tema claro/escuro, entregando uma canary page funcional que valida que toda a fundação está operacional e testada.

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

Como desenvolvedor,
quero Drizzle ORM configurado com better-sqlite3 e o schema de livros definido com migration aplicada,
para que as stories de Books tenham uma camada de dados tipada, testável e com histórico auditável.

**Acceptance Criteria:**
1. `better-sqlite3`, `drizzle-orm` e `drizzle-kit` instalados
2. `drizzle.config.ts` aponta para `data/homeos.db` e `src/lib/db/migrations/`
3. `src/lib/db/schema.ts` define tabela `books` com: `id` (TEXT, ULID, PK), `title` (TEXT NOT NULL), `author` (TEXT NOT NULL), `release_year` (INTEGER nullable), `reading_year` (INTEGER nullable), `status` (TEXT enum: unread/reading/read, default: unread), `cover_path` (TEXT nullable), `synopsis` (TEXT nullable), `notes` (TEXT nullable), `created_at` (TEXT NOT NULL), `updated_at` (TEXT NOT NULL)
4. `src/lib/db/index.ts` exporta singleton do DB seguro para hot reload do Next.js com WAL mode habilitado
5. `npm run db:generate` produz migration em `src/lib/db/migrations/`
6. `npm run db:migrate` aplica a migration e cria `data/homeos.db`
7. `data/homeos.db` e `data/covers/` adicionados ao `.gitignore`; arquivos de migration **não** estão no `.gitignore`
8. Tipos `Book` e `NewBook` exportados de `src/types/index.ts` (inferidos do schema Drizzle)
9. Testes unitários (TDD) para o schema: validar que os tipos TypeScript possuem os campos esperados

## Story 1.3 — App Layout Shell

Como usuário,
quero navegar entre seções do HomeOS via sidebar persistente,
para que todas as features sejam acessíveis a partir de um ponto central de navegação.

**Acceptance Criteria:**
1. `src/components/layout/app-sidebar.tsx` renderiza sidebar com itens: "Biblioteca" (submenu: "Livros") e "Design System"
2. Sidebar colapsa para modo ícone via botão toggle — estado persistido no Zustand store
3. Rota ativa é destacada visualmente na sidebar
4. Layout root (`src/app/layout.tsx`) compõe sidebar + área de conteúdo principal
5. Em viewport < 768px: sidebar oculta com menu hamburger que abre Sheet (shadcn/ui)
6. Navegação usa `<Link>` do Next.js — sem full page reload
7. `/` redireciona para `/books`
8. Testes (TDD): pelo menos 1 teste de componente para `AppSidebar` validando renderização dos itens e estado de colapso

## Story 1.4 — Global State & Theme

Como usuário,
quero alternar entre tema claro e escuro com minha preferência salva,
para que o sistema respeite minha escolha visual entre sessões.

**Acceptance Criteria:**
1. `next-themes` instalado e `ThemeProvider` configurado no root layout
2. `src/store/ui-store.ts` define store Zustand com: `sidebarCollapsed` (boolean) e `theme` (light/dark/system)
3. `src/components/layout/theme-toggle.tsx` alterna tema e reflete estado atual
4. Tema persiste entre reloads via `next-themes` + localStorage
5. `QueryClientProvider` do React Query envolve o app no root layout
6. Todos os providers compostos em `src/components/providers.tsx` (client component único)
7. Canary page exibe: nome "HomeOS", tema toggle funcional e link para `/design-system`
8. Testes unitários (TDD) para o Zustand store: validar mutations de `sidebarCollapsed` e `theme`

---
