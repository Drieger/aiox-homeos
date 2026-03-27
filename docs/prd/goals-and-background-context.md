# Goals and Background Context

## Goals

- Ter um sistema web local chamado **HomeOS** que centraliza o gerenciamento da vida pessoal
- Navegar facilmente entre seções via sidebar colapsável com menus e submenus
- Visualizar e explorar o design system do produto em uma página dedicada
- Gerenciar uma biblioteca pessoal de livros com CRUD completo (título, autor, anos, status, capa)
- Registrar notas formatadas (Notion-like) por livro, persistidas localmente em SQLite

## Background Context

HomeOS surge da necessidade de ter um hub pessoal de produtividade que rode **completamente offline**, sem dependência de serviços externos ou assinaturas. A maioria das ferramentas existentes (Notion, Obsidian, Capacities) são cloud-first ou possuem funcionalidades dispersas que não se integram naturalmente ao fluxo de vida pessoal de um único usuário.

HomeOS é desenhado para ser uma plataforma extensível: começa com a gestão de livros, mas a arquitetura de navegação por sidebar e a base de dados local permitem adicionar novos módulos (filmes, finanças, rotinas) sem reescrever a fundação. O sistema roda como uma aplicação Next.js local — iniciada com `npm run dev` ou `npm start` — e armazena todos os dados em SQLite no próprio filesystem do usuário.

## Success Criteria (Pessoais)

<!-- TODO: @pm — refinar com o usuário -->
- Conseguir catalogar um livro completo (título, autor, capa, sinopse) em menos de 2 minutos
- Acessar as notas de qualquer livro em no máximo 3 cliques a partir da página inicial
- Design System page funciona como referência visual suficiente para desenvolver novos módulos sem abrir documentação externa
- Sistema inicia e carrega em menos de 1 segundo em localhost

---
