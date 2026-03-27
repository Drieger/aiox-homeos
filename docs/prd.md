# HomeOS Product Requirements Document (PRD)

## Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-03-25 | 1.0 | Criação inicial do PRD | Morgan (@pm) |

---

## Goals and Background Context

### Goals

- Ter um sistema web local chamado **HomeOS** que centraliza o gerenciamento da vida pessoal
- Navegar facilmente entre seções via sidebar colapsável com menus e submenus
- Visualizar e explorar o design system do produto em uma página dedicada
- Gerenciar uma biblioteca pessoal de livros com CRUD completo (título, autor, anos, status, capa)
- Registrar notas formatadas (Notion-like) por livro, persistidas localmente em SQLite

### Background Context

HomeOS surge da necessidade de ter um hub pessoal de produtividade que rode **completamente offline**, sem dependência de serviços externos ou assinaturas. A maioria das ferramentas existentes (Notion, Obsidian, Capacities) são cloud-first ou possuem funcionalidades dispersas que não se integram naturalmente ao fluxo de vida pessoal de um único usuário.

HomeOS é desenhado para ser uma plataforma extensível: começa com a gestão de livros, mas a arquitetura de navegação por sidebar e a base de dados local permitem adicionar novos módulos (filmes, finanças, rotinas) sem reescrever a fundação. O sistema roda como uma aplicação Next.js local — iniciada com `npm run dev` ou `npm start` — e armazena todos os dados em SQLite no próprio filesystem do usuário.

### Success Criteria (Pessoais)

<!-- TODO: @pm — refinar com o usuário -->
- Conseguir catalogar um livro completo (título, autor, capa, sinopse) em menos de 2 minutos
- Acessar as notas de qualquer livro em no máximo 3 cliques a partir da página inicial
- Design System page funciona como referência visual suficiente para desenvolver novos módulos sem abrir documentação externa
- Sistema inicia e carrega em menos de 1 segundo em localhost

---

## Requirements

### Functional Requirements

- **FR1:** O sistema deve ter uma sidebar de navegação colapsável com menus e submenus
- **FR2:** O sistema deve suportar tema claro e escuro com persistência entre sessões
- **FR3:** O sistema deve ter uma rota `/design-system` com showcase interativo de todos os componentes UI instalados (tipografia, cores, form elements, overlays)
- **FR4:** O usuário deve poder criar, visualizar, editar e deletar livros com os campos: título (obrigatório), autor (obrigatório), ano de lançamento (opcional), ano de leitura (opcional), status (não lido / lendo / lido) e imagem de capa (opcional)
- **FR5:** O usuário deve poder filtrar a lista de livros por status e buscar por título ou autor
- **FR6:** Cada livro deve ter uma página de detalhe contendo: capa, metadados, seção de sinopse (texto livre editável inline) e seção de notas
- **FR7:** A seção de notas de cada livro deve ter um editor rich text estilo Notion com suporte a: H1, H2, H3, negrito, itálico, listas (ordenadas e não-ordenadas), bloco de código, citação (blockquote)
- **FR8:** As notas devem ser salvas pelo usuário via botão "Salvar" explícito; o estado "não salvo" deve ser indicado visualmente (ex: badge "Não salvo" no botão)
- **FR9:** O usuário deve poder fazer upload de uma imagem de capa para cada livro (JPEG/PNG/WebP, limite 2MB)

### Non-Functional Requirements

- **NFR1:** Page load abaixo de 1 segundo em localhost
- **NFR2:** TypeScript strict mode habilitado em todo o projeto
- **NFR3:** Zod validation em todos os inputs das API routes
- **NFR4:** SQLite em WAL mode para durabilidade de dados
- **NFR5:** Todos os nomes de colunas do banco de dados em inglês
- **NFR6:** Todas as migrations do banco commitadas em `src/lib/db/migrations/` para rastreabilidade completa do histórico do schema; arquivo `data/homeos.db` gitignored
- **NFR7:** TDD obrigatório — testes escritos ANTES da implementação em todas as stories de código; stack: Vitest + Testing Library (unit/integration/component) + Playwright (E2E)
- **NFR8:** Todas as funções não-triviais documentadas com JSDoc incluindo as decisões de design tomadas (propósito, parâmetros, retorno, raciocínio da escolha)

