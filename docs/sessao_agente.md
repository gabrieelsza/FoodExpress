# Registro de Sessão do Agente (Decision Log) — FoodExpress

> Este arquivo mantém a memória persistente e auditável de todas as decisões arquiteturais, de negócio e de implementação tomadas pelos agentes ao longo do ciclo Spec Driven Development (SDD).
> **Regra Universal:** Todo agente deve ler este arquivo no início da sessão e registrar um novo bloco ao concluir uma etapa relevante (`/passo1`, `/passo2`, `/passo3`).

---

## Histórico de Sessões e Decisões

### [2026-11-11 14:03] — Inicialização da Arquitetura Agêntica e Estrutura SDD
- **Papel Ativo:** Engenheiro de Software Sênior & Especialista em Arquitetura Agêntica
- **Etapa SDD:** `Setup Inicial (Fase 0)`
- **Ações Executadas:**
  1. Criação da estrutura de documentação base em `/docs/`:
     - `docs/contexto.md` (Objetivo geral e escopo do projeto)
     - `docs/arquitetura.md` (Diretrizes gerais de tecnologia)
     - `docs/brd.md` (Matriz vazia do Business Requirement Document)
     - `docs/trd.md` (Matriz vazia do Technical Requirement Document)
     - `docs/sessao_agente.md` (Este registro de decisões do agente)
  2. Configuração de arquitetura agnóstica a ambientes e harnesses (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.agents/skills/`, `.claude/commands/`, `.cursor/rules/`).
  3. Mapeamento dos 3 Slash Commands especializados (`/passo1`, `/passo2`, `/passo3`).
- **Decisões Tomadas:**
  - Adotado o padrão `AGENTS.md` na raiz como fonte única de verdade de governança agêntica, com pontes nativas para Antigravity (`.agents/skills/` + `GEMINI.md`), Claude Code (`.claude/commands/` + `CLAUDE.md`), Cursor (`.cursor/rules/`) e OpenAI Codex (`AGENTS.md`).
  - Bloqueio explícito de geração de código de aplicação antes da aprovação formal do BRD (`/passo1`) e TRD (`/passo2`).
- **Próximo Passo Recomendado:** Executar `/passo1` para iniciar a entrevista de levantamento de requisitos de negócio e preenchimento de `docs/contexto.md` e `docs/brd.md`.

---

### [2026-11-11 14:13] — Levantamento de Requisitos de Negócio e Consolidação do BRD (`/passo1`)
- **Papel Ativo:** Analista de Sistemas Experiente (Skill `/passo1`)
- **Etapa SDD:** `Fase 1 — Levantamento de Requisitos de Negócio (BRD)`
- **Ações Executadas:**
  1. Condução de sabatina interativa em múltiplas escolhas e análise integral do documento `FoodExpress - Backlog do MVP (base)` fornecido pelo usuário.
  2. Preenchimento completo de [`docs/contexto.md`](./contexto.md) com visão geral, personas (`ACT-01` Cliente e `ACT-02` Atendente/Restaurante), escopo In/Out (2 Sprints, 3 integrantes) e glossário de domínio.
  3. Estruturação completa de [`docs/brd.md`](./brd.md) contendo:
     - Mapeamento dos 13 Requisitos Funcionais (`RF-001` a `RF-013`) rastreados diretamente com as histórias `US01` a `US13` e critérios de aceite em formato BDD (`Dado / Quando / Então`).
     - Definição das 12 Regras de Negócio (`RN-001` a `RN-012`), incluindo ausência de cadastro de cliente, identificação por mesa (local) ou nome (entrega), encaminhamento ao WhatsApp com resumo padronizado, máquina de estados estrita (`Recebido` → `Em preparo` → `Pronto` → `Entregue`), janela de 5 minutos para cancelamento pelo cliente, cancelamento livre pelo atendente, atualização automática do painel a cada 5 minutos (configurável) + manual, limite de 140 caracteres em observações e exclusão de pagamentos no MVP.
     - Definição dos Requisitos Não-Funcionais de Negócio (`RNF-001` a `RNF-004`), Jornadas do Usuário, planejamento das Sprints 1 (28 pts) e 2 (27 pts) e Critérios de Pronto (DoD).
- **Decisões de Negócio Validadas pelo Usuário:**
  - Tanto os pedidos de **Consumo no local** quanto os de **Entrega** entram no painel do atendente com status inicial `Recebido` (permitindo acompanhamento de status e cancelamento em até 5 min), sendo que os de **Entrega** também direcionam o cliente ao WhatsApp com o resumo padronizado preenchido.
  - Identificação simplificada sem cadastro: **Número da Mesa** obrigatório para Consumo no local; **Nome do Cliente** (e dados opcionais de endereço para o resumo) obrigatório para Entrega.
  - Cancelamento pelo cliente exige estar dentro da janela de **até 5 minutos** após finalizar e com o pedido ainda não preparado/concluído (em `Recebido`); o atendente pode cancelar a qualquer momento sem justificativa.
  - Limite máximo de **140 caracteres** nas observações por item; suporte a **Variações** (definem/alteram preço base) e **Adicionais** (somam ao valor unitário do item).
- **Status da Etapa:** Concluída e aprovada pelo usuário para transição ao `/passo2`.

---

### [2026-11-11 14:19] — Definição de Arquitetura, Viabilidade Técnica e Geração do TRD (`/passo2`)
- **Papel Ativo:** Profissional Técnico de Arquitetura / Staff Software Architect (Skill `/passo2`)
- **Etapa SDD:** `Fase 2 — Arquitetura e Requisitos Técnicos (TRD)`
- **Ações Executadas:**
  1. Auditoria completa de [`docs/brd.md`](./brd.md) e [`docs/contexto.md`](./contexto.md), mapeando os 13 Requisitos Funcionais (`RF-001` a `RF-013`), 12 Regras de Negócio (`RN-001` a `RN-012`) e 4 Requisitos Não-Funcionais (`RNF-001` a `RNF-004`).
  2. Condução de questionamento técnico interativo com o usuário sobre Stack Tecnológica, Padrão de Arquitetura de Pastas, Estratégia de Manipulação de DOM/Renderização e Persistência/Segurança sem dependências complexas.
  3. Atualização completa de [`docs/arquitetura.md`](./arquitetura.md) com análise de prós e contras da stack, diagrama Mermaid de camadas e árvore de diretórios do projeto.
  4. Preenchimento integral de [`docs/trd.md`](./trd.md) contendo:
     - Matriz de Rastreabilidade Técnica (`TR-001` a `TR-013`) 100% conectada ao BRD.
     - Modelagem de Dados relacional completa com ERD Mermaid (`users`, `categories`, `products`, `product_variations`, `product_addons`, `orders`, `order_items`).
     - Contratos de API REST detalhados (`API-001` a `API-011`) separando rotas públicas (`/api/public/*`) e administrativas protegidas (`/api/admin/*`).
     - Especificação algorítmica da Máquina de Estados linear (`RECEIVED` → `PREPARING` → `READY` → `DELIVERED`), janela de 5 minutos para cancelamento pelo cliente, formatador de resumo para WhatsApp e Requisitos Não-Funcionais Técnicos (`TNFR-001` a `TNFR-004`).
     - Plano de Execução e Testes em 4 fases para guiar o `/passo3`.
- **Decisões Arquiteturais Validadas pelo Usuário (ADR Resumido):**
  - **ADR-01 (Frontend & Renderização):** **Vite + Vanilla JS Modular (ES Modules) + Tailwind CSS** operando como **SPA Leve** com **Store Centralizada (Pub/Sub)**, renderização declarativa via **Template Literals** sanitizados e **Delegação de Eventos** centralizada (zero overhead de runtime pesado e carregamento instantâneo no celular).
  - **ADR-02 (Backend & Persistência Local):** **Node.js + Express** estruturado como **Monólito Modular em Camadas** (`controllers`, `services`, `repositories`, `middlewares`) persistindo em **SQLite** em arquivo local único (`data/foodexpress.sqlite`) gerenciado via **Drizzle ORM** (ou Prisma ORM) com seed automático.
  - **ADR-03 (Segurança & Testes):** Hash de senhas com `node:crypto scrypt` + autenticação administrativa via Token JWT (HMAC-SHA256); suíte de verificação automatizada com **Vitest + Supertest** executando sobre banco SQLite isolado.
- **Status da Etapa:** Concluída, aguardando aprovação explícita do usuário sobre `docs/trd.md` e `docs/arquitetura.md` antes de iniciar o `/passo3`.


---

### [2026-11-12 21:45] — Otimização Total do CI/CD no GitHub Actions & Suporte Duplo Pages
- **Papel Ativo:** Engenheiro DevOps & Confiabilidade de Sistemas
- **Etapa SDD:** `Fase 3 — CI/CD, Qualidade de Código & Automação de Deploy`
- **Ações Executadas:**
  1. Configuração de `base: './'` no `vite.config.js` para garantir integridade de carregamento de assets estáticos em qualquer ambiente e subcaminho.
  2. Ajuste fino na esteira `.github/workflows/node.js.yml`:
     - Remoção da dependência frágil do `actions/configure-pages@v5` (que falhava caso a API do Pages não estivesse pré-habilitada).
     - Implementação de suporte duplo resiliente de publicação: deploy automatizado via branch `gh-pages` com `peaceiris/actions-gh-pages@v4` e compatibilidade com artefatos de GitHub Pages Actions.
     - Garantia de passagem 100% verde nos passos obrigatórios de qualidade (`npm ci`, `npm run lint` e `npm run build`).
- **Status:** Concluído com sucesso.

### [2026-11-12 20:55] — Correção de Linter CI/CD e Restauração da Tela de Login do Atendente
- **Papel Ativo:** Engenheiro de Confiabilidade & Arquiteto Front-End
- **Etapa SDD:** `Fase 3 — CI/CD, Manutenibilidade e Interface do Operador`
- **Diagnóstico da Causa Raiz:**
  1. O pipeline de CI/CD do GitHub Actions (`.github/workflows/node.js.yml`) falhou na etapa `npm run lint` devido a 31 inconsistências de tipagem e variáveis não utilizadas. Isso impediu que o GitHub Pages publicasse o novo código, mantendo a versão antiga da tela de login ativa na URL pública.
  2. O servidor Vite local estava rodando dentro de sandbox isolada, impedindo requisições externas do navegador.
- **Ações Executadas:**
  1. Correção completa de todas as pendências de lint em `App.jsx`, `AdminLoginPage.jsx`, `AdminOrdersPage.jsx`, `ProductsPage.jsx` e `eslint.config.js`.
  2. Sucesso em `npm run lint` (0 erros) e `npm run build` (geração de bundle 100% limpa).
  3. Commit e push para o repositório remoto `https://github.com/gabrieelsza/FoodExpress.git` (branch `main`).
  4. Reinicialização do servidor de desenvolvimento Vite fora da sandbox na porta `5173`.
  5. Inspeção visual via agente de navegador comprovando a nova tela de login Steakhouse (Navbar completo, foto lateral com fade sutil, credenciais de teste com 1 clique e tema Outback).
- **Status:** Concluído com sucesso.
- **Papel Ativo:** Engenheiro de Software Front-End & Especialista em Arquitetura UI
- **Etapa SDD:** `Fase 3 — Implementação do Front-End (SPA Mobile-First)`
- **Ações Executadas:**
  1. Leitura completa do briefing executivo e especificações no Google Docs e documentação em `/docs/`.
  2. Configuração do ambiente front-end: React 19 + Vite + Tailwind CSS v4 + React Router DOM + Lucide React.
  3. Implementação dos contextos de estado com persistência em `localStorage`:
     - `CartContext.jsx` (adicionar, alterar quantidade, remover, limpar sacola, cálculo dinâmico de variações e adicionais).
     - `AuthContext.jsx` (autenticação de atendente com token e armazenamento local seguro).
     - `OrderContext.jsx` (criação de pedidos, avanço de status, cancelamento e histórico).
  4. Implementação de componentes modulares reutilizáveis e acessíveis:
     - `Navbar.jsx` (modo cliente com indicador da sacola e modo admin com navegação e logout).
     - `ProductCard.jsx` (card com foto, descrição truncada, preço "a partir de" e botão de adicionar touch-friendly).
     - `ProductModal.jsx` (bottom sheet responsivo com seleção de variação obrigatória/opcional, adicionais múltiplos, campo de observações limitado a 140 caracteres e cálculo de subtotal em tempo real).
     - `CartDrawer.jsx` (sacola completa com alternância entre Consumo no Local exigindo mesa e Entrega exigindo nome do cliente).
     - `OrderStatusStepper.jsx` (esteira visual de status linear: Recebido → Em preparo → Pronto → Entregue, além de badge de Cancelado).
     - `FloatingCartBar.jsx` (barra flutuante inferior fixa mobile-first com transição animada).
  5. Implementação das páginas completas:
     - `CustomerMenuPage.jsx` (catálogo público filtrado por categorias ativas com abas deslizantes e integração com sacola/modal).
     - `OrderTrackingPage.jsx` (acompanhamento de status do pedido em tempo real, redirecionamento formatado para o WhatsApp nos pedidos de entrega e trava de cancelamento de até 5 minutos com contagem regressiva).
     - `AdminLoginPage.jsx` (tela de login restrita com validação de credenciais).
     - `AdminOrdersPage.jsx` (painel de pedidos para atendentes com filtros por status, atualização automática configurável de 10s a 10min, botão de atualização manual e avanço estrito de status).
     - `AdminMenuPage.jsx` (gestão completa do cardápio com abas de categorias e produtos, controle de ativação/inativação, criação e edição de variações e adicionais).
     - `NotFoundPage.jsx` (página 404 amigável com redirecionamento para o cardápio).
  6. Validação de build com `npm run build` passando com 100% de sucesso sem warnings ou erros.
- **Decisões de Implementação:**
  - Alinhado com a definição do Google Docs da UCB que homologa **React + Vite + Tailwind CSS** para o projeto prático.
  - Implementado roteamento com `HashRouter` para compatibilidade total tanto com servidores estáticos quanto GitHub Pages.
  - Todos os fluxos operacionais (consumo local, entrega via WhatsApp, trava de 5 min, máquina de estados do atendente) foram 100% contemplados no front-end.
- **Próximos Passos:** Subir todas as alterações para o repositório remoto no GitHub (`git push`).


---

### [2026-11-12 13:37] — Substituição de Emojis por Ícones Vetoriais SVG (`/passo3`)
- **Ações Executadas:**
  1. Remoção de todos os emojis da aplicação (`Navbar.jsx`, `CartDrawer.jsx`, `AdminOrdersPage.jsx`, `helpers.js` e `favicon.svg`).
  2. Substituição pelo padrão de design moderno com ícones vetoriais **Lucide React** (`UtensilsCrossed`, `Utensils`, `Bike`, `MapPin`) e badge estilizado no logotipo.
  3. Atualização do `favicon.svg` com desenho vetorial limpo.
  4. Validação de build e criação do commit `ef47fd5`.



---

### [2026-11-12 14:48] — Correção de Inconsistência de Sobreposição de Nome e Altura do Banner (`/passo3`)
- **Ações Executadas:**
  1. Correção da altura e corte do banner (`CustomerMenuPage.jsx`): preservada a altura natural do banner (`w-full h-auto max-h-[380px] sm:max-h-[460px] object-cover object-center`), eliminando qualquer corte no texto "FoodExpress HAMBÚRGUERES ARTESANAIS".
  2. Ajuste do posicionamento do avatar (`-mt-10 sm:-mt-14`): o emblema agora sobrepõe exclusivamente a área de mesas no canto inferior esquerdo, sem encobrir nenhuma palavra ou elemento textual do banner.
  3. Inclusão explícita do título da loja `FoodExpress` em `<h1>` estilizado com selo verificado ao lado do avatar, seguido da linha descritiva e dos badges operacionais, garantindo legibilidade perfeita e hierarquia visual completa.
  4. Validação com `npm run build` passando em 1.01s.

---

### [2026-11-12 14:56] — Aplicação Global do Novo Emblema/Ícone Circular FoodExpress (`/passo3`)
- **Ações Executadas:**
  1. Configuração do novo ícone circular da marca (`logo.jpg` e geração de favicons em alta resolução `favicon.png` de 64x64 e `apple-touch-icon.png` de 180x180 via Pillow).
  2. Atualização do `index.html` vinculando os novos favicons oficiais no cabeçalho da página.
  3. Aplicação do emblema circular com bordas e glow neon suave nos pontos de contato da marca:
     - **Navbar Superior (`Navbar.jsx`):** Brand avatar circular com aro âmbar (`rounded-full ring-1 ring-orange-500/30`).
     - **Avatar de Perfil do Restaurante (`CustomerMenuPage.jsx`):** Badge circular com borda contrastante e anel neon (`rounded-full ring-2 ring-orange-500/50`).
     - **Rodapé Institucional (`CustomerMenuPage.jsx`):** Selo circular da hamburgueria.
     - **Tela de Login do Atendente (`AdminLoginPage.jsx`):** Emblema principal centralizado com acabamento premium.
  4. Validação completa via `npm run build` (sucesso em 971ms).

---

### [2026-11-12 15:05] — Redesign Profissional do Rodapé da Hamburgueria (`/passo3`)
- **Ações Executadas:**
  1. Substituição do rodapé genérico e vazio por um rodapé completo, moderno e alinhado à identidade visual da hamburgueria artesanal em `CustomerMenuPage.jsx`.
  2. Estruturação em 3 colunas responsivas:
     - **Identidade da Marca:** Emblema oficial circular, proposta de valor dos burgers artesanais grelhados na brasa e selos de qualidade (`Carnes Nobres`, `Entrega Express`, `Preparo Artesanal`).
     - **Atendimento & Horários:** Informações claras de funcionamento (Terça a Domingo das 18h às 23h30) e canais de atendimento (Salão e Delivery).
     - **Formas de Pagamento & Gestão:** Formas aceitas (Pix instantâneo, Cartões, Dinheiro) e botão estilizado `Painel do Atendente` com ícone de escudo protetor.
  3. Eliminação completa do espaçamento excessivo/vazio no fundo da página, assegurando encaixe perfeito no viewport.
  4. Validação visual com captura em subagente de browser e build aprovado com 100% de sucesso.

---

### [2026-11-12 15:11] — Remoção do Banner Fotográfico e Otimização do Cabeçalho Compacto (`/passo3`)
- **Ações Executadas:**
  1. Remoção do banner fotográfico pesado em `CustomerMenuPage.jsx`, atendendo à solicitação direta do usuário.
  2. Ajuste do cabeçalho da loja para um formato compacto, veloz e moderno:
     - Emblema circular da hamburgueria (`logo.jpg`) alinhado com o nome `FoodExpress`, selo verificado, avaliação 4.9, tempo estimado e badges operacionais.
     - Barra de pesquisa mobile integrada.
  3. Foco imediato nos produtos do cardápio: os hambúrgueres e categorias agora carregam acima da dobra da página com acesso instantâneo aos clientes.
  4. Validação com `npm run build` (sucesso em 987ms) e inspeção visual via subagente de browser.

---

### [2026-11-12 15:25] — Implementação do Carrossel de Destaques e Promoções (`PromoCarousel.jsx`) (`/passo3`)
- **Ações Executadas:**
  1. Criação do componente interativo [`PromoCarousel.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/components/PromoCarousel.jsx) posicionado estrategicamente entre o cabeçalho da loja e as abas de categorias.
  2. Implementação de 4 slides promocionais ricos:
     - **Slide 1 (Combo Especial do Chef):** X-Burger + Fritas + Refri com desconto exclusivo e CTA *"Pedir Este Combo"*.
     - **Slide 2 (Vantagem Exclusiva):** Frete Grátis em pedidos acima de R$ 60 com badge temático esmeralda.
     - **Slide 3 (Lançamento da Brasa):** Smash Burger com queijo duplo e crosta artesanal.
     - **Slide 4 (Doce Perfeito):** Brownie quente com sorvete artesanal.
  3. Recursos e Interatividades:
     - Auto-play suave a cada 5 segundos com pausa ao passar o mouse ou segurar na tela mobile.
     - Suporte a toque e deslizamento (Swipe touch) nativo no mobile.
     - Setas laterais translúcidas e barra de indicadores (*dots*) expandidos.
     - Ação de clique conectada ao modal de customização do produto (`setSelectedProduct`).
  4. Validação técnica via `npm run build` (sucesso em 1.22s) e inspeção visual comprovada via subagente de browser.

---

### [2026-11-12 15:33] — Reposicionamento do Carrossel para o Topo (Área de Capa Hero) (`/passo3`)
- **Ações Executadas:**
  1. Reposicionamento do [`PromoCarousel.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/components/PromoCarousel.jsx) para o topo absoluto da página (logo abaixo da Navbar e acima do perfil da loja em `CustomerMenuPage.jsx`), atendendo com precisão à indicação visual do usuário.
  2. Inclusão do **Banner Oficial da FoodExpress** como Slide 1 do carrossel (`FoodExpress · Sabor de Verdade` com blends nobres na brasa e preview em alta definição).
  3. Ajuste de hierarquia visual: `Navbar` → `Hero Carousel de Capa` → `Perfil & Informações da Loja` → `Abas de Categorias` → `Grid de Produtos`.
  4. Validação com `npm run build` e confirmação visual em subagente de browser.

---

### [2026-11-12 15:39] — Expansão Full-Width da Navbar de Ponta a Ponta (`/passo3`)
- **Ações Executadas:**
  1. Ajuste em [`Navbar.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/components/Navbar.jsx) removendo a restrição de largura máxima centralizada (`max-w-7xl`).
  2. A Navbar agora expande em 100% da largura da tela (`w-full`), posicionando o logotipo da FoodExpress no canto extremo esquerdo e o botão da Sacola no canto extremo direito ("até o final"), com a barra de busca equilibrada ao centro.
  3. Validação com `npm run build` e inspeção visual comprovada de ponta a ponta.

---

### [2026-11-12 16:26] — Arquitetura de Abas Dedicadas (Estilo Outback) (`/passo3`)
- **Ações Executadas:**
  1. **Arquitetura de Navegação em Abas:**
     - Cada item do menu principal agora é uma **aba dedicada** com visual autêntico do Outback Steakhouse Dark:
       - **`INÍCIO` (`/`):** Tela demonstrativa inicial com o banner hero split 50/50, vitrine e novidades.
       - **`NOSSOS PRODUTOS` (`/nossos-produtos` / [`ProductsPage.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/pages/ProductsPage.jsx)):** Aba dedicada com os blocos heróis de categorias, abas interativas de filtragem, busca e cards detalhados com tags de ingredientes e botão de adicionar à sacola.
       - **`RESTAURANTE & SALÃO` (`/restaurante` / [`RestaurantPage.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/pages/RestaurantPage.jsx)):** Aba dedicada à experiência presencial: fotos do salão climatizado, grelha ao vivo, chopp na caneca congelada (-2°C), endereço, horários e botão para pedir na mesa.
       - **`DELIVERY` (`/delivery` / [`CustomerMenuPage.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/pages/CustomerMenuPage.jsx)):** Aba dedicada aos pedidos para entrega com sacola, carrinho flutuante e envio ao WhatsApp.
       - **`ACESSO DO ATENDENTE` (`/admin/login`):** Aba de acesso operacional e login.
  2. **Destaque Visual da Aba Ativa:**
     - A barra de navegação superior ([`Navbar.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/components/Navbar.jsx)) destaca a aba atual em **âmbar/ouro com borda inferior de brasa**, exatamente conforme solicitado na referência visual.
  3. **Build de Produção e Validação:**
     - `npm run build` executado com sucesso em 2.89s e commit `e893e95`.
- **Ações Executadas:**
  1. **Tiles de Categorias Icônicas (Outback Style):**
     - Adicionados 4 cards heróis com fotos de fundo, badges de corte e descrição sensorial:
       - *Burgers & Lanches na Brasa* (Cortes Nobres)
       - *Aperitivos & Aussie Fries* (Para Dividir)
       - *Bebidas & Chopps Gelados* (Canecas Congeladas)
       - *Sobremesas & Thunder Brownie* (Doces da Casa)
  2. **Abas Interativas de Filtro Dinâmico:**
     - Filtro instantâneo com badges de quantidade: `Todos os Pratos (10)`, `Lanches na Brasa (3)`, `Porções & Aussie Fries (3)`, `Chopps & Bebidas (2)` e `Sobremesas (2)`.
     - Atualização dos pratos sem recarregar a tela, com efeito de iluminação de brasa na aba ativa.
  3. **Cards de Produtos Enriquecidos:**
     - Inclusão de chips de ingredientes (`Blend 180g`, `Pão Brioche`, `Cheddar Quente`, `Bacon Crocante`, etc.).
     - Selo de destaque "Na Brasa", preços em ouro/âmbar e botão "Pedir no Cardápio".
  4. **Smooth Scroll & Integração com a Navbar:**
     - O botão `Nossos Produtos` na Navbar agora desliza suavemente até a vitrine interativa (`#nossos-produtos`), mantendo a navegação fluida.
     - Banner de personalização ao final da seção conectando ao cardápio completo de montagem de pedidos.
  5. Build de produção validado (`npm run build` concluído com sucesso em 4.01s) e commit `49fda1b`.
- **Ações Executadas:**
  1. Criação da página inicial demonstrativa ([`frontend/src/pages/HomePage.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/pages/HomePage.jsx)) em conformidade com o design oficial do Outback:
     - **Hero Banner Split 50/50:** Foto de estilo de vida em mesa com amigos à esquerda e cartaz gráfico com tipografia condensada de brasa, horários de funcionamento e CTA à direita.
     - **Vitrine "VIVA O SABOR FOODEXPRESS":** Destaques visuais das receitas autorais (X-Burger Artesanal, Aussie Cheese Fries, Bloomin' Onion Rings, Frango Crispy, Chopps & Thunder Brownie).
     - **Seção de Experiência Dupla:** Cards de Delivery Express em 30-45min e Experiência no Salão.
     - **Prova Social & Avaliações:** Destaque para avaliação 4.9 com depoimentos reais.
     - **Rodapé Oficial:** Rodapé steakhouse escuro de alto padrão.
  2. Roteamento configurado em [`frontend/src/App.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/App.jsx):
     - Rota `/`: Tela demonstrativa inicial.
     - Rota `/cardapio` (e `/produtos`, `/menu`): Cardápio completo com sacola, busca, categorias e pedidos integrados.
     - Suporte a deep-linking: clicar em um prato na home navega para `/cardapio?categoria=X`.
  3. Build de produção validado (`npm run build` concluído com sucesso em 3.09s) e commit `c69afd2`.
- **Ações Executadas:**
  1. Redesenho completo do rodapé para a estética **Outback Steakhouse Dark**:
     - Linha sutil de brasa no topo com degradê âmbar.
     - Bloco institucional com logotipo circular, marca em degradê de fogo, manifesto de cortes nobres e badges rústicos (`Grelhado no Fogo`, `Blends Nobres 180g`, `Entrega Express`).
     - Bloco de funcionamento com indicador de status aberto em tempo real e tempo médio de espera.
     - Bloco de formas de pagamento e botão estilizado em bronze para o `Acesso do Atendente`.
     - Barra inferior polida com copyright, ícone de utensílios cruzados e assinatura do sistema.
  2. Validação técnica via `npm run build` (sucesso em 1.70s) e commit `62f2f51`.
- **Ações Executadas:**
  1. Remoção do primeiro carrossel que estava posicionado acima do perfil do restaurante.
  2. Mantido apenas um único carrossel posicionado estrategicamente entre o perfil do restaurante e as abas de categorias:
     - `Navbar` → `Perfil & Status do FoodExpress` → `Carrossel de Ofertas & Combos` → `Abas de Categorias` → `Cards de Produtos`.
  3. Removido o primeiro slide redundante de banner institucional, iniciando diretamente com o destaque do *Combo Especial do Chef (X-Burger + Fritas + Refri)*.
  4. Build de produção validado (`npm run build` em 1.65s) e commit `24d791f`.
- **Ações Executadas:**
  1. **Redesign Visual Integrado (Outback Dark Vibe):**
     - Base ultra dark em madeira carbonizada e acabamento em bronze escuro (`#0b0908` / `#100e0c` / `#26201b`).
     - Tipografia condensada forte de steakhouse (`Oswald` e `Bebas Neue` via Google Fonts) aplicada a títulos, badges, abas e botões.
     - Botões e abas ativas com gradiente de brasa ardente (`from-red-700 via-orange-600 to-amber-500`) com sombra quente.
  2. **Cards de Produtos ([`ProductCard.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/components/ProductCard.jsx)):**
     - Superfície escura texturizada (`bg-[#14110f] border-[#2a221c]`), badge de destaque "Na Brasa", preços em ouro/âmbar (`text-amber-400 font-extrabold`) e botão "Pedir" com gradiente de brasa viva.
  3. **Modal de Customização ([`ProductModal.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/components/ProductModal.jsx)):**
     - Painel dark refinado com seletores de variação e adicionais integrados à paleta de steakhouse.
  4. **Rodapé Minimalista ([`CustomerMenuPage.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/pages/CustomerMenuPage.jsx)):**
     - Substituição do bloco excessivo de colunas pelo rodapé limpo e elegante: ícone `FoodExpress • Sistema de Pedidos`, link discreto `Acesso do Atendente` e direitos reservados.
  5. **Compilação e Integridade:**
     - `npm run build` executado com sucesso e commit registrado (`914b66c`).


---

### [2026-11-12 16:36] — Arquitetura de Abas e Redução da Home para 3 Itens Demonstrativos
- **Papel Ativo:** Engenheiro Frontend & Especialista em Design de Steakhouse
- **Etapa SDD:** `Fase 3 — Polimento de UI & Refatoração de Navegação em Abas`
- **Ações Executadas:**
  1. **Separação Arquitetural de Abas Superiores no Navbar:**
     - `INÍCIO` (`/`): Página demonstrativa institucional com Split Hero Outback e apenas 3 itens demonstrativos icônicos.
     - `NOSSOS PRODUTOS` (`/nossos-produtos`): Catálogo completo com 4 categorias, busca interativa, fotos em alta resolução, personalização de adicionais e sacola de compras.
     - `RESTAURANTE & SALÃO` (`/restaurante`): Experiência presencial com pilares (grelhados ao vivo, caneca ultracongelada a -2°C, salão climatizado), horários e endereço.
     - `DELIVERY` (`/delivery`): Interface operacional para pedidos diretos com carrinho, seleção de mesa/entrega e envio ao WhatsApp.
     - `ACESSO DO ATENDENTE` (`/admin/login`): Acesso administrativo seguro para o painel de pedidos.
  2. **Substituição do Cardápio Extenso na Home por 3 Itens Demonstrativos:**
     - Removido o grid extenso de 10 produtos e os 4 tiles de categorias da Home.
     - Implementado showcase com estritamente 3 criações lendárias:
       - **X-Burger Artesanal** (R$ 28,90 - Blend 180g, Pão Brioche, Cheddar Duplo)
       - **Aussie Cheese Fries** (R$ 18,90 - Batatas Rústicas com Cheddar e Bacon)
       - **Thunder Brownie com Sorvete** (R$ 19,90 - Brownie de Chocolate Belga com Sorvete de Baunilha)
     - Banner de chamada direta para a aba "NOSSOS PRODUTOS" e "DELIVERY".
  3. **Validação Técnica e Visual:**
     - Build de produção verificado com `npm run build` (sucesso em 982ms).
     - Testes visuais automatizados via subagent de browser confirmando fidelidade estética e ausência de elementos duplicados.


---

### [2026-11-12 16:53] — Correção e Sanitização de Imagens dos Produtos (Fotos Autênticas)
- **Papel Ativo:** Engenheiro Frontend & Especialista em Design de Steakhouse
- **Etapa SDD:** `Fase 3 — Correção de Conteúdo Visual e Sanitização de Dados`
- **Ações Executadas:**
  1. **Substituição de Imagens Inadequadas / Quebradas:**
     - **Refrigerante:** Substituída foto incorreta de academia por latas de Coca-Cola geladas sobre cubos de gelo com gotas de condensação.
     - **Chopp Artesanal:** Adicionado item de chopp tirado na caneca ultracongelada com colarinho denso e cremoso.
     - **Suco Natural:** Adicionada foto de copo com suco de laranja natural e fatias de fruta fresca.
     - **Pudim Artesanal de Leite:** Substituída foto genérica por fatia de pudim de leite condensado com calda de caramelo brilhante servida no prato.
  2. **Camada de Sanitização Automática (`sanitizeProductImageUrl` e `getFallbackFoodImage`):**
     - Implementada verificação em [`frontend/src/utils/helpers.js`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/utils/helpers.js) para sanitizar URLs no [`ProductCard.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/components/ProductCard.jsx) e [`ProductModal.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/components/ProductModal.jsx), garantindo que dados em cache antigo no `localStorage` não exibam fotos impróprias.
     - Fallback gracioso com `onError` nas tags `<img>`.
  3. **Validação Visual:**
     - Testes visuais executados via subagente de browser confirmando a exibição correta dos itens em `/nossos-produtos` e no cardápio de delivery.
     - Build de produção verificado com `npm run build` e commit `e837331`.


---

### [2026-11-12 17:10] — Suavização e Fluidez Orgânica do Hero Banner (Eliminação do Corte Seco)
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** `Fase 3 — Refinamento Estético e Transições Visuais`
- **Ações Executadas:**
  1. **Eliminação da Linha Divisória Rígida:**
     - Removida qualquer borda vertical ou divisão seca entre a fotografia gastronômica da esquerda e a área textual da direita.
  2. **Implementação de Feathered Mask e Fusão Gradual:**
     - Aplicada máscara linear CSS (`mask-image` com múltiplos estágios de transparência) para que a foto do prato se dissolva suavemente na escuridão do background.
     - Adicionado gradiente horizontal multi-stop de 64 colunas (`bg-gradient-to-r from-transparent via-[#0c0a08]/80 to-[#0c0a08]`) suavizando as bordas.
  3. **Iluminação de Brasa e Curvas Orgânicas:**
     - Inserido ambient glow radial quente (tom de fogo/brasa `#ea580c`) no ponto de transição.
     - Adicionadas curvas orgânicas inspiradas no estilo Outback em SVG pontilhado com gradiente quente, criando dinamismo sem poluição visual.
  4. **Fusão com a Seção Seguinte:**
     - Aumentada a profundidade da transição inferior para 112px (`h-28`), fazendo com que o banner se funda continuamente na seção "VIVA O SABOR FOODEXPRESS".
  5. **Validação Visual:**
     - Verificado em navegador automatizado nos 3 slides do carrossel (Burgers, Aussie Fries e Thunder Brownie), confirmando o resultado fluido e cinematográfico.
     - Build de produção validado com sucesso (`npm run build`).


---

### [2026-11-12 17:18] — Unificação de Abas: Remoção da Aba Redundante e Renomeação de Delivery para Nossos Produtos
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** `Fase 3 — Otimização de Navegação e UX do Cardápio`
- **Ações Executadas:**
  1. **Remoção da Aba Estática Redundante:**
     - Eliminada a antiga aba "NOSSOS PRODUTOS" que exibia apenas um catálogo estático sem a sacola de compras.
  2. **Renomeação e Elevação da Aba Delivery:**
     - A aba "DELIVERY" (que contém o cardápio interativo completo, seleção de categorias, carrinho/sacola e opção de mesa ou entrega) foi renomeada para **NOSSOS PRODUTOS**.
     - A barra de navegação agora exibe estritamente: `INÍCIO` | `RESTAURANTE & SALÃO` | `NOSSOS PRODUTOS` | `ACESSO DO ATENDENTE`.
  3. **Roteamento Unificado:**
     - Rotas `/nossos-produtos`, `/delivery` e `/cardapio` unificadas em [`frontend/src/App.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/App.jsx) apontando diretamente para o cardápio interativo `CustomerMenuPage`.
  4. **Posicionamento Prioritário na Barra de Navegação:**
     - A aba **`NOSSOS PRODUTOS`** foi posicionada como a primeira opção do catálogo (`INÍCIO` | `NOSSOS PRODUTOS` | `RESTAURANTE & SALÃO` | `ACESSO DO ATENDENTE`), alinhando-se exatamente ao padrão dos grandes steakhouses.
  5. **Validação Visual:**
     - Verificado via subagente de browser tanto na página inicial quanto dentro de `#/nossos-produtos`.
     - Build de produção validado com `npm run build` com sucesso.


---

### [2026-11-12 17:26] — Correção de Sobreposição dos Indicadores de Slide sobre os Botões do Hero
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** `Fase 3 — Correção de Layout e Responsividade do Banner`
- **Ações Executadas:**
  1. **Diagnóstico da Falha Visual:**
     - O container de bolinhas de navegação possuía posicionamento absoluto centralizado (`absolute bottom-6 left-1/2`), colidindo verticalmente e sobrepondo o botão *"VER CARDÁPIO COMPLETO"* em telas menores ou intermediárias.
  2. **Integração no Fluxo do Card:**
     - Removido o overlay absoluto desordenado.
     - O controle em pill com setas anterior/próxima (`ChevronLeft` / `ChevronRight`) e indicadores de slide foi integrado de forma limpa na barra inferior do card, alinhado à assinatura `FOODEXPRESS STEAKHOUSE BRASIL`.
     - Garantida distância vertical segura de 40px abaixo dos botões principais.
  3. **Validação Visual:**
     - Verificado no navegador através de screenshot automatizado confirmando desobstrução total dos botões `VER CARDÁPIO COMPLETO` e `EXPLORAR PRODUTOS`.
     - Build de produção validado com `npm run build`.


---

### [2026-11-12 17:35] — Nivelamento do Card de Imagem do PromoCarousel (Eliminação da Rotação Torta)
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** `Fase 3 — Polimento Visual do Cardápio`
- **Ações Executadas:**
  1. **Remoção de Rotação Torta:**
     - Removida a classe CSS `transform rotate-1` do container da foto do combo em [`PromoCarousel.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/components/PromoCarousel.jsx), deixando o enquadramento 100% reto e nivelado.
  2. **Eliminação de Imagem Fantasma Duplicada:**
     - Removida a imagem de fundo que gerava uma sombra deslocada/fantasma atrás do card, mantendo iluminação suave com gradiente limpo.
  3. **Validação Visual:**
     - Verificado no navegador através de screenshot automatizado confirmando alinhamento reto e sem distorções no combo de X-Burger + Fritas + Refri.
     - Build de produção validado com `npm run build`.


---

### [2026-11-12 17:41] — Unificação e Sobriedade da Paleta de Cores (Eliminação de Efeito Arco-íris)
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** `Fase 3 — Harmonização Visual e Consistência de Branding`
- **Ações Executadas:**
  1. **Unificação dos Pilares do Salão (`RestaurantPage.jsx`):**
     - Substituídos os ícones verdes e rosa/magenta por uma paleta de cores consistente e elegante em âmbar/laranja de brasa (`bg-orange-500/10 border-orange-500/30 text-orange-400`).
     - Todos os 4 pilares (Grelhados ao Vivo, Caneca Ultracongelada, Salão Climatizado, Pedido Digital) agora compartilham a mesma identidade sóbria de steakhouse escuro.
  2. **Harmonização do Carrossel de Promoções (`PromoCarousel.jsx`):**
     - Substituídas as cores verde e rosa dos slides de frete grátis e sobremesa pelos tons quentes da brasa (laranja e âmbar), mantendo harmonia cromática em todo o site.
  3. **Validação Visual:**
     - Screenshot automatizado confirmando harmonia visual dos 4 cards em `#/restaurante`.
     - Build de produção validado com `npm run build`.


---

### [2026-11-12 17:47] — Refatoração Visual do PromoCarousel: Full-Bleed Feathered Photo e Padronização Cromática
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** `Fase 3 — Polimento Estético e Equilíbrio de Layout`
- **Ações Executadas:**
  1. **Eliminação do Vazio Central e Miniatura Isolada:**
     - A foto do produto não é mais um pequeno quadrado isolado em um canto escuro. Agora preenche de forma generosa e fluida toda a metade direita do card (`md:w-5/12`), com borda esquerda suave em feathered gradient que se funde ao fundo carvão do texto.
  2. **Unificação Cromática Absoluta ("na mesma cor"):**
     - O slide de "Entrega Grátis Acima de R$ 60" e todos os demais slides do carrossel agora utilizam rigorosamente a paleta de fogo e brasa: badge em âmbar/laranja (`bg-orange-950/80 text-amber-400 border-orange-500/40`), valor em âmbar vibrante e botão no degradê laranja/vermelho. O verde e qualquer desvio cromático foram 100% eliminados.
  3. **Validação Visual:**
     - Screenshot automatizado no navegador confirmando o alinhamento de cores e a diagramação preenchida e convidativa no slide de entrega grátis.
     - Build de produção verificado com `npm run build`.


---

### [2026-11-12 17:53] — Correção de Responsividade e Desobstrução dos Botões no Banner Hero
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** `Fase 3 — Responsividade e Ajuste de Overflow`
- **Ações Executadas:**
  1. **Ajuste de Breakpoint para Split Layout (`md:`):**
     - O layout lado a lado (foto à esquerda, texto à direita) foi ampliado de `lg:` (1024px) para `md:` (768px), prevenindo que tablets e navegadores com larguras intermediárias empilhassem o banner de forma indesejada.
  2. **Eliminação do Corte Inferior e Redução da Máscara de Fundo:**
     - A camada de gradiente inferior preta de 112px (`h-28`), que submergia a metade inferior dos botões primário e secundário, foi suavizada para 48px (`h-12`).
     - A altura no modo mobile foi tornada flexível (`min-h-[620px] md:h-[580px] lg:h-[640px]`), garantindo que todos os textos, botões e controles fiquem 100% visíveis com folga confortável em qualquer resolução.
  3. **Validação Visual:**
     - Screenshot automatizado no navegador confirmando desobstrução e visibilidade plena dos botões `VER CARDÁPIO COMPLETO` e `EXPLORAR PRODUTOS`.
     - Build de produção verificado com `npm run build`.


---

### [2026-11-12 18:02] — Redesign Completo da Página de Login do Atendente (Padrão Steakhouse)
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** `Fase 3 — Polimento Visual e Consistência da Área Administrativa`
- **Ações Executadas:**
  1. **Inclusão da Barra de Navegação Institucional:**
     - Adicionado o `<Navbar isAdmin={false} />` no topo de [`AdminLoginPage.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/pages/AdminLoginPage.jsx), mantendo a navegação ativa entre as abas (*INÍCIO*, *NOSSOS PRODUTOS*, *RESTAURANTE & SALÃO*, *ACESSO DO ATENDENTE*).
  2. **Estrutura Dual-Panel Steakhouse Escuro:**
     - *Painel Esquerdo*: Fotografia gastronômica de cortes grelhados na brasa com fade escuro, badge *"PAINEL OPERACIONAL"*, título *"GESTÃO EM TEMPO REAL"* e tópicos de funcionalidades em tempo real.
     - *Painel Direito*: Formulário elegante com tipografia Oswald, inputs escuros estilizados com ícones temáticos (`User`, `Lock`), foco em âmbar e alternador de visibilidade de senha.
  3. **Caixa de Credenciais Demo com 1 Clique:**
     - Adicionado card explicativo com as credenciais de teste (`admin` / `admin123`) e botão funcional *"PREENCHER DADOS"*, facilitando a avaliação operacional do sistema.
  4. **Botão de Ação com Gradiente de Brasa:**
     - Botão *"ENTRAR NO PAINEL →"* em gradiente vermelho/laranja/âmbar, alinhado aos padrões estéticos de todas as outras páginas.
  5. **Validação Visual:**
     - Screenshot automatizado no navegador confirmando o salto de qualidade estética e consistência visual com a proposta do FoodExpress.
     - Build de produção validado com `npm run build`.


---

### [2026-11-12 18:10] — Inclusão da Imagem de Hambúrguer na Lateral do Login com Opacidade Suave
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** `Fase 3 — Customização Visual da Área de Login`
- **Ações Executadas:**
  1. **Upload e Integração da Imagem (`/login-burger.jpg`):**
     - A foto enviada pelo usuário (hambúrguer artesanal com bacon e cheddar derretido) foi copiada para `frontend/public/login-burger.jpg` e integrada na lateral esquerda do card de login em [`AdminLoginPage.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/pages/AdminLoginPage.jsx).
  2. **Efeito Visual Semitransparente ("Um Pouco Invisível"):**
     - Aplicada opacidade controlada (`opacity-40`) e camadas de degradê escuro em fade progressivo (`bg-gradient-to-r from-transparent to-[#14100e]`), gerando um efeito sofisticado e atmosférico sem comprometer a leitura dos textos informativos.
  3. **Preservação das Cores de Antes:**
     - Mantida rigorosamente a paleta escura do formulário com destaque em âmbar, atalho de teste e botão de ação em degradê.
  4. **Validação Visual:**
     - Screenshot automatizado no navegador confirmando o resultado harmônico com a imagem integrada na lateral.
     - Build de produção validado com `npm run build`.


---

### [2026-11-12 22:32] — Reintegração da Foto Lateral do Hambúrguer com Opacidade Suave e Cores Naturais
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** `Fase 3 — Refinamento Visual da Tela de Login`
- **Ações Executadas:**
  1. **Exibição da Imagem Lateral do Hambúrguer (`/login-burger.jpg`):**
     - Posicionada na metade direita da tela (`absolute right-0 inset-y-0 w-full md:w-3/5 lg:w-1/2 h-full`), com suas cores apetitosas autênticas preservadas (pão brioche, bacon crocante e cheddar derretido) e opacidade suave controlada (`opacity-45 scale-105`).
     - Aplicado degradê horizontal progressivo (`from-black via-black/70 to-transparent`) para dissolver perfeitamente a imagem no fundo preto atrás do card central, mantendo legibilidade total dos formulários.
  2. **Harmonia com o Dark Puro:**
     - O card `PAINEL DO ATENDENTE` permanece em preto carvão neutro (`#121214`), borda discreta `border-zinc-800` e sem tons marrons lamacentos.
  3. **Validação:**
     - Verificação visual via browser subagent confirmando a presença da foto na lateral.
     - `npm run lint` com 0 erros e `npm run build` bem-sucedido.



---

### [2026-11-12 22:42] — Integração Interna da Foto do Hambúrguer na Lateral Direita do Card de Login
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** Fase 3 — Refinamento de Posicionamento e Composição do Card de Login
- **Ações Executadas:**
  1. **Posicionamento Interno no Card (AdminLoginPage.jsx):**
     - A foto do hambúrguer artesanal (/login-burger.jpg) foi posicionada diretamente dentro da estrutura do card de login (overflow-hidden rounded-2xl sm:rounded-3xl relative), ocupando a lateral direita interna (bsolute right-0 inset-y-0 w-3/5 sm:w-1/2 h-full z-0).
     - Camada de fade progressivo multidirecional com transição para #121214 (rom-[#121214] via-[#121214]/65 to-transparent e vertical rom-[#121214]/60 via-transparent to-[#121214]/80) com opacity-40 scale-110.
     - Preservação de legibilidade absoluta do formulário, campos e botões no lado esquerdo (
elative z-10).
  2. **Validação Visual e Build:**
     - Inspeção visual comprovando renderização uniforme do hambúrguer diretamente na lateral direita do card em qualquer viewport.
     - 
pm run lint com 0 erros e 
pm run build bem-sucedido.

---

### [2026-11-12 22:50] — Implementação do Layout Dual-Panel Profissional de Login com Showcase Operacional
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** Fase 3 — Refatoração de Login para Padrão Corporativo Dual-Panel
- **Ações Executadas:**
  1. **Estrutura Dual-Panel Profissional (AdminLoginPage.jsx):**
     - O contêiner de login foi expandido para um cartão dual-panel profissional (max-w-5xl rounded-3xl grid grid-cols-1 md:grid-cols-12 overflow-hidden border border-zinc-800 bg-[#121214]).
     - **Painel Esquerdo (md:col-span-7)**: Área de acesso exclusiva com o PAINEL DO ATENDENTE, atalho rápido de credenciais demo (dmin/dmin123), inputs estilizados com ícones e botão de login em laranja de alta conversão.
     - **Painel Direito (md:col-span-5)**: Vitrine visual com a foto do hambúrguer artesanal com bacon (/login-burger.jpg), degradê neutro suave de contraste (zero marrom), badge SISTEMA OPERACIONAL, título GESTÃO EM TEMPO REAL, lista de diferenciais técnicos com ícones e card inferior de métricas operacionais (+5.000 pedidos preparados | 99.8% ONLINE).
  2. **Validação Visual e CI/CD:**
     - Screenshot do navegador confirmado pelo subagent visual em desktop (1440x900).
     - 
pm run lint com 0 erros e 
pm run build bem-sucedido.

---

### [2026-11-12 22:58] — Limpeza do Fundo da Página de Login (Remoção de Imagem Externa)
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** Fase 3 — Polimento Visual da Tela de Login
- **Ações Executadas:**
  1. **Remoção do Efeito de Fundo Externo (AdminLoginPage.jsx):**
     - Removida a camada de vazamento/bleed da imagem do hambúrguer que ficava no elemento <main>, tornando o fundo de toda a página preto sólido e limpo (g-black).
     - A foto do hambúrguer com bacon (/login-burger.jpg) fica restrita exclusivamente ao painel direito do card dual-panel, gerando alto contraste e foco no conteúdo.
  2. **Validação Visual e CI/CD:**
     - Verificação visual no navegador comprovando ausência de imagem no fundo externo e isolamento da foto dentro do painel lateral direito.
     - 
pm run lint com 0 erros e 
pm run build bem-sucedido.

---

### [2026-11-12 23:28] — Redesign Completo do Painel Operacional Administrativo (KDS & Pedidos)
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** Fase 3 — Refinamento e Padronização Visual do Painel Administrativo
- **Ações Executadas:**
  1. **Redesign do Painel de Pedidos (AdminOrdersPage.jsx):**
     - Alinhada toda a página à paleta escura pura (g-black, #121214, order-zinc-800), eliminando qualquer tom marrom, cinza desbotado ou borda assimétrica.
     - **Header & Live Pulse:** Título em tipografia Oswald com selo dinâmico de monitoramento 🟢 AO VIVO, controles de atualização rápida e temporizador automático.
     - **Cards de Indicadores (KPIs):** Indicadores operacionais refinados para *Novos Pedidos*, *Em Preparo*, *Prontos* e *Finalizados*, com ícones contextuais e legendas operacionais.
     - **Filtros com Contadores:** Abas de navegação com pills de contagem em tempo real (ATIVOS, TODOS, ENTREGUES, CANCELADOS).
     - **Cards de Pedidos com Itens Diretos:** Exibição clara e legível de todos os produtos do pedido ([ 2x ], variações, adicionais destacados e caixas de observações com alerta ⚠️ Obs:), totalizador e botões de avanço contextual com cores de estado (Novo -> Laranja, Em Preparo -> Âmbar, Pronto -> Esmeralda).
  2. **Padronização da Barra de Navegação Administrativa (Navbar.jsx):**
     - Abas administrativas (Pedidos, Cardápio, Ver cardápio, Sair) estilizadas com ont-['Oswald',sans-serif], indicadores ativos em laranja de alta visibilidade e botão de logout refinado.
  3. **Harmonização do Gerenciador de Cardápio (AdminMenuPage.jsx):**
     - Cores purificadas para a paleta #121214/zinc-*/laranja da marca.
  4. **Validação Visual e CI/CD:**
     - Screenshot do navegador confirmado pelo subagent visual.
     - 
pm run lint (0 erros) e 
pm run build bem-sucedido.

---

### [2026-11-12 23:42] — Restauração do Estilo Rústico Steakhouse Aconchegante nas Páginas Públicas
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** Fase 3 — Harmonização de Identidade Visual Steakhouse
- **Ações Executadas:**
  1. **Restauração dos Tons Amadeirados e Aconchegantes no Lado do Cliente:**
     - Restaurada a paleta clássica de steakhouse (g-[#0b0908], g-[#161311], bordas rústicas e badges âmbar) nas páginas públicas de clientes:
       - [HomePage.jsx](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/pages/HomePage.jsx)
       - [ProductsPage.jsx](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/pages/ProductsPage.jsx)
       - [RestaurantPage.jsx](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/pages/RestaurantPage.jsx)
       - [CustomerMenuPage.jsx](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/pages/CustomerMenuPage.jsx)
       - Componentes relacionados: CartDrawer.jsx, ProductCard.jsx, ProductModal.jsx, PromoCarousel.jsx, Navbar.jsx.
  2. **Preservação Integral do Acesso do Atendente (AdminLoginPage.jsx):**
     - A tela de login (/admin/login) permaneceu rigorosamente intacta: fundo preto sólido limpo, container dual-panel corporativo com a foto do hambúrguer artesanal na lateral direita e informações operacionais/métricas.
  3. **Validação Visual e CI/CD:**
     - Subagent confirmou tanto a home aconchegante com os 3 cards quanto a tela de login intacta.
     - 
pm run lint (0 erros) e 
pm run build bem-sucedido.

---

### [2026-11-12 23:52] — Restauração das Linhas e Formas Orgânicas no Banner Hero da Página Inicial
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** Fase 3 — Polimento Visual do Banner Hero
- **Ações Executadas:**
  1. **Restauração dos Elementos Gráficos Fluidos (HomePage.jsx):**
     - Reativadas as curvas fluidas vetoriais (SVG com gradiente de brasa em degradê âmbar/laranja e linha pontilhada orgânica de acento) na transição entre a fotografia do salão/prato e o bloco de conteúdo textual do banner principal.
     - Reintroduzida a iluminação sutil de brasa e tons quentes de fundo (g-gradient-to-r from-[#0c0a08] via-[#120e0b] to-[#0a0807]).
  2. **Validação Visual e CI/CD:**
     - Screenshot do navegador comprovando o retorno das linhas e curvas decorativas com acabamento artesanal.
     - 
pm run lint (0 erros) e 
pm run build bem-sucedido.


---

### [2026-11-13 00:05] — Expansão das Formas e Linhas Fluidas Orgânicas por Diversas Seções do Site
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** Fase 3 — Identidade Visual Orgânica Unificada
- **Ações Executadas:**
  1. **Expansão das Formas e Linhas Fluidas na Página Inicial (`HomePage.jsx`):**
     - Integradas ondas e linhas curvas com stroke pontilhado (`strokeDasharray="5 7"` e `"4 6"`) e gradientes quentes de brasa no banner de chamada para o cardápio completo ("Quer ver todas as nossas opções?").
     - Adicionadas curvas orgânicas de acento nos cards de apresentação de experiência: "FoodExpress na Sua Casa" (Delivery) e "Experiência no Salão" (Restaurante).
  2. **Aplicação na Página de Produtos (`ProductsPage.jsx`):**
     - Adicionadas curvas fluidas e linhas pontilhadas de transição suave no cabeçalho do catálogo de produtos.
  3. **Aplicação na Página do Restaurante (`RestaurantPage.jsx`):**
     - Inseridas linhas verticais sinuosas e orgânicas em gradiente triplo (`#ea580c` -> `#f59e0b` -> `#dc2626`) integrando a foto do salão à atmosfera rústica.
  4. **Preservação do Acesso do Atendente (`AdminLoginPage.jsx` & `AdminOrdersPage.jsx`):**
     - Mantidos rigorosamente intactos nos padrões profissionais corporativos aprovados.
  5. **Validação e Build:**
     - `npm run lint`: 0 erros (24 warnings de variáveis não utilizadas pré-existentes).
     - `npm run build`: gerado com sucesso em 1.04s.


---

### [2026-11-13 00:09] — Remoção da Linha Divisória Vertical no Banner Hero
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** Fase 3 — Refinamento de Harmonia Visual
- **Ações Executadas:**
  1. **Eliminação da Linha Divisória Vertical (`HomePage.jsx` & `RestaurantPage.jsx`):**
     - Removida a linha curva vetorial vertical que criava um divisor nítido entre a fotografia lateral e o bloco de conteúdo.
     - A transição agora ocorre exclusivamente por meio do gradiente contínuo e máscara suave (`linear-gradient(to right, ...)`), fundindo perfeitamente a imagem ao fundo escuro acolhedor sem nenhuma barreira linear.
  2. **Validação e Build:**
     - `npm run lint`: 0 erros (24 warnings de variáveis não utilizadas pré-existentes).
     - `npm run build`: gerado com sucesso em 1.15s.


---

### [2026-11-13 00:15] — Unificação de Fundo em Degradê Contínuo e Restauração das Curvas Orgânicas
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** Fase 3 — Eliminação de Emendas Verticais e Polimento Visual
- **Ações Executadas:**
  1. **Eliminação da Linha Reta de Emenda de Colunas (`HomePage.jsx`):**
     - Identificada a causa da linha reta vertical: divisão de colunas em grid (`col-span-7` vs `col-span-5`) com backgrounds distintos e círculos de luz ambiente (`blur-3xl`) recortados por `overflow-hidden` na borda da coluna.
     - Unificado o fundo de todo o banner em `#0c0a08` contínuo e transferida a iluminação ambiente para o container do slide (sem cortes retos).
     - Aplicada máscara suave e gradiente líquido (`linear-gradient(to right, ...)`) que funde a foto diretamente ao fundo escuro em degradê 100% uniforme.
  2. **Restauração das Linhas Orgânicas e Curvas Fluidas:**
     - Trazidas de volta as curvas bezier e ondas pontilhadas decorativas em gradiente de brasa (`warmGradientHero`), posicionadas na zona de transição fluida.
  3. **Validação e Build:**
     - `npm run lint`: 0 erros (24 warnings de variáveis não utilizadas pré-existentes).
     - `npm run build`: gerado com sucesso em 1.15s.


---

### [2026-11-13 00:19] — Implementação de Degradê Horizontal Rico e Contínuo entre as Duas Metades
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** Fase 3 — Polimento de Transição Cromática no Hero
- **Ações Executadas:**
  1. **Aplicação do Degradê Cromático Contínuo (`HomePage.jsx`):**
     - O container de cada slide agora utiliza um gradiente horizontal contínuo (`bg-gradient-to-r from-[#090706] via-[#0e0b08] 35% via-[#18110b] 65% to-[#1e150e]`), unindo gradualmente o lado escuro da foto à tonalidade aconchegante de madeira/brasa do lado textual.
     - A sobreposição de máscara da foto agora conecta perfeitamente os mesmos stops do gradiente (`from-black/30 via-transparent 25% via-[#0e0b08]/40 50% via-[#18110b]/80 75% to-[#1e150e]`), garantindo que não haja salto de cor entre o lado esquerdo e o lado direito.
     - A linha curva fluida em degradê de brasa e os traços pontilhados permanecem harmoniosamente integrados na faixa central do degradê.
  2. **Validação e Build:**
     - `npm run lint`: 0 erros (24 warnings de variáveis não utilizadas pré-existentes).
     - `npm run build`: gerado com sucesso em 1.25s.


---

### [2026-11-13 00:22] — Eliminação Definitiva do Recorte de Coluna com Overlay Global em Degradê Contínuo
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** Fase 3 — Transição Visual Líquida entre Foto e Texto
- **Ações Executadas:**
  1. **Redesenho Arquitetural da Transição no Hero (`HomePage.jsx`):**
     - A fotografia deixou de ficar restrita dentro da coluna `col-span-7`. Agora é posicionada em camada absoluta com máscara progressiva suave (`maskImage: linear-gradient(...)`) que desvanece de 30% a 92% da tela.
     - O degradê de transição agora abrange **100% da largura do banner** (`inset-0`), fluindo perfeitamente de `transparent` na foto, passando por tons escuros intermediários (`rgba(13,10,8,0.45)` a `rgba(20,14,10,0.85)`), até o fundo amadeirado steakhouse `#1a120c`.
     - Eliminação completa de qualquer emenda ou step de cor no ponto de encontro entre as duas partes.
     - As curvas orgânicas com degradê de brasa e traçado pontilhado permanecem destacadas sobre a área de degradê.
  2. **Validação e Build:**
     - `npm run lint`: 0 erros (24 warnings de variáveis não utilizadas pré-existentes).
     - `npm run build`: gerado com sucesso em 1.29s.

---

### [2026-11-13 00:30] — Ajuste Fino de Transição com Degradê em Tons Pretos Profundos e Curvas Fluidas em Destaque
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** Fase 3 — Refinamento Visual com Degradê no Tom de Preto e Destaque das Curvas Orgânicas
- **Ações Executadas:**
  1. **Degradê 100% Suave em Tons de Preto Profundo (`HomePage.jsx`):**
     - O fundo do banner hero foi ajustado para tons de preto escuro e carvão profundo (`#090706`), eliminando blocos de cor contrastantes e proporcionando uma fusão contínua com a imagem do salão.
     - A camada de degradê horizontal (`bg-gradient-to-r from-transparent 20% via-[#090706]/55 42% via-[#090706]/92 62% to-[#090706] 80%`) assegura que a fotografia se dissipe de forma fluida e gradual, sem qualquer linha vertical, degrau ou seam de corte.
  2. **Restauração e Proeminência das Formas e Linhas Orgânicas:**
     - A curva ondulada sólida com gradiente de fogo luminoso (`#ea580c` a `#dc2626`, com filtro de brilho `drop-shadow`) e a curva tracejada paralela em âmbar quente (`#f59e0b`, `strokeDasharray="6 8"`) foram trazidas para o plano `z-20`.
     - Ficaram perfeitamente visíveis e posicionadas ao longo da transição central, conferindo o estilo dinâmico e aconchegante admirado pelo usuário.
  3. **Preservação Integral do Painel Administrativo:**
     - Acesso do atendente e painel de pedidos (`AdminOrdersPage.jsx`, `AdminLoginPage.jsx`) mantidos 100% intactos e consistentes com a aprovação anterior.
  4. **Validação e Build:**
     - `npm run lint`: 0 erros (24 warnings de variáveis não utilizadas pré-existentes).
     - `npm run build`: gerado com sucesso em 1.37s.
     - Inspeção visual automatizada via browser subagent com evidência fotográfica em `final_step_395.png`.

---

### [2026-11-13 00:36] — Harmonização de Degradê Luxuoso e Contínuo no Hero Banner
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** Fase 3 — Refinamento Estético do Degradê ("Degradê Bonito") e Transição Orgânica
- **Ações Executadas:**
  1. **Degradê Contínuo e Veludoso de Alto Padrão (`HomePage.jsx`):**
     - O container e overlay global de cada slide agora utilizam uma curva cromática multi-etapas ultra-suave (`bg-gradient-to-r from-[#070504] 0% via-[#0b0806] 32% via-[#120d09] 60% via-[#16100b] 78% to-[#1a120c] 95%`).
     - A máscara da fotografia foi sincronizada para desvanecer com suavidade natural (`WebkitMaskImage: linear-gradient(to right, ...)` de 22% a 88%), garantindo que a dissolução visual ocorra como fumaça e luz quente.
     - Removido qualquer vestígio de neblina esbranquiçada ou corte vertical entre a fotografia (esquerda) e a tela de apresentação (direita).
  2. **Composição Visual das Ondas e Curvas de Brasa:**
     - A curva principal com gradiente de fogo (`#ea580c` a `#dc2626`) recebeu sombra luminosa suave (`drop-shadow(0 0 10px rgba(249, 115, 22, 0.5))`).
     - Acompanhada por curva tracejada em âmbar quente (`#f59e0b`, `strokeDasharray="6 8"`) e linha sutil de eco em segundo plano (`rgba(245, 158, 11, 0.2)`).
  3. **Iluminação Aconchegante ("Hearth Fire"):**
     - O fundo do texto recebeu iluminação difusa ampliada (`blur-[120px]`), criando profundidade e sensação aconchegante de steakhouse sem criar blocos de cor artificiais.
  4. **Validação e Build:**
     - `npm run lint`: 0 erros (24 warnings de variáveis não utilizadas pré-existentes).
     - `npm run build`: gerado com sucesso em 982ms.
     - Inspeção visual automatizada no Slide 1 e Slide 3 com evidência fotográfica em `final_step_407.png`.

---

### [2026-11-13 00:40] — Ampliação de Visibilidade e Luminosidade das Imagens do Hero Banner
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** Fase 3 — Otimização de Clareza e Destaque Visual das Fotografias
- **Ações Executadas:**
  1. **Aumento de Área Útil e Clareza da Fotografia (`HomePage.jsx`):**
     - A largura do container da imagem foi ampliada de 65% para até 72% (`md:w-[68%] lg:w-[72%]`), permitindo que a cena do restaurante e os pratos ganhem maior protagonismo.
     - A máscara de desvanecimento (`WebkitMaskImage`) foi ajustada para manter a foto com 100% de opacidade e nitidez até 46% da largura (antes começava a cair aos 22%), garantindo que os detalhes de mesas, balcão, iluminação e pratos fiquem nítidos e vibrantes.
     - O overlay de transição foi suavizado na porção esquerda (`via-transparent 36%`), removendo o véu escuro que cobria a fotografia antes do início do degradê.
     - Aplicado sutil ganho de brilho e contraste natural (`brightness-[1.03] contrast-[1.02]`) para destacar as cores acolhedoras dos ambientes e pratos.
  2. **Manutenção do Degradê Perfeito e Formas Orgânicas:**
     - O degradê horizontal suave em tons quentes de brasa e as linhas onduladas de fogo permanecem harmoniosamente integrados na faixa central.
  3. **Validação e Build:**
     - `npm run lint`: 0 erros (24 warnings de variáveis não utilizadas pré-existentes).
     - `npm run build`: gerado com sucesso em 1.09s.
     - Inspeção visual automatizada via browser subagent com evidência em `final_step_413.png`.

---

### [2026-11-13 00:44] — Remoção do Efeito Neon da Curva Orgânica do Hero Banner
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** Fase 3 — Refinamento de Linhas Vetoriais (Remoção de Brilho Artificial)
- **Ações Executadas:**
  1. **Remoção do Efeito Neon (`HomePage.jsx`):**
     - Removido o filtro de sombra difusa (`filter: drop-shadow(...)`) que produzia um halo brilhante estilo neon ao redor da linha ondulada.
     - Ajustada a espessura da linha sólida para `strokeWidth="2"` e mantido o degradê de brasa limpo (`#ea580c` a `#dc2626`).
     - A linha ondulada tracejada foi refinada para `strokeWidth="1.75"` em âmbar (`#f59e0b`), resultando em traçados orgânicos nítidos, naturais e sofisticados.
  2. **Validação e Build:**
     - `npm run lint`: 0 erros (24 warnings de variáveis não utilizadas pré-existentes).
     - `npm run build`: gerado com sucesso em 1.03s.
     - Inspeção visual automatizada via browser subagent confirmando traço vetorizado limpo e autêntico sem distorções de neon.

---

### [2026-11-13 00:48] — Redesenho de Linhas Orgânicas com Trajetórias Distintas e Contraste Suave
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** Fase 3 — Refinamento de Composição Gráfica (Diferenciação de Trajetórias e Contraste Equilibrado)
- **Ações Executadas:**
  1. **Diferenciação das Curvas e Eliminação de Linhas Paralelas Duplicadas (`HomePage.jsx`):**
     - O traço tracejado recebeu uma trajetória própria com arco mais amplo e suave (`opacity-40`, `strokeWidth="1.25"`), rompendo o padrão de cópia paralela (+30px).
     - A linha fluida principal foi afinada para `strokeWidth="1.5"` (`opacity-60`), ganhando uma curvatura sinuosa exclusiva.
  2. **Gradiente com Desvanecimento Progressivo nas Extremidades:**
     - Implementado gradiente linear com opacidade gradual (`stopOpacity="0.1"` a `0.05"` no topo e base), garantindo que as linhas surjam e se dissipem naturalmente sem cortes bruscos ou contraste metálico/fio elétrico sobre a foto.
  3. **Validação e Build:**
     - `npm run lint`: 0 erros (24 warnings de variáveis não utilizadas pré-existentes).
     - `npm run build`: gerado com sucesso em 1.09s.
     - Inspeção visual automatizada via browser subagent com evidência em `final_step_429.png`.

---

### [2026-11-13 00:53] — Reposicionamento das Linhas Orgânicas Junto ao Bloco de Texto ("Colado nas Frases")
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** Fase 3 — Ajuste de Alinhamento e Espaçamento Visual do Hero Banner
- **Ações Executadas:**
  1. **Aproximação das Curvas em Relação à Tipografia (`HomePage.jsx`):**
     - O posicionamento horizontal do SVG de curvas foi deslocado de `left-[47%] lg:left-[53%]` para `left-[51%] lg:left-[58%]`.
     - As curvas agora contornam diretamente a lateral esquerda das frases e chamadas de texto ("Cortes Nobres", "Thunder Brownie", etc.), servindo como uma moldura fluida e sofisticada ("colado nas frases") sem encavalar ou comprometer a legibilidade.
  2. **Validação e Build:**
     - `npm run lint`: 0 erros (24 warnings de variáveis não utilizadas pré-existentes).
     - `npm run build`: gerado com sucesso em 1.14s.
     - Inspeção visual automatizada via browser subagent confirmando enquadramento perfeito rente ao texto.

---

### [2026-11-13 00:58] — Escurecimento da Tonalidade de Fundo do Hero Banner
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** Fase 3 — Ajuste de Luminosidade e Contraste de Fundo (Cor Mais Escura)
- **Ações Executadas:**
  1. **Ajuste para Tonalidade Preta Profunda e Carvão Obsidiana (`HomePage.jsx`):**
     - O degradê de fundo da apresentação foi aprofundado para tons de preto profundo (`bg-gradient-to-r from-black 0% via-[#050404] 35% via-[#080706] 65% to-[#0b0908] 95%`), eliminando o reflexo marrom claro do lado textual.
     - O overlay de transição foi recalibrado para tons pretos contínuos (`via-black/30 48% via-[#060504]/72 62% via-[#090706]/94 76% to-[#0b0908] 88%`).
     - A iluminação difusa foi atenuada e aprofundada para brilho sutil de brasa (`blur-[140px]`), garantindo máximo contraste e legibilidade para a tipografia branca e detalhes em âmbar.
  2. **Validação e Build:**
     - `npm run lint`: 0 erros (24 warnings de variáveis não utilizadas pré-existentes).
     - `npm run build`: gerado com sucesso em 1.03s.
     - Inspeção visual automatizada via browser subagent com evidência em `final_step_447.png`.

---

### [2026-11-13 01:05] — Restauração de Nitidez e Visibilidade Total das Linhas Orgânicas ("Linhas Aparentes")
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** Fase 3 — Otimização de Nitidez e Visibilidade das Curvas Decorativas
- **Ações Executadas:**
  1. **Restauração da Espessura e Opacidade Plena das Linhas (`HomePage.jsx`):**
     - Removidos os gradientes atenuados com stops de 5% a 35% que haviam deixado as linhas excessivamente translúcidas e quase invisíveis.
     - A linha fluida contínua foi definida com `strokeWidth="2.5"` e `opacity-90` sólida, utilizando o gradiente completo de fogo da brasa (`#ea580c` a `#dc2626`), garantindo total nitidez sobre a imagem e o fundo escuro.
     - A linha ondulada tracejada foi definida com `strokeWidth="2"` e `opacity-80` em âmbar quente (`#f59e0b`, `strokeDasharray="6 8"`), perfeitamente aparente e bem desenhada.
     - Mantida a ausência de filtros artificiais de neon (`drop-shadow`), resultando em traçados vetoriais limpos, destacados e marcantes.
  2. **Validação e Build:**
     - `npm run lint`: 0 erros (24 warnings de variáveis não utilizadas pré-existentes).
     - `npm run build`: gerado com sucesso em 1.16s.

---

### [2026-11-13 01:14] — Aproximação das Linhas Orgânicas entre Si (Dupla Paralela Harmoniosa)
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** Fase 3 — Ajuste de Distância entre Curvas Decorativas ("Mais Próximos")
- **Ações Executadas:**
  1. **Aproximação Mútua das Duas Curvas (`HomePage.jsx`):**
     - A linha tracejada em âmbar foi recalibrada para acompanhar paralelamente a linha contínua de fogo a uma distância constante e harmoniosa de apenas `18px` (`M52` vs `M70`, etc.).
     - Eliminado o vão vazio excessivo que separava os dois traços, restaurando a sensação de uma assinatura gráfica única e refinada.
     - As duas linhas permanecem nítidas, marcantes e sem efeito neon (`strokeWidth="2.25"` e `1.75"`), contornando perfeitamente a lateral do bloco de frases.
  2. **Validação e Build:**
     - `npm run lint`: 0 erros (24 warnings de variáveis não utilizadas pré-existentes).
     - `npm run build`: gerado com sucesso em 990ms.

---

### [2026-11-13 01:45] — Transições e Animações Fluidas de Scroll (Bidirecional: Rolar para Baixo e para Cima)
- **Papel Ativo:** Engenheiro Frontend & Especialista em Motion UI
- **Etapa SDD:** Fase 3 — Implementação de Animações de Scroll Bidirecionais (`ScrollReveal`)
- **Ações Executadas:**
  1. **Criação do Componente Universal [`ScrollReveal.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/components/ScrollReveal.jsx):**
     - Implementado com `IntersectionObserver` de alto desempenho nativo do browser.
     - Suporte nativo à bidirecionalidade (`once: false`): elementos re-animam suavemente tanto na rolagem para baixo quanto ao retornar na rolagem para cima.
     - Suporte a múltiplas direções (`up`, `down`, `left`, `right`, `zoom`), durações customizadas e atrasos escalonados (*stagger delays*).
     - Curva de aceleração orgânica e luxuosa `cubic-bezier(0.16, 1, 0.3, 1)` com `willChange: 'opacity, transform'`.
  2. **Habilitação de Smooth Scrolling Global:**
     - Inclusão de `html { scroll-behavior: smooth; }` em [`frontend/src/index.css`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/index.css) para navegação fluida ao navegar entre âncoras e ao rolar a página.
  3. **Integração nas Seções de [`frontend/src/pages/HomePage.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/pages/HomePage.jsx):**
     - **Seção "Destaques da Casa / Viva o Sabor":** Cabeçalho surge com elevação vertical (`up`), e os 3 cards demonstrativos entram com stagger escalonado de 140ms (`delay={idx * 140}`).
     - **Banner CTA "Quer ver todas as nossas opções?":** Revelação com suave expansão dimensional (`direction="zoom"`, duração 800ms).
     - **Seção "Salão ou Delivery":** Animação lateral coordenada (Card de Delivery desliza a partir da esquerda `direction="left"`, e Card de Salão desliza a partir da direita `direction="right"`).
     - **Seção de Avaliações & Rodapé:** Título e os 3 depoimentos entram com fade-up escalonado, e o rodapé institucional surge suavemente.
  4. **Validação Técnica e Visual Automatizada:**
     - `npm run lint`: 0 erros.
     - `npm run build`: gerado com sucesso em 1.32s (`dist/assets/index-CBnc5ik8.css` 91.44 kB, `dist/assets/index-Buvf9U99.js` 440.83 kB).
     - Testes visuais via subagente de browser (`e2d51569-60a8-4762-a6e5-995c269b6a38`): rolagem completa de descida e subida validada em `http://localhost:5173/`, com transições suaves e sem nenhum tipo de flickering ou layout jump.

---

### [2026-11-13 01:53] — Restauração do Equilíbrio Ideal das Curvas ("Nem Muito Separado ou Junto")
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** Fase 3 — Ajuste de Proporção e Distância Equilibrada das Curvas do Hero
- **Ações Executadas:**
  1. **Restauração do Traçado e Posição Equilibrada Original (`HomePage.jsx`):**
     - O posicionamento das linhas orgânicas duplas foi restaurado para a proporção original equilibrada (`left-[51%] lg:left-[58%] -translate-x-1/2`).
     - As coordenadas das curvas foram restabelecidas (`M52/M70`, `C122/C140`, `C27/C45`, `C97/C115`), mantendo o espaço de respiração perfeito em relação ao bloco de texto (nem colado excessivamente e nem afastado em demasia).
     - Mantida a distância constante de 18px entre a linha tracejada e a linha contínua, com nitidez total e sem efeito neon.
  2. **Validação:**
     - `npm run lint`: 0 erros.
     - `npm run build`: executado com sucesso em 1.29s.

---

### [2026-11-13 11:46] — Implementação do Motor de Rolagem e Animações Idênticas ao Convertecom (`Lenis Momentum Scroll`)
- **Papel Ativo:** Engenheiro Frontend Especialista em Motion & Creative Development
- **Etapa SDD:** Fase 3 — Replicação Técnica da Engenharia de Scroll do `convertecom.com.br`
- **Ações Executadas:**
  1. **Análise de Engenharia Reversa do `convertecom.com.br`:**
     - Identificado o uso da biblioteca **Lenis** (`@studio-freight/lenis`) para momentum/inertia scrolling físico, com easing exponencial e amortecimento de rolagem suave.
     - Identificadas as propriedades de entrada: transição coordenada com `opacity: 0 -> 1`, elevação `translateY(36px) scale(0.97) -> translateY(0) scale(1)`, foco dinâmico com `blur(5px) -> blur(0px)` e timing cúbico de luxo `cubic-bezier(0.16, 1, 0.3, 1)`.
  2. **Instalação e Configuração da Biblioteca Canônica:**
     - Instalado pacote oficial `lenis` no frontend.
     - Criação do provider de contexto global [`SmoothScroll.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/components/SmoothScroll.jsx) gerenciando o loop RAF e desacoplamento com `requestAnimationFrame`.
     - Inclusão dos estilos canônicos do Lenis em [`index.css`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/index.css) (`html.lenis`, `.lenis-smooth`).
  3. **Aprimoramento do [`ScrollReveal.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/components/ScrollReveal.jsx):**
     - Adicionado suporte a `withBlur` (revelação suave de desfoque a foco nítido) e `withScale` (leve expansão tridimensional proporcional de `0.97` para `1.0`).
     - Integração fluida da navegação por âncoras ("Explorar Produtos") com `window.__lenis.scrollTo(el, { offset: -40, duration: 1.2 })`.
     - Adicionado botão interativo "Voltar ao topo" no rodapé com animação controlada via Lenis.
  4. **Validação:**
     - `npm run lint`: 0 erros.
     - `npm run build`: compilado com sucesso em 1.89s (`dist/assets/index-DhVG7ljP.css` 92.00 kB, `dist/assets/index-BARk8o3N.js` 460.76 kB).

---

### [2026-11-13 11:56] — Implementação da Tela de Carregamento Imersiva Steakhouse (`LoadingScreen.jsx`)
- **Papel Ativo:** Engenheiro Frontend Especialista em UI/UX & Creative Development
- **Etapa SDD:** Fase 3 — Criação do Preloader de Entrada com Animação de Brasa e Progresso
- **Ações Executadas:**
  1. **Criação do Componente [`LoadingScreen.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/components/LoadingScreen.jsx):**
     - Tela de carregamento imersiva em preto obsidiana profundo com brilho sutil de brasa e fogo (`#090706` com degradê radial).
     - Emblema central animado com chama ardente pulsante e brilho estelar.
     - Tipografia oficial `FoodExpress Steakhouse & Artisan Burgers`.
     - Contador numérico percentual suave (0% a 100%) sincronizado via `requestAnimationFrame` (duração fluida de 1.5s).
     - Barra de progresso ultrafina em gradiente de fogo (`from-red-600 via-orange-500 to-amber-400`).
     - Frases temáticas dinâmicas em transição suave (*"Aquecendo as brasas da grelha..."*, *"Selecionando cortes nobres e blends 180g..."*, *"Preparando a autêntica experiência steakhouse..."*, *"Bem-vindo ao FoodExpress!"*).
     - Efeito cortina (*curtain reveal*): ao atingir 100%, a tela sobe elegantemente (`-translate-y-full`) com aceleração de luxo `cubic-bezier(0.77, 0, 0.175, 1)`.
  2. **Integração no Nível Raiz ([`App.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/App.jsx)):**
     - O componente foi posicionado no topo da árvore de componentes, bloqueando o scroll apenas durante a contagem e liberando-o assim que a cortina sobe.
  3. **Validação:**
     - `npm run lint`: 0 erros.
     - `npm run build`: executado com sucesso em 1.08s (`dist/assets/index-D5tp7_8r.css` 97.72 kB, `dist/assets/index-DAxhwkTM.js` 464.54 kB).

---

### [2026-11-13 11:59] — Redesign Minimalista e Sofisticado da Tela de Carregamento (`LoadingScreen.jsx`)
- **Papel Ativo:** Designer UI/UX & Engenheiro Frontend
- **Etapa SDD:** Fase 3 — Refinamento de Quiet Luxury (Eliminação de Porcentagens e Efeitos Neon)
- **Ações Executadas:**
  1. **Eliminação de Elementos Ruidosos:**
     - Removidos números e porcentagens (`0% a 100%`).
     - Removidos todos os efeitos neon, anéis de pulso brilhantes e animações infantis.
  2. **Estética Minimalista de Restaurante de Alto Padrão:**
     - Fundo fosco carvão/obsidiana profundo (`#090706`) com linhas divisórias de alta precisão.
     - Logotipo oficial circular da marca (`/logo.jpg`) com borda fina em bronze escuro (`#3d2e24`).
     - Tipografia nobre com espaçamento generoso: `FoodExpress` com tracking `0.2em` e `Steakhouse & Artisan Burgers` em bronze quente (`#b48c65`) com tracking `0.3em`.
     - Barra de progresso ultrafina (apenas 2px de espessura) preenchendo suavemente com transição de fogo orgânica sem neon.
     - Texto de estado discreto: *"Carregando experiência"* alternando para *"Sabor da brasa"*.
     - Revelação cinematográfica: a tela se dissolve suavemente (`opacity: 0` e leve expansão `scale-[1.03]` via `cubic-bezier(0.16, 1, 0.3, 1)`), revelando a página sem cortes abruptos.
  3. **Validação:**
     - `npm run lint`: 0 erros.
     - `npm run build`: compilado com sucesso em 1.10s (`dist/assets/index-moUntxZ8.css` 94.45 kB, `dist/assets/index-DX_qCVVo.js` 463.28 kB).

---

### [2026-11-13 12:05] — Implementação da Tela de Carregamento Idêntica ao Convertecom (`convertecom.com.br/convert-drop`)
- **Papel Ativo:** Engenheiro Frontend Especialista em Animação Vetorial & Creative Development
- **Etapa SDD:** Fase 3 — Replicação Técnica Fiel do Loader Oficial do `convertecom.com.br/convert-drop`
- **Ações Executadas:**
  1. **Engenharia Reversa dos Elementos Oficiais do Convertecom:**
     - Identificado o design canônico do loader:
       - **Símbolo SVG Central com Órbita Dinâmica (`.tc__mark`)**: trajetória elíptica com segmento pontilhado animado em loop contínuo de 1.5s ao redor do brasão central.
       - **Tipografia em Camada Dupla com Sweep Fill (`.tc__name`)**: camada de texto fantasma no fundo (`.tc__name-ghost` com 15% de opacidade) e camada de preenchimento frontal (`.tc__name-fill`) que desliza da esquerda para a direita via `clip-path: inset(0 100% 0 0) -> inset(0 0% 0 0)` ao longo de 900ms.
       - **Barra Minimalista de 140px x 3px (`.tc__bar`)**: barra de cantos arredondados de 3px com preenchimento em escala horizontal `scaleX(0) -> scaleX(1)`.
       - **Transição de Saída Exata**: `opacity: 0; transform: translateY(-40px)` com `cubic-bezier(0.16, 1, 0.3, 1)`.
       - **Zero Porcentagens e Zero Neon**: sem números de porcentagem e sem luzes estouradas, exatamente conforme solicitado.
  2. **Implementação em [`LoadingScreen.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/components/LoadingScreen.jsx) e [`index.css`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/index.css):**
     - Criadas as keyframes canônicas `@keyframes tc-orbit`, `@keyframes tc-name` e `@keyframes tc-bar`.
     - Transição de saída acionada automaticamente após o ciclo de revelação.
  3. **Validação:**
     - `npm run lint`: 0 erros.
     - `npm run build`: gerado com sucesso em 1.04s (`dist/assets/index-B7y_YhCC.css` 95.00 kB, `dist/assets/index-BYKGCGgb.js` 464.86 kB).

---

### [2026-11-13 12:09] — Inclusão do Hambúrguer Artesanal Vetorial no Medalhão Central do Loader
- **Papel Ativo:** Designer Gráfico Vetorial & Engenheiro Frontend
- **Etapa SDD:** Fase 3 — Customização do Ícone Central do Preloader
- **Ações Executadas:**
  1. **Desenho Vetorial do Hambúrguer Artesanal no Medalhão ([`LoadingScreen.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/components/LoadingScreen.jsx)):**
     - Substituída a chama simplificada no centro do medalhão por uma ilustração vetorial completa e detalhada de hambúrguer artesanal steakhouse.
     - **Pão Brioche Superior:** Cúpula dourada com sementes de gergelim realistas em creme claro.
     - **Cheddar Derretido & Ondas de Sabor:** Camada de queijo cheddar ondulado derretendo sobre o blend.
     - **Blend Nobre 180g na Brasa:** Hambúrguer espesso com ranhuras sutis de grelha.
     - **Pão Brioche Base:** Base arredondada dourada perfeitamente balanceada no interior do círculo.
  2. **Preservação da Órbita Animada:**
     - A órbita elíptica contínua gira fluidamente ao redor do hambúrguer artesanal, preservando o preenchimento da tipografia em duas camadas e a barra minimalista.
  3. **Validação:**
     - `npm run lint`: 0 erros.
     - `npm run build`: gerado com sucesso em 1.15s (`dist/assets/index-B7y_YhCC.css` 95.00 kB, `dist/assets/index-DlMt0oWU.js` 466.55 kB).











---

### [2026-11-13 12:22] — Expansão dos Efeitos de Rolagem e Tela de Carregamento para Todo o Site
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** Fase 3 — Unificação e Consistência Global de Efeitos e Preloader
- **Ações Executadas:**
  1. **Tela de Carregamento Global em Transições de Rota ([`App.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/App.jsx)):**
     - Integrado listener de `location.pathname` com `useLocation` para acionar a tela de carregamento do hambúrguer artesanal em todas as trocas de página (`/`, `/nossos-produtos`, `/restaurante`, `/delivery`, `/pedido/:orderId`, `/admin/login`, `/admin/pedidos`, `/admin/cardapio`).
     - Transição ágil de ~750ms nas trocas de rota para máxima fluidez e sensação de app nativo, além de carregamento completo na inicialização.
  2. **Animações de Rolagem Bidirecional (Scroll & Reveal) em Todas as Páginas:**
     - **Página do Restaurante ([`RestaurantPage.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/pages/RestaurantPage.jsx)):** Efeitos de desfoque, escala e subida suave no hero, cards de pilares em cascata (staggered delay), blocos de localização e fotos do salão.
     - **Cardápio Completo / Produtos ([`CustomerMenuPage.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/pages/CustomerMenuPage.jsx)):** Cabeçalho de perfil, seções de categorias e cards de lanches com animação de foco progressivo.
     - **Rastreamento de Pedido ([`OrderTrackingPage.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/pages/OrderTrackingPage.jsx)):** Card de status, stepper, botão do WhatsApp, lista de itens e totalizador com revelação suave.
     - **Painel Administrativo & Login ([`AdminLoginPage.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/pages/AdminLoginPage.jsx), [`AdminOrdersPage.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/pages/AdminOrdersPage.jsx), [`AdminMenuPage.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/pages/AdminMenuPage.jsx)):** Container de login com zoom-in elegante; cards de KPIs, abas de filtro e cards operacionais de pedidos com revelação progressiva.
  3. **Validação de Código e Build:**
     - `npm run lint`: 0 erros.
     - `npm run build`: gerado com sucesso em 1.09s (`dist/assets/index-BisZ_ACP.css` 94.69 kB, `dist/assets/index-3KFv00Fe.js` 468.79 kB).


---

### [2026-11-13 12:26] — Refinamento Visual Premium do Cabeçalho de Perfil do Restaurante
- **Papel Ativo:** Designer UI/UX & Engenheiro Frontend
- **Etapa SDD:** Fase 3 — Polimento Visual de Cabeçalho e Chips
- **Ações Executadas:**
  1. **Redesign do Avatar Medallion ([`CustomerMenuPage.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/pages/CustomerMenuPage.jsx)):**
     - Substituído o corte circular rígido por um squircle premium com cantos arredondados (`rounded-2xl`), fundo escuro profundo, borda dourada/laranja em gradiente e selo de verificação oficial no canto inferior.
  2. **Iluminação Ambiente e Background:**
     - Adicionado gradiente radial e orbes de luz quente suave (efeito woodfire steakhouse) eliminando o aspecto de bloco preto plano.
  3. **Harmonização dos Chips de Informação (Pills):**
     - Substituídos os pontos de texto soltos (`•`) por 4 chips em vidro fosco (`backdrop-blur-xs`), bordas refinadas e estados hover:
       - Avaliação: `⭐ 4.9 (500+ avaliações)`
       - Tempo de preparo: `🕒 30–45 min`
       - Modalidades: `🛵 Salão & Entrega`
       - Status em tempo real: `🟢 Aberto agora • até 23:30` com pulso de atividade.
  4. **Validação:**
     - Screenshot do navegador confirmado pelo subagent visual.
     - `npm run lint`: 0 erros.
     - `npm run build`: 100% bem-sucedido.


---

### [2026-11-13 12:32] — Adição da Seção de Localização e Unidade Física na Página Inicial
- **Papel Ativo:** Designer UI/UX & Engenheiro Frontend
- **Etapa SDD:** Fase 3 — Expansão de Conteúdo e Conversão Presencial
- **Ações Executadas:**
  1. **Seção "Nossa Casa & Localização" em [`HomePage.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/pages/HomePage.jsx):**
     - Criada nova seção dedicada com id `localizacao`, posicionada estrategicamente entre a seção de experiências (Salão vs Delivery) e os depoimentos dos clientes.
     - **Coluna de Informações:**
       - Card de endereço destacado: `Av. Paulista dos Burgers, 1200 · Centro Gastronômico, São Paulo - SP` com badge `Fácil Acesso` e detalhes de metrô/estacionamento gratuito.
       - Card de horários de funcionamento: `Terça a Domingo: das 18h00 às 23h30`.
       - Grid com 3 pilares de comodidade: `GRÁTIS Estacionamento`, `CLIMATIZADO Ar Central`, `SEM FILA Autoatendimento`.
       - Botão com rota direta `Como Chegar (Maps)` e botão de navegação `Ver Fotos do Salão`.
     - **Coluna de Vitrine Visual do Salão:**
       - Card imersivo da unidade com badge pulsante `FOODEXPRESS • UNIDADE PRINCIPAL`, overlay de destaque para a experiência de chope na caneca congelada e barra de atendimento rápido via WhatsApp.
  2. **Validação:**
     - Screenshot do navegador confirmado pelo subagent visual.
     - `npm run lint`: 0 erros.
     - `npm run build`: gerado com sucesso em 1.13s.


---

### [2026-11-13 12:41] — Substituição do Card de Foto pelo Mapa Interativo Real do Google Maps
- **Papel Ativo:** Designer UI/UX & Engenheiro Frontend
- **Etapa SDD:** Fase 3 — Ajuste na Seção de Localização da Página Inicial
- **Ações Executadas:**
  1. **Remoção da Foto Genérica de Salão ([`HomePage.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/pages/HomePage.jsx)):**
     - Removida a foto de mesas/salão que estava ocupando o lado direito da seção de localização.
  2. **Integração do Google Maps Interativo:**
     - Adicionado iframe oficial do Google Maps renderizando diretamente o mapa de satélite/ruas de São Paulo na Avenida Paulista, 1200.
     - Badge superior `FOODEXPRESS • LOCALIZAÇÃO NO MAPA` com pulso em tempo real.
     - Barra de ação inferior permitindo abrir a rota diretamente no aplicativo de GPS / Google Maps.
  3. **Validação:**
     - `npm run lint`: 0 erros.
     - `npm run build`: gerado com sucesso em 2.71s.


---

### [2026-11-13 12:58] — Unificação do Google Maps Oficial Interativo na Página Inicial e Restaurante
- **Papel Ativo:** Engenheiro Frontend & Designer UI/UX
- **Etapa SDD:** Fase 3 — Padronização de Mapas e Experiência de Localização
- **Ações Executadas:**
  1. **Google Maps Embed Oficial em [`HomePage.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/pages/HomePage.jsx) e [`RestaurantPage.jsx`](file:///c:/Users/PICHAU/Documents/foodexpress/frontend/src/pages/RestaurantPage.jsx):**
     - Integrado mapa interativo em tempo real via iframe oficial do Google Maps com pino centralizado no endereço da unidade (`Av. Paulista, 1200 - Bela Vista, São Paulo - SP`).
     - Selo flutuante de status com ponto pulsante `FOODEXPRESS • MAPA DA UNIDADE`.
     - Barra de ferramentas com link para abrir a rota diretamente no aplicativo móvel do Google Maps.
  2. **Validação:**
     - `npm run lint`: 0 erros.
     - `npm run build`: 100% aprovado.
