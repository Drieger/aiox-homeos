# Goals and Background Context

## Goals

- Ter um sistema web local chamado **HomeOS** que centraliza o gerenciamento da vida pessoal
- Navegar facilmente entre seções via sidebar colapsável com menus e submenus
- Ter uma página inicial (Home) como ponto de entrada do sistema
- Visualizar e explorar o design system do produto em uma página dedicada

## Background Context

HomeOS surge da necessidade de ter um hub pessoal de produtividade que rode **completamente offline**, sem dependência de serviços externos ou assinaturas. A maioria das ferramentas existentes (Notion, Obsidian, Capacities) são cloud-first ou possuem funcionalidades dispersas que não se integram naturalmente ao fluxo de vida pessoal de um único usuário.

HomeOS é desenhado para ser uma plataforma extensível: começa com a fundação de navegação e o design system, mas a arquitetura de sidebar e a base de dados local permitem adicionar novos módulos (livros, filmes, finanças, rotinas) sem reescrever a fundação. O sistema roda como uma aplicação Next.js local — iniciada com `npm run dev` ou `npm start` — e armazena todos os dados em SQLite no próprio filesystem do usuário.

## Success Criteria (Pessoais)

- Home page carrega e exibe o título "HomeOS" como ponto de entrada do sistema
- Design System page funciona como referência visual suficiente para desenvolver novos módulos sem abrir documentação externa
- Sistema inicia e carrega em menos de 1 segundo em localhost
- Adicionar um novo módulo futuro requer apenas criar nova rota em `(app)/` e adicionar item ao `navItems` da sidebar

---