---

## User Interface Design Goals

### Overall UX Vision

HomeOS deve ter uma identidade visual de **produtividade pessoal refinada** — limpa, sem distrações, com densidade de informação controlada. A inspiração é a intersecção entre o minimalismo do Linear e a clareza do Notion. Não é um dashboard corporativo; é um espaço pessoal que deve parecer confortável e familiar.

### Key Interaction Paradigms

- Sidebar persistente à esquerda como âncora de navegação (colapsável para modo ícone)
- Cards para visualização de livros em grid (modo padrão)
- Dialogs/modais para criação e edição de itens (sem páginas separadas de formulário)
- Página de detalhe dedicada para leitura/edição de conteúdo longo (sinopse + notas)
- Editor de notas inline na página de detalhe com toggle read-only / edit mode

### Core Screens and Views

1. `/books` — Grid de cards de livros com filtros de status e campo de busca
2. `/books/[id]` — Detalhe do livro: capa, metadados, sinopse editável inline, editor de notas
3. `/design-system` — Showcase de componentes UI organizados por categoria
4. Dialog de criação/edição de livro (overlay sobre qualquer rota)

### Accessibility

WCAG AA

### Branding

- **Nome:** HomeOS
- **Paleta:** Neutros (slate) como base, accent color único a definir com @ux-design-expert
- **Tipografia:** Inter (sans-serif, padrão shadcn/ui)
- **Tema escuro** como primeira classe — não afterthought
- **Ícones:** Lucide React (funcional, sem decoração excessiva)

### Target Device and Platforms

Web — Desktop primary (1280px+), layout funcional em telas menores (mobile via Sheet na sidebar)

---

## Technical Assumptions

### Repository Structure

Monorepo single app — sem workspaces. App pessoal local sem múltiplos serviços.

### Service Architecture

**Monolith — Next.js 15 App Router com API Routes internas e CQRS Leve:**

- **Leitura:** Server Components e Client Components via React Query → `src/lib/queries/` → Drizzle → SQLite
- **Escrita:** Route Handlers → `src/lib/commands/` → Drizzle + side effects → SQLite

```
Leitura:  Component → src/lib/queries/books.ts → db (Drizzle)
Escrita:  Route Handler → src/lib/commands/books.ts → db + filesystem
```

Decisão: CQRS Leve escolhido sobre Service Layer simples e Repository Pattern por separar claramente reads (sem side effects, diretos e testáveis) de writes (com side effects explícitos), sem overhead de classes ou injeção de dependência. Funções puras facilitam TDD.

### Testing Requirements

**Full Testing Pyramid — TDD obrigatório:**

| Camada | Tool | Escopo |
|--------|------|--------|
| Unit | Vitest | Utilitários, validações Zod, commands, queries |
| Integration | Vitest + SQLite `:memory:` | API Route Handlers |
| Component | Testing Library + Vitest | BookForm, BookCard, AppSidebar, componentes críticos |
| E2E | Playwright | Fluxo completo: criar livro, editar notas, salvar |

Nota: TipTap (ProseMirror) não é testável via JSDOM — lógica de save é testada unitariamente; comportamento do editor é testado via Playwright E2E.

### Stack Completo

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

### Additional Technical Assumptions

- Colunas do banco de dados em inglês (obrigatório)
- Todas as funções não-triviais com JSDoc incluindo decisão de design
- `drizzle-kit generate` sempre seguido de commit dos arquivos gerados
- Cover images: JPEG/PNG/WebP, limite 2MB; armazenadas em `data/covers/{bookId}.{ext}` (fora de `public/` para evitar problemas com Next.js estático em runtime); servidas via `/api/covers/[filename]`
- Notas salvas manualmente via botão explícito com dirty state indicator
- Índices SQLite em `status` e `author` para performance de filtros/busca

---

## Epic List

