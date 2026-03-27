# Next Steps

## UX Expert Prompt

> @ux-design-expert: Com base neste PRD (docs/prd.md), crie o frontend spec do HomeOS definindo: sistema de design completo (paleta de cores com tokens, escala tipográfica, espaçamentos), especificação visual das telas principais (`/books`, `/books/[id]`, `/design-system`), comportamento do editor de notas em read-only vs edit mode, e animações de transição da sidebar. Use shadcn/ui como base de componentes e Inter como tipografia. O sistema deve suportar tema claro e escuro com mesma qualidade visual.

## Architect Prompt

> @architect: Com base neste PRD (docs/prd.md), crie a documentação de arquitetura do HomeOS em `docs/architecture/`. Produza os seguintes documentos: (1) `tech-stack.md` — stack completo com justificativas e versões; (2) `source-tree.md` — estrutura de diretórios detalhada com descrição de cada pasta; (3) `coding-standards.md` — convenções de código TypeScript, padrões de componentes React, padrão CQRS Leve (queries/ vs commands/), padrão de testes TDD, padrão JSDoc com decisões de design; (4) `database-schema.md` — schema Drizzle completo, índices, tipos inferidos, política de migrations. Atenção especial para a estratégia de teste do TipTap (JSDOM vs Playwright E2E) e para o padrão de singleton do DB SQLite seguro para hot reload do Next.js.
