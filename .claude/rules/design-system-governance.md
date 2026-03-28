---
paths:
  - homeos/src/components/**
  - homeos/src/app/**
  - homeos/src/styles/**
  - homeos/src/globals.css
  - homeos/tailwind.config.*
  - docs/stories/**
---

# Design System Governance

## Propósito

Garantir que todas as funcionalidades implementadas no HomeOS sigam o design system estabelecido (shadcn/ui + Tailwind v4 + next-themes) e que novos componentes ou tokens sejam aprovados por `@ux-design-expert` antes da implementação.

---

## Tabela de Decisão — Quando Acionar @ux-design-expert

| Situação | Ação Requerida |
|----------|---------------|
| Componente shadcn/ui já instalado (ver `homeos/src/components/ui/`) | Dev implementa direto — sem aprovação necessária |
| Variação de componente existente (ex: novo variant de Button) | `@ux-design-expert` RECOMENDADO |
| Novo componente customizado não-shadcn | `@ux-design-expert` OBRIGATÓRIO |
| Novo token de cor ou tipografia | `@ux-design-expert` OBRIGATÓRIO |
| Biblioteca de terceiro com elementos visuais (ex: chart, calendar, map) | `@ux-design-expert` OBRIGATÓRIO |
| Alteração em layout global (sidebar, header, grid system) | `@ux-design-expert` OBRIGATÓRIO |

---

## Fluxo de Aprovação para Novos Componentes

```
Dev identifica necessidade de novo componente
          ↓
Já existe no shadcn/ui instalado?
  ├─ SIM → Implementa diretamente
  └─ NÃO → Aciona @ux-design-expert *design-component {nome}
                 ↓
            UX cria spec: variantes, props, estados, tokens
                 ↓
            UX aprova e documenta na story ou issue
                 ↓
            Dev implementa seguindo o spec aprovado
                 ↓
            Componente deve ser adicionado à rota /design-system
            (nova story ou subtask da story corrente)
```

---

## Obrigações por Agente

### @sm (River) — Story Creation

Ao criar uma story com impacto visual (componentes, layout, estilos), **deve incluir** a seção `design_system_impact` preenchida:

```markdown
## Design System Impact
- uses_existing_components_only: true|false
- new_components: [lista ou vazio]
- new_tokens: [lista ou vazio]
- ux_approval_required: true|false
- ux_approval_evidence: "link ou N/A"
```

Se `new_components` ou `new_tokens` não estiver vazio → `ux_approval_required: true` **obrigatoriamente**.

### @dev (Dex) — Implementation

- Verificar a seção `design_system_impact` antes de iniciar implementação
- Se `ux_approval_required: true` e `ux_approval_evidence` estiver vazio → **bloqueado**: acionar `@ux-design-expert` antes de prosseguir
- Usar apenas os tokens CSS definidos em `globals.css` (nunca hardcoded colors)
- Sempre usar `text-foreground` e `bg-background` em containers com tema — nunca depender de defaults do browser

### @qa (Quinn) — QA Gate

Durante o QA Gate, verificar a seção `design_system_impact` da story:

1. Se `ux_approval_required: true`:
   - `ux_approval_evidence` deve estar preenchido → se vazio: **FAIL** com issue `REQ-DS-001`
   - Novo componente deve estar documentado na rota `/design-system` OU uma story de documentação deve estar criada → se ausente: **CONCERNS** com issue `REQ-DS-002`

2. Se `uses_existing_components_only: false` mas `ux_approval_required: false`:
   - Revisar se a decisão é justificável (ex: variação menor)
   - Se suspeito: registrar como **CONCERNS** `REQ-DS-003`

**Issue IDs de Design System:**

| ID | Descrição | Severidade |
|----|-----------|------------|
| `REQ-DS-001` | `ux_approval_evidence` ausente quando `ux_approval_required: true` | HIGH → FAIL |
| `REQ-DS-002` | Novo componente não documentado na rota /design-system | MEDIUM → CONCERNS |
| `REQ-DS-003` | Componente não-shadcn sem aprovação declarada | MEDIUM → CONCERNS |

### @ux-design-expert (Uma) — Design Authority

- Ao ser acionado, criar spec do componente: variantes, props, estados, paleta de cores, responsividade
- Registrar aprovação na story corrente (seção `ux_approval_evidence`) ou via link de issue
- Garantir que o componente aprovado seja adicionado à rota `/design-system` após implementação

---

## Componentes Shadcn/UI Atualmente Instalados

Estes componentes **não requerem aprovação** de UX:

`alert`, `badge`, `button`, `checkbox`, `dialog`, `dropdown-menu`, `input`, `label`, `popover`, `progress`, `scroll-area`, `select`, `separator`, `sheet`, `skeleton`, `switch`, `sonner` (toast)

Referência: `homeos/src/components/ui/`

---

## Quando Esta Regra Se Aplica

Esta regra é carregada automaticamente pelo Claude Code para todas as stories e implementações que envolvam:
- Arquivos em `homeos/src/components/`
- Arquivos em `homeos/src/app/`
- Arquivos de estilos (`globals.css`, `tailwind.config.*`)
- Stories com tipo "Frontend" ou "Design/UI Components"