| # | Epic | Goal |
|---|------|------|
| 1 | Foundation & Infrastructure | Configurar o projeto completo com todo o stack, layout shell e canary page funcional |
| 2 | Design System Page | Showcase vivo e interativo de todos os componentes UI instalados |
| 3 | Books: Core CRUD | Módulo de livros completo: listagem, criação, edição, detalhe, upload de capa |
| 4 | Books: Notes Editor | Editor TipTap com toolbar, save manual com dirty state, persistência como Markdown |

---

## Epic 1 — Foundation & Infrastructure

**Goal:** Configurar o projeto Next.js 15 com todo o stack (Drizzle+SQLite, shadcn/ui, Zustand, React Query, CQRS Leve), implementar o layout shell com sidebar colapsável e tema claro/escuro, entregando uma canary page funcional que valida que toda a fundação está operacional e testada.

### Story 1.1 — Project Scaffolding

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

### Story 1.2 — Database Setup

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

### Story 1.3 — App Layout Shell

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

### Story 1.4 — Global State & Theme

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

## Epic 2 — Design System Page

**Goal:** Implementar a rota `/design-system` como um showcase vivo e interativo de todos os componentes shadcn/ui instalados no projeto, servindo como referência visual centralizada que evolui junto com o sistema.

### Story 2.1 — Design System Page Scaffold

Como desenvolvedor,
quero uma página `/design-system` estruturada com seções e navegação interna,
para que os componentes possam ser adicionados de forma organizada ao longo do projeto.

**Acceptance Criteria:**
1. Rota `/design-system` criada em `src/app/(app)/design-system/page.tsx`
2. Página renderiza seções navegáveis: "Tipografia", "Cores", "Componentes de Formulário", "Overlays"
3. Navegação interna via âncoras com scroll suave
4. Layout da página usa grid de 2 colunas em desktop: menu lateral fixo + área de conteúdo
5. Sidebar do app exibe "Design System" como item ativo ao navegar para esta rota
6. Teste de componente (TDD): validar que as 4 seções são renderizadas

### Story 2.2 — Tipografia e Cores

Como usuário,
quero visualizar a escala tipográfica e a paleta de cores do HomeOS,
para que eu tenha uma referência visual dos tokens de design do sistema.

**Acceptance Criteria:**
1. Seção "Tipografia" exibe todos os níveis: H1, H2, H3, H4, body, small, muted, code — com nome do token e exemplo
2. Seção "Cores" exibe todos os tokens CSS do tema shadcn/ui em modo claro e escuro simultaneamente (dois swatches lado a lado)
3. Cada swatch exibe: nome do token, valor CSS variable e preview colorido
4. Ambas as seções respondem ao toggle de tema
5. Teste de componente (TDD): validar renderização dos tokens

### Story 2.3 — Showcase: Form Elements

Como usuário,
quero ver e interagir com os componentes de formulário do Design System,
para que eu possa verificar aparência e comportamento de cada elemento.

**Acceptance Criteria:**
1. Seção exibe: `Button` (todas variantes), `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Badge` (todas variantes), `Label`
2. Cada componente exibido com nome, variantes disponíveis e exemplo interativo funcional
3. Estados desabilitados demonstrados para `Button` e `Input`
4. Todos os componentes renderizam corretamente em tema claro e escuro
5. Teste de componente (TDD): validar que cada componente está presente na seção

### Story 2.4 — Showcase: Overlays e Feedback

Como usuário,
quero ver e disparar os componentes de overlay e feedback do Design System,
para que eu possa verificar o comportamento de modais, sheets e notificações.

**Acceptance Criteria:**
1. Seção "Overlays" exibe: `Dialog`, `Sheet`, `Tooltip`, `Popover`, `DropdownMenu`
2. Seção "Feedback" exibe: `Toast` (com botão para disparar), `Alert` (todas variantes), `Skeleton`, `Progress`
3. Cada overlay abre e fecha corretamente ao interagir com o trigger
4. Toast pode ser disparado via botão e desaparece após timeout
5. Teste de componente (TDD): validar que triggers de Dialog e Sheet estão presentes e são clicáveis

---

## Epic 3 — Books: Core CRUD

