# Requirements

## Functional Requirements

- **FR1:** O sistema deve ter uma sidebar de navegação colapsável com menus e submenus
- **FR2:** O sistema deve suportar tema claro e escuro com persistência entre sessões
- **FR3:** O sistema deve ter uma rota `/design-system` com showcase interativo de todos os componentes UI instalados (tipografia, cores, form elements, overlays)
- **FR4:** O sistema deve ter uma rota `/` como Home page real, com entrada dedicada na sidebar, exibindo o título do sistema — implementada dentro do route group `(app)` para herdar o layout com sidebar

> **v1.1 — FR4 a FR9 originais removidos:** Os requisitos do módulo Books (CRUD de livros, filtros, página de detalhe, editor TipTap, upload de capa) foram removidos do escopo v1. Ver `out-of-scope-v1.md`.

## Non-Functional Requirements

- **NFR1:** Page load abaixo de 1 segundo em localhost
- **NFR2:** TypeScript strict mode habilitado em todo o projeto
- **NFR3:** Zod validation em todos os inputs das API routes
- **NFR4:** SQLite em WAL mode para durabilidade de dados
- **NFR5:** Todos os nomes de colunas do banco de dados em inglês
- **NFR6:** Todas as migrations do banco commitadas em `src/lib/db/migrations/` para rastreabilidade completa do histórico do schema; arquivo `data/homeos.db` gitignored
- **NFR7:** TDD obrigatório — testes escritos ANTES da implementação em todas as stories de código; stack: Vitest + Testing Library (unit/integration/component) + Playwright (E2E)
- **NFR8:** Todas as funções não-triviais documentadas com JSDoc incluindo as decisões de design tomadas (propósito, parâmetros, retorno, raciocínio da escolha)

---
