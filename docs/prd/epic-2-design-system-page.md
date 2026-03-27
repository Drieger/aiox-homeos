# Epic 2 — Design System Page

**Goal:** Implementar a rota `/design-system` como um showcase vivo e interativo de todos os componentes shadcn/ui instalados no projeto, servindo como referência visual centralizada que evolui junto com o sistema.

## Story 2.1 — Design System Page Scaffold

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

## Story 2.2 — Tipografia e Cores

Como usuário,
quero visualizar a escala tipográfica e a paleta de cores do HomeOS,
para que eu tenha uma referência visual dos tokens de design do sistema.

**Acceptance Criteria:**
1. Seção "Tipografia" exibe todos os níveis: H1, H2, H3, H4, body, small, muted, code — com nome do token e exemplo
2. Seção "Cores" exibe todos os tokens CSS do tema shadcn/ui em modo claro e escuro simultaneamente (dois swatches lado a lado)
3. Cada swatch exibe: nome do token, valor CSS variable e preview colorido
4. Ambas as seções respondem ao toggle de tema
5. Teste de componente (TDD): validar renderização dos tokens

## Story 2.3 — Showcase: Form Elements

Como usuário,
quero ver e interagir com os componentes de formulário do Design System,
para que eu possa verificar aparência e comportamento de cada elemento.

**Acceptance Criteria:**
1. Seção exibe: `Button` (todas variantes), `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Badge` (todas variantes), `Label`
2. Cada componente exibido com nome, variantes disponíveis e exemplo interativo funcional
3. Estados desabilitados demonstrados para `Button` e `Input`
4. Todos os componentes renderizam corretamente em tema claro e escuro
5. Teste de componente (TDD): validar que cada componente está presente na seção

## Story 2.4 — Showcase: Overlays e Feedback

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