**Goal:** Implementar o módulo de livros completo — listagem com filtros e busca, criação e edição via dialog, página de detalhe com sinopse e upload de capa — entregando uma biblioteca pessoal funcional e testada end-to-end com a arquitetura CQRS Leve.

### Story 3.1 — Books API Routes

Como desenvolvedor,
quero API routes tipadas e validadas para todas as operações de livros,
para que o frontend tenha uma interface de dados confiável e testável.

**Acceptance Criteria:**
1. `GET /api/books` retorna lista de livros com suporte a query params: `status` (filter) e `q` (search por title/author)
2. `POST /api/books` cria um livro; body validado com Zod; retorna 201 com o livro criado
3. `GET /api/books/[id]` retorna um livro pelo id; retorna 404 se não encontrado
4. `PATCH /api/books/[id]` atualiza campos parciais; body validado com Zod; atualiza `updated_at`
5. `DELETE /api/books/[id]` deleta o livro via `src/lib/commands/books.ts` (remove cover do disco se existir)
6. `GET /api/covers/[filename]` serve arquivos de imagem de `data/covers/` com Content-Type correto
7. Schemas Zod definidos em `src/lib/validations/book.ts` e compartilhados entre routes e frontend
8. Queries de leitura em `src/lib/queries/books.ts`; comandos de escrita em `src/lib/commands/books.ts`
9. Testes de integração (TDD): todos os endpoints testados com banco SQLite em memória (`":memory:"`)

### Story 3.2 — Books List Page

Como usuário,
quero visualizar minha biblioteca com filtros e busca,
para que eu encontre rapidamente qualquer livro independente do tamanho da coleção.

**Acceptance Criteria:**
1. `/books` exibe grid de cards com: capa (ou placeholder), título, autor, ano e badge de status
2. Filtro de status funcional: "Todos", "Não lido", "Lendo", "Lido"
3. Campo de busca filtra por título ou autor em tempo real (debounce 300ms no input)
4. Estado vazio exibe mensagem amigável e botão "Adicionar livro"
5. Estado de loading exibe Skeleton cards durante fetch
6. Hooks React Query em `src/hooks/use-books.ts`: `useBooks(filters)` com cache e invalidação
7. Testes de componente (TDD): validar renderização de cards, estado vazio e estado de loading

### Story 3.3 — Add/Edit Book Dialog

Como usuário,
quero criar e editar livros através de um dialog com formulário validado,
para que eu possa manter minha biblioteca atualizada sem sair da página de listagem.

**Acceptance Criteria:**
1. Botão "Adicionar livro" na list page abre `Dialog` com formulário
2. Formulário contém: título (obrigatório), autor (obrigatório), ano de lançamento (numérico, opcional), ano de leitura (numérico, opcional), status (Select com 3 opções)
3. Validação client-side com Zod: campos obrigatórios, anos entre 1000 e ano atual, status válido
4. Erros de validação exibidos inline abaixo de cada campo
5. Submit chama `POST /api/books`, fecha o dialog e invalida cache do React Query
6. Ao editar, dialog abre pré-preenchido e submit chama `PATCH /api/books/[id]`
7. Botão de delete no dialog de edição com Dialog de confirmação antes de executar
8. Toast de sucesso/erro após cada operação
9. Testes de componente (TDD): validar submit com dados válidos e exibição de erros com dados inválidos

### Story 3.4 — Book Detail Page

Como usuário,
quero uma página de detalhe para cada livro com capa, metadados e sinopse,
para que eu tenha uma visão completa do livro antes de acessar minhas notas.

**Acceptance Criteria:**
1. `/books/[id]` exibe: capa (ou placeholder), título, autor, ano de lançamento, ano de leitura, badge de status
2. Seção "Sinopse" com `Textarea` editável inline — salva via `PATCH /api/books/[id]` ao perder foco (`onBlur`)
3. Botão "Editar" abre o dialog de edição da Story 3.3 pré-preenchido
4. Breadcrumb de navegação: "Biblioteca → {título do livro}"
5. Botão "Voltar" retorna para `/books`
6. Se `id` não existe: exibe página 404 com link para `/books`
7. Seção "Notas" presente como placeholder "Editor de notas chegará em breve" (substituída no Epic 4)
8. Testes de componente (TDD): validar renderização dos metadados e placeholder de notas

