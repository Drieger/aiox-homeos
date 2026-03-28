# Epic 3 — Knowledge Base: Gestão de Conhecimento Pessoal

**Goal:** Implementar o módulo de Knowledge Base do HomeOS — um sistema de notas pessoais com editor Markdown, organização por cadernos e tags, links entre documentos (`[[wiki-links]]`) e busca full-text — 100% offline, sem dependência de serviços externos.

**Status:** Draft

**Research:** Feature brief produzido pelo @analyst (`docs/research/kb-feature-brief.md`)
**Plataformas de referência:** Notion, Obsidian, Capacities, Evernote

---

## Story 3.1 — KB Foundation: Schema & Migrations

**As a** usuário do HomeOS,
**I want** que o módulo Knowledge Base tenha sua estrutura de dados inicializada,
**so that** eu possa começar a criar documentos com persistência local.

### Acceptance Criteria

1. Schema Drizzle criado em `src/db/schema/kb.ts` com tabelas: `notebooks`, `documents`, `tags`, `document_tags`, `document_links`
2. Todos os IDs usam ULID (padrão do projeto via `ulidx`)
3. Migration aplicada com sucesso via `drizzle-kit` — banco atualizado sem erros
4. Virtual table FTS5 criada via SQL raw para busca full-text em `documents.title` e `documents.content`
5. Rota `/kb` existe e retorna página placeholder (scaffold) sem erros 404
6. Item "Knowledge Base" adicionado à navegação da sidebar (`app-sidebar.tsx`) com ícone `BookOpen`

---

## Story 3.2 — KB Navigation & Document List

**As a** usuário do HomeOS,
**I want** navegar pelo módulo KB, ver meus documentos e criar/excluir documentos,
**so that** eu possa gerenciar meu acervo de conhecimento.

### Acceptance Criteria

1. Layout 3 colunas implementado em `/kb`: sidebar KB | lista de documentos | área de conteúdo
2. Sidebar KB exibe lista de todos os cadernos com contagem de documentos
3. Lista de documentos exibe: título, caderno, data de modificação — ordenada por `updatedAt` desc
4. Botão "Novo Documento" cria documento com título padrão ("Sem título") e redireciona para `/kb/[id]`
5. Botão de exclusão (com confirmação via dialog) remove o documento e redireciona para `/kb`
6. Caderno padrão "Geral" existe sempre (criado na migration seed ou na primeira execução)

---

## Story 3.3 — Document Editor: Markdown + Preview

**As a** usuário do HomeOS,
**I want** editar documentos em Markdown com visualização renderizada,
**so that** eu possa escrever conteúdo formatado de forma elegante.

### Acceptance Criteria

1. Editor Markdown raw (`@uiw/react-md-editor`) integrado na rota `/kb/[id]`
2. Toggle "Editar / Preview" alterna entre editor raw e visualização renderizada (`react-markdown` + `remark-gfm`)
3. Visualização renderizada aplica classes `prose` do `@tailwindcss/typography` para tipografia elegante
4. Título do documento é editável inline (campo de texto na parte superior)
5. Auto-save salva título + conteúdo automaticamente com debounce de 1.000ms
6. Indicador visual sutil de "salvando..." / "salvo" durante o auto-save
7. Syntax highlight em blocos de código no preview (`rehype-highlight`)
8. Editor e preview respondem ao tema dark/light via next-themes

---

## Story 3.4 — Organization: Cadernos & Tags

**As a** usuário do HomeOS,
**I want** organizar meus documentos em cadernos e tags,
**so that** eu possa encontrar conteúdo relacionado facilmente.

### Acceptance Criteria

1. Seletor de caderno no editor permite mover o documento para qualquer caderno existente
2. Botão "Novo Caderno" na sidebar cria um caderno com nome editável
3. Campo de tags no editor permite adicionar tags existentes (autocomplete) ou criar novas
4. Tags são exibidas como chips removíveis no editor
5. Clicar em um caderno na sidebar filtra a lista de documentos para mostrar apenas documentos daquele caderno
6. Clicar em uma tag na sidebar filtra a lista para documentos com aquela tag
7. Opção "Todos os documentos" na sidebar limpa filtros e mostra todos

---

## Story 3.5 — Wiki-Links & Backlinks

**As a** usuário do HomeOS,
**I want** criar links entre documentos com `[[nome]]` e ver quais documentos me linkam,
**so that** eu possa construir uma rede de conhecimento interconectada.

### Acceptance Criteria

1. No editor, digitar `[[` abre um popover de busca de documentos existentes
2. Selecionar um documento no popover insere `[[Título do Documento]]` no texto
3. No preview renderizado, `[[Título do Documento]]` aparece como link clicável
4. Clicar no link no preview navega para o documento destino (`/kb/[id]`)
5. Ao salvar, o sistema extrai todos os `[[links]]` do conteúdo e popula a tabela `document_links`
6. Painel "Backlinks" na lateral do editor lista todos os documentos que linkam o documento atual
7. Links para documentos inexistentes são exibidos em estilo diferente (cor muted) no preview

---

## Story 3.6 — Full-Text Search

