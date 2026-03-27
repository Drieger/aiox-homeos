# Epic 3 — Books: Core CRUD

**Goal:** Implementar o módulo de livros completo — listagem com filtros e busca, criação e edição via dialog, página de detalhe com sinopse e upload de capa — entregando uma biblioteca pessoal funcional e testada end-to-end com a arquitetura CQRS Leve.

## Story 3.1 — Books API Routes

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

## Story 3.2 — Books List Page

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

## Story 3.3 — Add/Edit Book Dialog

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

## Story 3.4 — Book Detail Page

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

## Story 3.5 — Cover Image Upload

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
