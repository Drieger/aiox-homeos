# Next Steps

## UX Expert Prompt

> @ux-design-expert: Com base neste PRD v1.1 (docs/prd/), crie o frontend spec do HomeOS definindo: sistema de design completo (paleta de cores com tokens, escala tipográfica, espaçamentos), especificação visual das telas principais (`/` Home page e `/design-system`), comportamento da sidebar em modo expandido e colapsado, e animações de transição. Use shadcn/ui como base de componentes e Geist Sans como tipografia (atual no projeto). O sistema deve suportar tema claro e escuro com mesma qualidade visual. **Escopo v1: apenas Home page e Design System page.**

## Architect Prompt

> @architect: Com base neste PRD v1.1 (docs/prd/), crie a documentação de arquitetura do HomeOS em `docs/architecture/`. Produza os seguintes documentos: (1) `tech-stack.md` — stack completo com justificativas e versões (sem TipTap nem ulidx no v1; Drizzle/SQLite mantido como infraestrutura extensível para módulos futuros); (2) `source-tree.md` — estrutura de diretórios atualizada para o escopo v1; (3) `coding-standards.md` — convenções de código TypeScript, padrões de componentes React, padrão CQRS Leve (queries/ vs commands/), padrão de testes TDD, padrão JSDoc com decisões de design; (4) `database-schema.md` — schema vazio no v1 com estratégia de migration para quando novos módulos forem adicionados. Atenção especial para o padrão de singleton do DB SQLite seguro para hot reload do Next.js.
