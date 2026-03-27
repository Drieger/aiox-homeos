# Epic 4 — Books: Notes Editor

**Goal:** Implementar o editor rich text TipTap na página de detalhe do livro, com toolbar completa, save manual com dirty state indicator e persistência das notas como Markdown no SQLite — completando a experiência da biblioteca pessoal.

## Story 4.1 — TipTap Integration

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

## Story 4.2 — Editor Toolbar

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

## Story 4.3 — Notes Save & Dirty State

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

## Story 4.4 — Read-Only / Edit Mode Toggle

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
