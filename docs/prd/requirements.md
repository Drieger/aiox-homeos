# Requirements

## Functional Requirements

- **FR1:** O sistema deve ter uma sidebar de navegação colapsável com menus e submenus
- **FR2:** O sistema deve suportar tema claro e escuro com persistência entre sessões
- **FR3:** O sistema deve ter uma rota `/design-system` com showcase interativo de todos os componentes UI instalados (tipografia, cores, form elements, overlays)
- **FR4:** O usuário deve poder criar, visualizar, editar e deletar livros com os campos: título (obrigatório), autor (obrigatório), ano de lançamento (opcional), ano de leitura (opcional), status (não lido / lendo / lido) e imagem de capa (opcional)
- **FR5:** O usuário deve poder filtrar a lista de livros por status e buscar por título ou autor
- **FR6:** Cada livro deve ter uma página de detalhe contendo: capa, metadados, seção de sinopse (texto livre editável inline) e seção de notas
- **FR7:** A seção de notas de cada livro deve ter um editor rich text estilo Notion com suporte a: H1, H2, H3, negrito, itálico, listas (ordenadas e não-ordenadas), bloco de código, citação (blockquote)
- **FR8:** As notas devem ser salvas pelo usuário via botão "Salvar" explícito; o estado "não salvo" deve ser indicado visualmente (ex: badge "Não salvo" no botão)
- **FR9:** O usuário deve poder fazer upload de uma imagem de capa para cada livro (JPEG/PNG/WebP, limite 2MB)

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