**As a** usuário do HomeOS,
**I want** buscar documentos por qualquer texto no título ou conteúdo,
**so that** eu possa encontrar informações rapidamente sem saber onde estão.

### Acceptance Criteria

1. Atalho `Ctrl+K` (Windows) abre overlay de busca global
2. Campo de busca consulta FTS5 em tempo real (debounce 300ms)
3. Resultados exibem: título do documento, caderno, trecho do conteúdo com o termo destacado
4. Clicar em um resultado navega para o documento destino
5. Busca retorna resultados em menos de 200ms para base com até 10.000 documentos
6. Botão de busca visível na UI como alternativa ao atalho de teclado
7. Mensagem "Nenhum resultado encontrado" quando a busca não retorna documentos

---

## Story 3.7 — Export & Polish

**As a** usuário do HomeOS,
**I want** exportar documentos e ter uma experiência refinada de uso,
**so that** o módulo KB seja completo e prazeroso de usar no dia a dia.

### Acceptance Criteria

1. Botão "Exportar .md" na toolbar do editor baixa o conteúdo do documento como arquivo `[titulo].md`
2. O arquivo exportado contém o Markdown puro (sem metadados adicionais)
3. Layout responsivo: em telas < 768px, sidebar e lista de documentos colapsam (padrão do HomeOS)
4. Estado da sidebar KB (expandida/colapsada) persiste no Zustand store
5. Navegação com teclado funciona no overlay de busca (setas ↑↓, Enter para selecionar, Esc para fechar)
6. Todos os textos da interface estão em português

---

## Novas Dependências (a instalar em Story 3.1)

| Biblioteca | Versão recomendada | Propósito |
|-----------|-------------------|-----------|
| `@uiw/react-md-editor` | latest | Editor Markdown raw com syntax highlight |
| `react-markdown` | latest | Renderização MD no preview |
| `remark-gfm` | latest | GitHub Flavored Markdown (tabelas, checkboxes) |
| `rehype-highlight` | latest | Syntax highlight no preview |
| `@tailwindcss/typography` | latest | Classes `prose` para leitura elegante |

## Schema de Banco (referência para @data-engineer)

```sql
CREATE TABLE notebooks (
  id TEXT PRIMARY KEY,           -- ULID
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE documents (
  id TEXT PRIMARY KEY,           -- ULID
  notebook_id TEXT NOT NULL REFERENCES notebooks(id),
  title TEXT NOT NULL DEFAULT 'Sem título',
  content TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE tags (
  id TEXT PRIMARY KEY,           -- ULID
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE document_tags (
  document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, tag_id)
);

CREATE TABLE document_links (
  source_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  target_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  PRIMARY KEY (source_id, target_id)
);

-- FTS5 para busca full-text (external content table)
CREATE VIRTUAL TABLE documents_fts USING fts5(
  title,
  content,
  content=documents,
  content_rowid=rowid
);

-- Triggers para manter FTS5 sincronizado com documents
CREATE TRIGGER documents_ai AFTER INSERT ON documents BEGIN
  INSERT INTO documents_fts(rowid, title, content)
  VALUES (new.rowid, new.title, new.content);
END;

CREATE TRIGGER documents_ad AFTER DELETE ON documents BEGIN
  INSERT INTO documents_fts(documents_fts, rowid, title, content)
  VALUES ('delete', old.rowid, old.title, old.content);
END;

CREATE TRIGGER documents_au AFTER UPDATE ON documents BEGIN
  INSERT INTO documents_fts(documents_fts, rowid, title, content)
  VALUES ('delete', old.rowid, old.title, old.content);
  INSERT INTO documents_fts(rowid, title, content)
  VALUES (new.rowid, new.title, new.content);
END;

-- Índice para resolução de wiki-links por título
CREATE INDEX idx_documents_title ON documents(title);
```

## Out of Scope (MVP → v2+)

- Hierarquia profunda de pastas (sub-cadernos)
- Grafo visual de conexões (Obsidian-style)
- Templates de documento
- Daily Notes
- Versionamento / histórico de edições
- Exportação para PDF
- Upload de imagens (suportado apenas via link externo `![alt](url)`)

## Notas Arquiteturais (validadas por @architect)

- **Editor:** `@uiw/react-md-editor` (CodeMirror internamente) — testes de comportamento do editor via Playwright, não Vitest/JSDOM (ADR-5/6)
- **Typography:** `@tailwindcss/typography` integrado via `@plugin "@tailwindcss/typography"` em `globals.css` (sintaxe Tailwind v4 — não `tailwind.config.js`)
- **FTS5:** Virtual table com external content + 3 triggers (INSERT/UPDATE/DELETE) para sincronização automática. Sem triggers = busca retorna dados desatualizados (ADR-7)
- **Wiki-links:** Index em `documents.title` necessário para lookup performático no popover de `[[links]]`
- **Auto-save:** Implementar via Server Actions (`src/lib/kb/actions.ts` com `"use server"`) + debounce no Client Component

## Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-03-28 | 1.0 | Epic criada com 7 stories | Morgan (@pm) |
| 2026-03-28 | 1.1 | Triggers FTS5 + index title adicionados ao schema; notas arquiteturais | Aria (@architect) |
