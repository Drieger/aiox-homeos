# KB Feature Brief — Knowledge Base Module

**Produzido por:** @analyst (Atlas)
**Data:** 2026-03-28
**Input para:** @pm `*create-prd Epic KB` → `docs/prd/epic-3-knowledge-base.md`

---

## Resumo Executivo

Análise comparativa de plataformas de gestão de conhecimento pessoal (Notion, Obsidian, Capacities, Evernote) para definir o feature set do módulo Knowledge Base do HomeOS.

---

## Análise Comparativa

### O que cada plataforma faz melhor

| Plataforma | Ponto Forte Principal | Relevante para HomeOS KB |
|-----------|----------------------|--------------------------|
| **Notion** | Hierarquia de páginas + banco de dados inline + `/` commands | Hierarquia de páginas, WYSIWYG com Markdown |
| **Obsidian** | `[[wiki-links]]` + grafo de conexões + 100% local | Linking entre docs, local-first, tags flat |
| **Capacities** | Objetos tipados + daily notes + backlinks automáticos | Backlinks, tipos de documento |
| **Evernote** | Notebooks + tags + busca full-text | Organização híbrida caderno+tags, search |

### Padrões comuns (todos têm)

1. Rich text com formatação (negrito, itálico, heading, lista, código)
2. Organização hierárquica (notebooks/cadernos/pastas)
3. Tags flat
4. Busca full-text
5. Timestamps de criação/modificação

---

## Decisões do Usuário (confirmadas)

| Aspecto | Decisão |
|---------|---------|
| Hierarquia de pastas | **1 nível plano** — Cadernos simples, documentos dentro (estilo Evernote) |
| Modo de edição | **Markdown raw no editor + visualização renderizada** — sem menu contextual WYSIWYG |
| Imagens | **Links externos apenas** — sem upload local; `![alt](url)` suportado no MD |
| Export | **Sim, exportar .md** — botão "Download .md" no editor |

---

## Feature Set Recomendado (MVP)

### Core Documents
- Criar, editar, excluir documentos
- Editor Markdown raw (`@uiw/react-md-editor`)
- Toggle Edit / Preview (renderizado com `react-markdown` + `remark-gfm`)
- Título editável inline
- Auto-save com debounce de 1.000ms

### Organização
- **Cadernos**: hierarquia 1 nível (caderno > documentos)
- **Tags**: múltiplas tags flat por documento
- Sidebar KB: lista por caderno + lista de tags
- Caderno padrão "Geral" sempre presente

### Linking
- `[[nome]]` trigger para inserir link para outro documento
- Backlinks: painel mostrando "Quem linka este documento"
- Links rendererizados como navegáveis no preview

### Busca
- Full-text no título + conteúdo (SQLite FTS5)
- Atalho `Ctrl+K` para overlay de busca
- Filtro por tag e caderno

### Export
- Botão "Exportar .md" — download do conteúdo Markdown puro

---

## Abordagem Técnica Recomendada

### Editor
- **`@uiw/react-md-editor`**: editor Markdown raw com syntax highlight
- **`react-markdown` + `remark-gfm`**: renderização do preview com GFM
- **`rehype-highlight`**: syntax highlight em code blocks no preview
- **`@tailwindcss/typography`**: classes `prose` para tipografia elegante no preview

### Wiki-Links
- Plugin `remark` custom: transforma `[[nome]]` em `<Link href="/kb/id">nome</Link>`
- Ao salvar: parser extrai `[[links]]` e popula `document_links` table

### Storage
- Drizzle ORM + SQLite
- Tabelas: `notebooks`, `documents`, `tags`, `document_tags`, `document_links`
- FTS5 virtual table para busca full-text
- ULIDs via `ulidx` (padrão do projeto)

---

## Fora do MVP (v2+)

- Grafo visual de conexões (Obsidian-style)
- Sub-cadernos (hierarquia profunda)
- Templates de documento
- Daily Notes
- Versionamento / histórico de edições
- Exportação para PDF
- Upload de imagens locais

---

## Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-03-28 | 1.0 | Feature brief produzido após análise comparativa | Atlas (@analyst) |