### Story 3.5 — Cover Image Upload

Como usuário,
quero fazer upload de uma imagem de capa para cada livro,
para que minha biblioteca tenha uma identidade visual rica.

**Acceptance Criteria:**
1. Campo de upload presente no dialog de criação/edição e na página de detalhe
2. Aceita apenas JPEG, PNG e WebP; rejeita outros formatos com erro inline
3. Limite de 2MB — arquivo maior exibe erro antes do upload
4. Preview da imagem exibido imediatamente após seleção via `FileReader` client-side
5. `POST /api/books/[id]/cover` salva o arquivo em `data/covers/{id}.{ext}` e atualiza `cover_path` no banco via command
6. Ao deletar livro, arquivo de cover é removido do disco (`src/lib/commands/books.ts`)
7. Imagem servida via `GET /api/covers/[filename]` (implementado na Story 3.1)
8. Testes de integração (TDD): validar upload válido, rejeição de tipo inválido e rejeição de arquivo grande

---

## Epic 4 — Books: Notes Editor

**Goal:** Implementar o editor rich text TipTap na página de detalhe do livro, com toolbar completa, save manual com dirty state indicator e persistência das notas como Markdown no SQLite — completando a experiência da biblioteca pessoal.

### Story 4.1 — TipTap Integration

Como desenvolvedor,
quero TipTap integrado na página de detalhe do livro com suporte a Markdown,
para que as stories de toolbar e save tenham uma base de editor funcional.

**Acceptance Criteria:**
1. `@tiptap/react`, `@tiptap/starter-kit` e `@tiptap/extension-markdown` instalados
2. `src/components/books/book-notes-editor.tsx` criado como Client Component com `useEditor` hook
3. Editor inicializa com o conteúdo das notas existentes do livro
4. Conteúdo serializado como Markdown — não como HTML
5. Suporte a: H1, H2, H3, negrito, itálico, lista ordenada, lista não-ordenada, bloco de código, blockquote
6. Editor renderiza corretamente em tema claro e escuro (Tailwind CSS prose)
7. Placeholder "Comece a escrever suas notas..." quando vazio
8. Seção "Notas" na página de detalhe substitui o placeholder da Story 3.4
9. Testes (TDD): validar que serialização Markdown produz output correto para cada tipo de bloco

### Story 4.2 — Editor Toolbar

Como usuário,
quero uma toolbar com botões de formatação acima do editor,
para que eu possa formatar minhas notas sem precisar conhecer atalhos de teclado.

**Acceptance Criteria:**
1. `src/components/books/editor-toolbar.tsx` renderiza toolbar com botões: H1, H2, H3, Negrito, Itálico, Lista, Lista Ordenada, Bloco de Código, Citação, Undo, Redo
2. Botão ativo (formato aplicado no cursor) exibe estado visual destacado
3. Atalhos de teclado funcionam: `Ctrl+B`, `Ctrl+I`, `Ctrl+Z`, `Ctrl+Y`
4. Botões Undo/Redo desabilitados quando não há histórico
5. Toolbar desabilitada visualmente em modo read-only
6. Testes de componente (TDD): validar presença de cada botão e estado ativo

### Story 4.3 — Notes Save & Dirty State

Como usuário,
quero salvar minhas notas explicitamente com um botão e ver quando há alterações não salvas,
para que eu tenha controle total sobre o que é persistido sem risco de perda acidental.

**Acceptance Criteria:**
1. Botão "Salvar notas" presente na área do editor
2. Dirty state: quando conteúdo difere do salvo, botão exibe badge "Não salvo" e fica visualmente destacado
3. Após save bem-sucedido: botão retorna ao estado neutro e exibe "Salvo às HH:MM"
4. Save chama `PATCH /api/books/[id]` com campo `notes` serializado como Markdown
5. Durante save: botão em estado de loading e desabilitado para evitar duplo-submit
6. Em caso de erro: Toast de erro exibido; dirty state mantido
7. Ao navegar com dirty state: alerta "Você tem alterações não salvas. Deseja sair?" via `beforeunload`
8. Command `updateBookNotes(id, notes)` em `src/lib/commands/books.ts` documentado com JSDoc e decisão de design
9. Testes (TDD): unitário para `updateBookNotes`; componente validando transições de dirty state

