# User Interface Design Goals

## Overall UX Vision

HomeOS deve ter uma identidade visual de **produtividade pessoal refinada** — limpa, sem distrações, com densidade de informação controlada. A inspiração é a intersecção entre o minimalismo do Linear e a clareza do Notion. Não é um dashboard corporativo; é um espaço pessoal que deve parecer confortável e familiar.

## Key Interaction Paradigms

- Sidebar persistente à esquerda como âncora de navegação (colapsável para modo ícone)
- Home page como tela de entrada do sistema — minimalista, apenas com título e identidade visual

## Core Screens and Views

1. `/` — Home page: título "HomeOS", dentro do layout com sidebar (route group `(app)`)
2. `/design-system` — Showcase de componentes UI organizados por categoria

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
