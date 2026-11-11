# Contexto do Projeto — FoodExpress

> **Status:** Concluído no `/passo1` (Aguardando aprovação formal do usuário)
> **Metodologia:** Vibe Coding Sensato & Spec Driven Development (SDD)

---

## 1. Visão Geral e Objetivo

- **Problema a resolver:** Lanchonetes e restaurantes de pequeno e médio porte sofrem com perdas operacionais e financeiras decorrentes de anotações manuais em comandas de papel, lentidão no atendimento durante horários de pico, falta de padronização nas informações enviadas por clientes em pedidos de entrega via aplicativos de mensagem e redução das margens de lucro pelas altas taxas cobradas por plataformas terceirizadas.
- **Proposta de Valor:** Oferecer um canal digital próprio, ágil e padronizado que elimina erros de anotação em mesas e estrutura automaticamente os pedidos de entrega para envio direto ao aplicativo de mensagens do estabelecimento, mantendo o controle operacional em um painel centralizado para o atendente sem comissões de intermediários.
- **Objetivo Principal (MVP):** Entregar, ao longo de duas etapas de desenvolvimento (Sprints 1 e 2) para uma equipe de 3 pessoas, um sistema funcional de autoatendimento e gestão de pedidos que cubra o cadastro de cardápio com variações/adicionais, montagem de sacola com observações, pedidos para consumo no local (por mesa) e entrega (com resumo padronizado para aplicativo de mensagens), acompanhamento de status pelo cliente e painel administrativo com atualização automática e controle de fila.

---

## 2. Público-Alvo e Personas

| Persona / Papel | Necessidade Principal | Dores Atuais |
| :--- | :--- | :--- |
| **Cliente Final (`ACT-01`)** | Consultar o cardápio atualizado no celular, personalizar itens (variações, adicionais e observações), enviar o pedido rapidamente sem burocracia de cadastro e acompanhar o status do preparo. | Demora para ser atendido na mesa em horários de pico, erros na preparação do lanche por falhas de comunicação e lentidão ao digitar pedidos longos em aplicativos de mensagem. |
| **Atendente / Restaurante (`ACT-02`)** | Gerenciar categorias e produtos do cardápio (ativar/inativar, preços, variações e adicionais), receber alertas de novos pedidos em um painel organizado e avançar os status de preparo até a entrega. | Comandas de papel ilegíveis ou perdidas, mensagens despadronizadas e incompletas no atendimento de entrega, dificuldade de controlar a fila da cozinha e perda de margem para plataformas terceiras. |

---

## 3. Escopo do Projeto

### 3.1. Dentro do Escopo (In-Scope — MVP)
- [x] **Gestão de Cardápio (US01, US13):** Cadastro, edição, listagem e ativação/inativação de categorias e produtos (nome, preço, descrição, foto, variações e adicionais pagos).
- [x] **Cardápio Público e Sacola de Compras (US02, US03, US04):** Exibição de produtos ativos por categoria, adição/remoção de itens na sacola, ajuste de quantidades, cálculo automático do total e inclusão de observações por item (ex.: "sem cebola") com limite de caracteres.
- [x] **Modalidades de Pedido e Identificação Sem Cadastro (US05, US06):** Escolha entre **Consumo no local** (identificado obrigatoriamente pelo número da mesa) e **Entrega** (identificado obrigatoriamente pelo nome do cliente e dados de entrega).
- [x] **Encaminhamento Padronizado para Entrega (US08):** Geração automática de resumo formatado do pedido e direcionamento direto do cliente para o aplicativo de mensagens do restaurante após confirmação.
- [x] **Autenticação e Painel do Atendente (US07, US09):** Acesso restrito por credenciais para a área administrativa, visualização de pedidos ativos, atualização automática do painel a cada 5 minutos (com intervalo configurável) e botão de atualização imediata manual.
- [x] **Ciclo de Vida e Status do Pedido (US10, US12):** Controle estrito de progressão linear (`Recebido` → `Em preparo` → `Pronto` → `Entregue`), impedindo que etapas sejam puladas, com tela de acompanhamento para o cliente.
- [x] **Regras de Cancelamento de Pedido (US11):** Cancelamento pelo cliente permitido em até 5 minutos após a finalização (desde que o preparo não tenha sido concluído/iniciado indevidamente) e cancelamento pelo atendente permitido a qualquer momento, sem exigência de justificativa.

### 3.2. Fora do Escopo (Out-of-Scope — Pós-MVP)
- [ ] **Processamento de Pagamentos Online / Integração com Caixa:** Pagamentos financeiros e integrações com operadoras ou caixas ficam fora do MVP e serão tratados diretamente na entrega ou no caixa presencial.
- [ ] **Importação Automatizada de Cardápio:** Envio de arquivos externos para leitura e criação automática de produtos.
- [ ] **Cadastro e Login de Clientes Finais:** O cliente não cria conta nem senha no MVP.
- [ ] **Gestão de Entregadores / Rastreamento por Mapa:** O controle logístico de rota de entregadores não faz parte do MVP.

---

## 4. Premissas e Restrições de Negócio
- **Premissas Operacionais:**
  - O projeto é dimensionado para execução em 2 Sprints (Sprint 1: 28 pontos; Sprint 2: 27 pontos) por uma equipe de 3 integrantes (Pessoa A, Pessoa B e Pessoa C).
  - O estabelecimento possui um número de atendimento ativo em aplicativo de mensagens para recepcionar o resumo padronizado dos pedidos de entrega.
  - Clientes em atendimento presencial têm fácil visualização do número de sua mesa.
- **Restrições e Privacidade (LGPD):**
  - Coleta mínima de dados pessoais: como não há cadastro de clientes, apenas o nome (e informações de entrega, quando aplicável) é solicitado para identificação operacional do pedido.
  - A área de gestão de cardápio e fila de pedidos deve ser protegida por autenticação exclusiva dos colaboradores do estabelecimento.

---

## 5. Glossário de Domínio (Ubiquitous Language)
| Termo | Definição no Contexto do FoodExpress |
| :--- | :--- |
| **Pedido (`Order`)** | Solicitação formal de compra feita pelo cliente contendo um ou mais itens da sacola, modalidade de atendimento, identificação e valor total calculado. |
| **Consumo no Local** | Modalidade de pedido presencial em que o cliente consome no salão do estabelecimento e é identificado pelo número da mesa. |
| **Entrega (`Delivery`)** | Modalidade de pedido em que o cliente solicita o envio externo, identifica-se pelo nome e é direcionado ao aplicativo de mensagens com o resumo padronizado do pedido. |
| **Sacola** | Agrupamento temporário de produtos selecionados pelo cliente antes da confirmação final do pedido, permitindo ajuste de quantidades, variações, adicionais e observações. |
| **Variação** | Opção de escolha vinculada a um produto que define sua característica principal ou faixa de preço (ex.: Tamanho Pequeno, Médio ou Grande). |
| **Adicional** | Item complementar opcional que pode ser acrescentado a um produto mediante soma ao seu valor unitário (ex.: Bacon extra, Queijo extra). |
| **Observação do Item** | Texto curto informado pelo cliente (limitado a 140 caracteres) para instruir ajustes específicos no preparo daquele item (ex.: "sem cebola", "bem passado"). |
| **Ciclo de Status** | Sequência obrigatória e linear de etapas pelas quais todo pedido ativo passa: `Recebido` → `Em preparo` → `Pronto` → `Entregue` (ou `Cancelado`). |