### Story 4.4 — Read-Only / Edit Mode Toggle

Como usuário,
quero alternar entre modo de leitura e modo de edição nas notas,
para que eu possa ler minhas anotações sem risco de editar acidentalmente.

**Acceptance Criteria:**
1. Página de detalhe abre notas em **modo leitura** por padrão — editor não focável, toolbar oculta
2. Botão "Editar notas" muda para modo edição: toolbar aparece, editor fica focável, botão "Salvar notas" aparece
3. Botão "Cancelar" em modo edição: descarta alterações (com confirmação se dirty state) e retorna ao modo leitura
4. Após save bem-sucedido: retorna automaticamente ao modo leitura
5. Modo leitura renderiza Markdown como HTML formatado (TipTap com `editable: false`) — não como texto plano
6. Transição entre modos com animação suave (fade ou slide da toolbar)
7. Estado do modo é local ao componente — não persiste entre navegações
8. Testes de componente (TDD): validar transição leitura→edição→leitura e confirmação com dirty state

---

## Checklist Results Report

### Category Statuses

| Categoria | Status | Issues Críticos |
|-----------|--------|-----------------|
| 1. Problem Definition & Context | **PARTIAL** | Métricas de sucesso pessoal parcialmente definidas; sem análise competitiva formal |
| 2. MVP Scope Definition | **PARTIAL** | Critérios de extensão para novos módulos não formalizados |
| 3. User Experience Requirements | **PARTIAL** | Fluxos de usuário implícitos nas ACs mas não formalizados como diagramas |
| 4. Functional Requirements | **PASS** | — |
| 5. Non-Functional Requirements | **PASS** | — |
| 6. Epic & Story Structure | **PASS** | — |
| 7. Technical Guidance | **PASS** | — |
| 8. Cross-Functional Requirements | **PASS** | — |
| 9. Clarity & Communication | **PASS** | — |

### Decisão Final

**✅ READY FOR ARCHITECT** — PRD suficientemente completo para a fase de arquitetura. Gaps identificados (métricas formais, fluxos diagramados) não bloqueiam decisões técnicas do @architect.

---

## Out of Scope (v1)

- Multi-usuário ou autenticação
- Cloud sync ou backup remoto
- Mobile-first ou app nativo
- Integração com APIs externas (Open Library, Google Books)
- Exportação de dados (CSV, JSON)
- Outros módulos além de Livros (filmes, música, finanças — futuras epics)
- Redimensionamento automático de imagens no servidor

---

## Next Steps

### UX Expert Prompt

> @ux-design-expert: Com base neste PRD (docs/prd.md), crie o frontend spec do HomeOS definindo: sistema de design completo (paleta de cores com tokens, escala tipográfica, espaçamentos), especificação visual das telas principais (`/books`, `/books/[id]`, `/design-system`), comportamento do editor de notas em read-only vs edit mode, e animações de transição da sidebar. Use shadcn/ui como base de componentes e Inter como tipografia. O sistema deve suportar tema claro e escuro com mesma qualidade visual.

### Architect Prompt

> @architect: Com base neste PRD (docs/prd.md), crie a documentação de arquitetura do HomeOS em `docs/architecture/`. Produza os seguintes documentos: (1) `tech-stack.md` — stack completo com justificativas e versões; (2) `source-tree.md` — estrutura de diretórios detalhada com descrição de cada pasta; (3) `coding-standards.md` — convenções de código TypeScript, padrões de componentes React, padrão CQRS Leve (queries/ vs commands/), padrão de testes TDD, padrão JSDoc com decisões de design; (4) `database-schema.md` — schema Drizzle completo, índices, tipos inferidos, política de migrations. Atenção especial para a estratégia de teste do TipTap (JSDOM vs Playwright E2E) e para o padrão de singleton do DB SQLite seguro para hot reload do Next.js.
