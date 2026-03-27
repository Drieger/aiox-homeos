# User Interface Design Goals

## Overall UX Vision

HomeOS deve ter uma identidade visual de **produtividade pessoal refinada** — limpa, sem distrações, com densidade de informação controlada. A inspiração é a intersecção entre o minimalismo do Linear e a clareza do Notion. Não é um dashboard corporativo; é um espaço pessoal que deve parecer confortável e familiar.

## Key Interaction Paradigms

- Sidebar persistente à esquerda como âncora de navegação (colapsável para modo ícone)
- Cards para visualização de livros em grid (modo padrão)
- Dialogs/modais para criação e edição de itens (sem páginas separadas de formulário)
- Página de detalhe dedicada para leitura/edição de conteúdo longo (sinopse + notas)
- Editor de notas inline na página de detalhe com toggle read-only / edit mode

## Core Screens and Views

1. `/books` — Grid de cards de livros com filtros de status e campo de busca
2. `/books/[id]` — Detalhe do livro: capa, metadados, sinopse editável inline, editor de notas
3. `/design-system` — Showcase de componentes UI organizados por categoria
4. Dialog de criação/edição de livro (overlay sobre qualquer rota)

## Accessibility

WCAG AA

## Branding

- **Nome:** HomeOS
- **Paleta:** Neutros (slate) como base, accent color único a definir com @ux-design-expert
- **Tipografia:** Inter (sans-serif, padrão shadcn/ui)
- **Tema escuro** como primeira classe — não afterthought
- **Ícones:** Lucide React (funcional, sem decoração excessiva)

## Target Device and Platforms

Web — Desktop primary (1280px+), layout funcional em telas menores (mobile via Sheet na sidebar)

---
