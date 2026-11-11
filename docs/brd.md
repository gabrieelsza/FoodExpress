# Business Requirement Document (BRD) — FoodExpress

> **Status:** Concluído no `/passo1` (Aguardando Aprovação do Usuário)
> **Versão:** 1.0.0
> **Última Atualização:** 2026-11-11

---

## 1. Resumo Executivo

O **FoodExpress** é um sistema de gerenciamento de pedidos projetado para lanchonetes e restaurantes de pequeno e médio porte que desejam eliminar comandas de papel, reduzir filas em horários de pico e acabar com a falta de padronização nos pedidos recebidos por aplicativos de mensagem, sem abrir mão de suas margens de lucro para plataformas terceirizadas.

O MVP contempla duas jornadas integradas:
1. **Autoatendimento do Cliente (Sem Cadastro):** Consulta de cardápio organizado por categorias, seleção de variações e adicionais, inclusão de observações por item, montagem de sacola com cálculo automático de valores, escolha entre **Consumo no local** (identificado pela mesa) ou **Entrega** (identificado pelo nome, com geração de resumo estruturado enviado para o aplicativo de mensagens do estabelecimento), acompanhamento de status em tempo real e possibilidade de cancelamento dentro da janela de tolerância de 5 minutos.
2. **Operação e Gestão pelo Atendente / Restaurante:** Área administrativa protegida por senha para manter o cardápio (categorias, produtos ativos/inativos, preços, fotos, variações e adicionais) e painel operacional de pedidos com atualização automática configurável (padrão de 5 minutos) e manual, permitindo avançar linearmente as etapas de preparo (`Recebido` → `Em preparo` → `Pronto` → `Entregue`) ou cancelar pedidos quando necessário.

---

## 2. Atores e Perfis de Acesso

| ID | Ator / Perfil | Descrição | Permissões Principais |
| :--- | :--- | :--- | :--- |
| `ACT-01` | **Cliente** | Consumidor final que realiza pedidos presencialmente (na mesa) ou remotamente (para entrega), sem necessidade de criação de conta ou login. | Visualizar cardápio de produtos ativos por categoria; selecionar variações, adicionais e observações; gerenciar sacola de compras; escolher modalidade (Consumo no local ou Entrega); informar número da mesa ou nome; enviar resumo ao aplicativo de mensagens (se Entrega); consultar status do próprio pedido; cancelar o pedido em até 5 minutos após a confirmação. |
| `ACT-02` | **Atendente / Restaurante** | Operador interno ou gestor do estabelecimento autenticado no painel administrativo. | Realizar login na área restrita; cadastrar, editar e ativar/inativar categorias, produtos, variações e adicionais; visualizar lista de pedidos ativos; acionar atualização manual ou configurar o intervalo de atualização automática do painel; avançar o status do pedido respeitando a ordem sequencial; cancelar qualquer pedido a qualquer momento sem necessidade de justificativa. |

---

## 3. Matriz de Requisitos Funcionais (RF)

| ID | Ref. Backlog | Módulo / Épico | Descrição do Requisito (User Story / Capacidade) | Prioridade (MoSCoW) | Regras de Negócio Associadas | Critérios de Aceite (BDD / Gherkin) | Status |
| :--- | :---: | :--- | :--- | :---: | :--- | :--- | :---: |
| `RF-001` | `US01` | Gestão de Cardápio | Como **restaurante (`ACT-02`)**, quero cadastrar, editar e listar categorias e produtos (nome, preço, descrição, foto e status ativo/inativo), para montar e manter o cardápio atualizado. | `Must` | `RN-001`, `RN-010` | **Dado** que o atendente está autenticado no painel administrativo<br>**Quando** preenche os dados de uma categoria ou produto com nome válido e preço maior que zero e confirma o cadastro<br>**Então** o item é salvo com sucesso e passa a compor a listagem administrativa.<br><br>**Dado** que o atendente tenta cadastrar um produto com preço igual ou menor que zero ou sem nome<br>**Quando** solicita o salvamento<br>**Então** o sistema impede a gravação e exibe alerta informando que o preço deve ser positivo e o nome é obrigatório. | `Especificado` |
| `RF-002` | `US02` | Cardápio do Cliente | Como **cliente (`ACT-01`)**, quero visualizar o cardápio organizado por categorias contendo apenas os produtos ativos, para escolher os itens que desejo consumir. | `Must` | `RN-001` | **Dado** que existem categorias com produtos ativos e produtos inativos cadastrados pelo restaurante<br>**Quando** o cliente acessa a tela pública do cardápio<br>**Então** o sistema exibe os produtos agrupados por suas categorias e oculta completamente qualquer produto marcado como inativo. | `Especificado` |
| `RF-003` | `US03` | Sacola de Compras | Como **cliente (`ACT-01`)**, quero adicionar itens à sacola, ajustar suas quantidades ou removê-los e visualizar o valor total atualizado, para montar meu pedido com clareza antes de finalizar. | `Must` | `RN-002`, `RN-011` | **Dado** que o cliente adicionou produtos à sacola<br>**Quando** aumenta ou diminui a quantidade de um item (ou inclui variações/adicionais)<br>**Então** o subtotal do item e o valor total da sacola são recalculados imediatamente.<br><br>**Dado** que um item na sacola possui quantidade igual a 1<br>**Quando** o cliente reduz a quantidade para zero ou aciona a remoção<br>**Então** o item é retirado da sacola e o total é atualizado. | `Especificado` |
| `RF-004` | `US04` | Personalização de Item | Como **cliente (`ACT-01`)**, quero incluir observações específicas em cada item do pedido (ex.: "sem cebola"), para solicitar ajustes no preparo à cozinha. | `Must` | `RN-002` | **Dado** que o cliente está adicionando ou editando um item na sacola<br>**Quando** digita uma instrução no campo de observação respeitando o limite máximo de 140 caracteres<br>**Então** a observação fica vinculada àquele item específico e é enviada junto ao pedido.<br><br>**Dado** que o cliente tenta inserir um texto que ultrapassa 140 caracteres<br>**Quando** digita no campo de observação<br>**Então** o sistema bloqueia caracteres excedentes e informa o limite permitido. | `Especificado` |
| `RF-005` | `US05` | Identificação do Cliente | Como **cliente (`ACT-01`)**, quero informar o número da minha mesa (quando consumo no local) ou o meu nome (quando entrega), para ser identificado sem precisar criar conta ou senha. | `Must` | `RN-003` | **Dado** que o cliente selecionou a modalidade "Consumo no local"<br>**Quando** tenta finalizar o pedido sem informar o número da mesa<br>**Então** o sistema bloqueia a finalização e solicita o preenchimento obrigatório da mesa.<br><br>**Dado** que o cliente selecionou a modalidade "Entrega"<br>**Quando** tenta finalizar o pedido sem informar seu nome<br>**Então** o sistema bloqueia a finalização e exige o preenchimento obrigatório do nome. | `Especificado` |
| `RF-006` | `US06` | Modalidade de Pedido | Como **cliente (`ACT-01`)**, quero escolher entre "Consumo no local" ou "Entrega" no fechamento da sacola, para receber o pedido da forma que preferir. | `Must` | `RN-003`, `RN-004`, `RN-005` | **Dado** que o cliente possui pelo menos um item na sacola<br>**Quando** alterna entre as opções "Consumo no local" e "Entrega"<br>**Então** o sistema adapta dinamicamente os campos de identificação exigidos (Mesa para local; Nome e dados de envio para entrega) e registra a modalidade escolhida junto ao pedido. | `Especificado` |
| `RF-007` | `US07` | Controle de Acesso | Como **atendente (`ACT-02`)**, quero realizar login com credenciais exclusivas no painel, para proteger a área administrativa e operacional contra acessos não autorizados. | `Must` | `RN-010` | **Dado** que um usuário não autenticado tenta acessar o painel de pedidos ou o cadastro de cardápio<br>**Quando** a página é requisitada<br>**Então** o sistema bloqueia o acesso e exige credenciais válidas na tela de login.<br><br>**Dado** que o atendente informa credenciais válidas<br>**Quando** confirma o login<br>**Então** o acesso às funções administrativas e operacionais é liberado. | `Especificado` |
| `RF-008` | `US08` | Canal de Entrega | Como **cliente com pedido de entrega (`ACT-01`)**, quero ser direcionado ao aplicativo de mensagens (WhatsApp) do restaurante com o resumo completo do pedido já preenchido após confirmar, para concluir o envio de informações de entrega sem erros de digitação. | `Must` | `RN-005` | **Dado** que o cliente escolheu "Entrega", preencheu seu nome e confirmou o pedido<br>**Quando** o pedido é registrado com status inicial "Recebido"<br>**Então** o sistema exibe a tela de confirmação e gera o acionamento direto para o WhatsApp contendo o código do pedido, nome do cliente, lista de itens com quantidades, variações, adicionais, observações e valor total formatados. | `Especificado` |
| `RF-009` | `US09` | Painel de Atendimento | Como **atendente (`ACT-02`)**, quero visualizar e ser notificado dos pedidos ativos no painel, contando com atualização automática a cada 5 minutos (com intervalo configurável) e botão de atualização manual, para acompanhar a entrada de demandas na cozinha. | `Must` | `RN-004`, `RN-009` | **Dado** que o atendente está com o painel aberto<br>**Quando** o intervalo configurado (padrão de 5 minutos) é atingido ou o atendente aciona o botão "Atualizar Agora"<br>**Então** a lista de pedidos ativos é sincronizada exibindo novos pedidos e destacando entradas com status "Recebido".<br><br>**Dado** que o atendente altera a configuração de tempo de atualização do painel<br>**Quando** salva o novo intervalo<br>**Então** o ciclo automático passa a respeitar a nova periodicidade definida. | `Especificado` |
| `RF-010` | `US10` | Gestão de Fluxo de Preparo | Como **atendente (`ACT-02`)**, quero alterar o status do pedido seguindo estritamente a sequência `Recebido` → `Em preparo` → `Pronto` → `Entregue`, para organizar a operação sem risco de pular etapas. | `Must` | `RN-006` | **Dado** que um pedido encontra-se no status "Recebido"<br>**Quando** o atendente avança o status<br>**Então** o único próximo estado permitido na progressão normal é "Em preparo" (e subsequentemente "Pronto" e "Entregue").<br><br>**Dado** que alguém tente alterar diretamente um pedido de "Recebido" para "Pronto" ou "Entregue", ou retroceder um pedido já "Entregue"<br>**Quando** a ação é submetida<br>**Então** o sistema recusa a transição e mantém o status íntegro. | `Especificado` |
| `RF-011` | `US11` | Cancelamento de Pedidos | Como **cliente (`ACT-01`)**, quero poder cancelar meu pedido em até 5 minutos após finalizá-lo; e como **atendente (`ACT-02`)**, quero poder cancelar qualquer pedido a qualquer momento sem justificativa, para lidar com desistências ou imprevistos operacionais. | `Must` | `RN-007`, `RN-008` | **Dado** que o cliente finalizou um pedido há menos de 5 minutos e o pedido ainda não foi finalizado/preparado<br>**Quando** visualiza a tela de acompanhamento e aciona a opção "Cancelar Pedido"<br>**Então** o pedido muda para o status "Cancelado" e sai da fila de preparo.<br><br>**Dado** que já se passaram mais de 5 minutos desde a criação do pedido<br>**Quando** o cliente visualiza a tela de acompanhamento<br>**Então** a opção de cancelamento fica oculta e qualquer tentativa de cancelamento pelo cliente é bloqueada.<br><br>**Dado** que o atendente está autenticado no painel<br>**Quando** aciona o cancelamento de um pedido ativo em qualquer instante<br>**Então** o pedido é imediatamente marcado como "Cancelado" sem exigir preenchimento de justificativa. | `Especificado` |
| `RF-012` | `US12` | Acompanhamento pelo Cliente | Como **cliente (`ACT-01`)**, quero consultar e acompanhar na tela o status atual do meu pedido (`Recebido`, `Em preparo`, `Pronto`, `Entregue` ou `Cancelado`), para saber exatamente quando minha refeição estará disponível. | `Must` | `RN-006`, `RN-007` | **Dado** que o cliente finalizou um pedido<br>**Quando** permanece na tela de acompanhamento ou consulta seu pedido<br>**Então** visualiza de forma clara a etapa atual em que o pedido se encontra, refletindo as mudanças realizadas pelo atendente. | `Especificado` |
| `RF-013` | `US13` | Variações e Adicionais | Como **restaurante (`ACT-02`)**, quero configurar variações (ex.: tamanho/ponto) e adicionais pagos (ex.: extra bacon) por produto, para que o cliente personalize seu item e o preço seja calculado corretamente. | `Should` | `RN-011` | **Dado** que um produto possui variações e adicionais cadastrados pelo restaurante<br>**Quando** o cliente seleciona uma variação e marca adicionais desejados antes de colocar na sacola<br>**Então** o preço unitário final do item soma automaticamente o valor da variação escolhida aos valores dos adicionais marcados. | `Especificado` |

---

## 4. Matriz de Regras de Negócio (RN)

| ID | Nome da Regra | Descrição Detalhada e Condições | Exceções / Casos de Borda | Impacto (RFs) |
| :--- | :--- | :--- | :--- | :--- |
| `RN-001` | **Estrutura e Visibilidade do Cardápio** | O cardápio é gerenciado exclusivamente pelo restaurante e estruturado em Categorias e Produtos. Cada produto deve conter nome, preço numérico positivo (> 0), descrição, foto e indicador de disponibilidade (ativo/inativo). Apenas produtos ativos são exibidos aos clientes. | Se um produto for inativado enquanto um cliente já o estiver com ele aberto na sacola antes de confirmar, o sistema deve validar se todos os itens continuam ativos no momento de registrar o pedido. | `RF-001`, `RF-002` |
| `RN-002` | **Observações por Item do Pedido** | Todo item adicionado à sacola aceita um campo opcional de texto livre para observações de preparo do cliente (ex.: "sem cebola", "maionese à parte"). O texto é limitado a no máximo **140 caracteres**. | Observações não podem alterar o valor financeiro do item; acréscimos que alteram preço devem ser feitos via Adicionais (`RN-011`). | `RF-003`, `RF-004` |
| `RN-003` | **Ausência de Cadastro e Identificação por Modalidade** | O cliente final não possui conta, login ou senha no sistema. A identificação obrigatória varia conforme a modalidade escolhida:<br>- **Consumo no local:** Número da mesa obrigatório.<br>- **Entrega:** Nome do cliente obrigatório (podendo incluir informações complementares de endereço para o resumo). | Caso o cliente alterne a modalidade antes de enviar o pedido, o sistema deve validar apenas o identificador exigido pela modalidade ativa no momento do envio. | `RF-005`, `RF-006` |
| `RN-004` | **Notificação de Pedidos no Painel** | Todos os pedidos confirmados (tanto de Consumo no local quanto de Entrega) entram imediatamente no painel do atendente com o status inicial `Recebido` e horário de registro gravado. | Caso o painel esteja aguardando o ciclo automático, o atendente pode forçar a leitura imediata via botão manual (`RN-009`). | `RF-006`, `RF-009` |
| `RN-005` | **Padronização e Encaminhamento para WhatsApp na Entrega** | Nos pedidos da modalidade **Entrega**, além do registro do pedido no sistema, o cliente deve ser encaminhado ao WhatsApp do estabelecimento com uma mensagem padronizada pré-preenchida contendo: identificador do pedido, nome do cliente, itens detalhados (quantidades, variações, adicionais, observações) e valor total. | Em pedidos de **Consumo no local**, o direcionamento para o WhatsApp não ocorre; o cliente vai direto para a tela de acompanhamento de status. | `RF-006`, `RF-008` |
| `RN-006` | **Progressão Linear Estrita de Status (Máquina de Estados)** | O ciclo de vida operacional do pedido segue obrigatoriamente a ordem sequencial:<br>`Recebido` → `Em preparo` → `Pronto` → `Entregue`.<br>Não é permitido pular etapas (ex.: ir de `Recebido` direto para `Pronto`) nem retroceder etapas concluídas. | A única saída fora da sequência linear é a transição para o estado final `Cancelado`, regida pelas regras `RN-007` e `RN-008`. | `RF-010`, `RF-012` |
| `RN-007` | **Janela de Cancelamento pelo Cliente (Regra dos 5 Minutos)** | O cliente pode cancelar seu próprio pedido apenas se o tempo decorrido desde a finalização for **menor ou igual a 5 minutos** (≤ 300 segundos) **e** o pedido ainda estiver em etapa inicial (`Recebido`). Após 5 minutos (ou se o preparo já tiver avançado), o botão de cancelamento deve ser ocultado para o cliente e qualquer tentativa deve ser recusada. | Se o cliente tentar acionar o cancelamento com a tela aberta exatamente após o 5º minuto vencer, a validação de tempo deve impedir o cancelamento e atualizar a visualização. | `RF-011`, `RF-012` |
| `RN-008` | **Cancelamento Irrestrito pelo Atendente** | O atendente autenticado pode cancelar qualquer pedido ativo a qualquer momento (independentemente do tempo decorrido ou de estar em `Recebido`, `Em preparo` ou `Pronto`), sem obrigatoriedade de informar justificativa. | Pedidos que já atingiram o estado final `Entregue` ou que já estão `Cancelados` não podem sofrer novas alterações de status. | `RF-010`, `RF-011` |
| `RN-009` | **Atualização Automática Configurável e Manual do Painel** | O painel do atendente deve atualizar a lista de pedidos automaticamente a cada **5 minutos** por padrão. O atendente pode alterar esse intervalo de tempo nas configurações da tela e também pode acionar um botão de atualização manual a qualquer instante. | O intervalo configurável deve exigir um valor mínimo positivo razoável para evitar sobrecarga de consultas sucessivas. | `RF-009` |
| `RN-010` | **Proteção da Área Administrativa** | Todas as ações de gestão do cardápio (criar/editar/excluir categorias, produtos, variações e adicionais) e operação da fila (listar todos os pedidos do restaurante, avançar status e cancelar como atendente) exigem que o operador esteja devidamente autenticado. | As credenciais de acesso dos operadores devem ser mantidas de forma segura e nunca expostas publicamente. | `RF-001`, `RF-007` |
| `RN-011` | **Cálculo de Preço com Variações e Adicionais** | Um produto pode possuir variações (que ajustam ou definem o valor base do item) e adicionais opcionais (que somam valores extras ao item). O valor unitário do item na sacola deve ser: `(Preço Base ou da Variação) + Soma(Adicionais selecionados)`, multiplicado pela quantidade escolhida. | A sacola não pode permitir confirmação de pedido com lista de itens vazia ou valor total igual ou menor que zero. | `RF-003`, `RF-013` |
| `RN-012` | **Exclusão de Pagamento no MVP** | O processamento financeiro de pagamentos (cartão, Pix integrado ou dinheiro com troco no sistema) não faz parte do MVP. A cobrança e a conferência de pagamento ocorrem fora do sistema (no caixa ou no ato da entrega). | O sistema deve exibir claramente o **Valor Total** do pedido na tela e no resumo de entrega para simples conferência financeira entre cliente e atendente. | `RF-003`, `RF-008` |

---

## 5. Matriz de Requisitos Não-Funcionais de Negócio (RNF)

| ID | Categoria | Descrição / Meta Mensurável (SLA, Usabilidade, Compliance) | Prioridade |
| :--- | :--- | :--- | :---: |
| `RNF-001` | **Usabilidade Mobile-First** | A interface destinada ao cliente final deve ser integralmente responsiva e adaptada para uso em telas de aparelhos celulares, garantindo navegação fluida por categorias, sacola e acompanhamento de pedido com apenas uma mão. | `Must` |
| `RNF-002` | **Segurança e Privacidade (LGPD)** | Senhas de atendentes devem ser armazenadas de maneira irreversível (protegidas contra leitura direta), rotas administrativas devem bloquear acessos não autenticados e a coleta de dados do cliente deve restringir-se ao mínimo indispensável para a entrega ou identificação da mesa. | `Must` |
| `RNF-003` | **Confiabilidade nas Regras Críticas** | As regras de negócio financeiras e operacionais — especificamente cálculo de total com variações/adicionais, visibilidade apenas de itens ativos, limite de observações, validação de mesa/nome, máquina de estados sem pulo de etapas e trava de cancelamento após 5 minutos — devem ser cobertas por verificações automatizadas antes de qualquer publicação. | `Must` |
| `RNF-004` | **Organização de Entrega por Sprints** | O escopo do MVP deve respeitar a divisão planejada em 2 Sprints equilibradas para uma equipe de 3 pessoas (Sprint 1 com foco em base do sistema, cardápio, sacola e criação do pedido; Sprint 2 com foco em resumo para WhatsApp, painel do atendente, fluxo de status, cancelamento e variações/adicionais). | `Must` |

---

## 6. Jornadas do Usuário (Fluxos Principais)

### 6.1. Jornada 1: Pedido Presencial (Consumo no Local)
1. O **Cliente (`ACT-01`)** senta-se à mesa do restaurante e abre o cardápio digital pelo celular.
2. Navega pelas categorias ativas, escolhe um lanche, seleciona a variação desejada (ex.: tamanho), marca adicionais (ex.: bacon extra) e escreve uma observação (ex.: "sem cebola").
3. Adiciona os itens à sacola, confere as quantidades e o valor total calculado.
4. Seleciona a modalidade **Consumo no local**, informa o **número da mesa** e confirma o pedido.
5. O pedido é registrado com status `Recebido`. O cliente passa a visualizar a tela de acompanhamento do status (com o botão de cancelar visível durante os primeiros 5 minutos).
6. O **Atendente (`ACT-02`)** visualiza o novo pedido no painel administrativo, inicia o preparo na cozinha e avança o status para `Em preparo`.
7. Quando o lanche fica pronto na cozinha, o atendente avança para `Pronto` e, ao levar até a mesa do cliente, finaliza como `Entregue`.

### 6.2. Jornada 2: Pedido para Entrega (Com Encaminhamento ao WhatsApp)
1. O **Cliente (`ACT-01`)** acessa o cardápio remotamente, monta sua sacola com os produtos desejados, variações, adicionais e observações.
2. No fechamento da sacola, escolhe a modalidade **Entrega** e preenche obrigatoriamente o seu **Nome** (e informações complementares de entrega).
3. Ao confirmar o pedido, o sistema grava o registro com status `Recebido`, apresenta a confirmação com link de acompanhamento e direciona o cliente para o **WhatsApp** do estabelecimento já com a mensagem padronizada preenchida contendo todos os itens e valores.
4. O cliente envia a mensagem pré-formatada no WhatsApp e acompanha pela tela do sistema a evolução linear dos status (`Recebido` → `Em preparo` → `Pronto` → `Entregue`) atualizados pelo atendente no painel.

### 6.3. Jornada 3: Cancelamento de Pedido (Cliente vs. Atendente)
1. **Pelo Cliente (Dentro de 5 minutos):** Após confirmar o pedido, o cliente percebe que cometeu um engano. Como ainda se passaram menos de 5 minutos e o pedido está como `Recebido`, ele aciona o botão "Cancelar Pedido". O pedido passa imediatamente para `Cancelado`.
2. **Pelo Cliente (Após 5 minutos):** Passados 5 minutos da confirmação, o botão de cancelamento deixa de ser exibido ao cliente. Caso deseje desistir, deverá falar diretamente com o estabelecimento.
3. **Pelo Atendente (A qualquer momento):** Caso ocorra falta repentina de insumo ou desistência comunicada pelo cliente, o atendente aciona a opção "Cancelar" diretamente no painel administrativo, encerrando o pedido como `Cancelado` sem necessidade de preencher justificativa.

---

## 7. Planejamento de Entregas do MVP (Rastreabilidade por Sprint)

### 7.1. Sprint 1 — Base do Sistema e Pedido do Cliente (28 Pontos)
| ID Backlog | RF Associado | História Resumida | Responsável Sugerido | Pontos |
| :---: | :---: | :--- | :---: | :---: |
| `US01` | `RF-001` | Cadastro administrativo de categorias e produtos do cardápio | Pessoa C | 5 |
| `US02` | `RF-002` | Visualização pública do cardápio por categoria (apenas ativos) | Pessoa B | 3 |
| `US03` | `RF-003` | Adição de itens à sacola, ajuste de quantidades e cálculo do total | Pessoa B | 5 |
| `US04` | `RF-004` | Inclusão de observações por item com limite de caracteres | Pessoa B | 2 |
| `US05` | `RF-005` | Identificação obrigatória por mesa (local) ou nome (entrega) | Pessoa C | 2 |
| `US06` | `RF-006` | Escolha e persistência do tipo de pedido (Consumo no local ou Entrega) | Pessoa A | 3 |
| `US07` | `RF-007` | Autenticação de atendente e proteção das rotas administrativas | Pessoa A | 5 |
| `T01` | `RNF-003` | Esteira de verificação automatizada de qualidade a cada entrega | Pessoa C | 3 |

### 7.2. Sprint 2 — Operação e Acompanhamento (27 Pontos)
| ID Backlog | RF Associado | História Resumida | Responsável Sugerido | Pontos |
| :---: | :---: | :--- | :---: | :---: |
| `US08` | `RF-008` | Montagem do resumo e direcionamento ao WhatsApp para pedidos de entrega | Pessoa B | 3 |
| `US09` | `RF-009` | Notificação de pedidos ativos no painel com atualização automática (5 min) e manual | Pessoa C | 5 |
| `US10` | `RF-010` | Alteração linear de status (`Recebido` → `Em preparo` → `Pronto` → `Entregue`) sem pulos | Pessoa A | 5 |
| `US11` | `RF-011` | Cancelamento em até 5 min pelo cliente e a qualquer momento pelo atendente | Pessoa A | 3 |
| `US12` | `RF-012` | Consulta e acompanhamento de status do pedido pelo cliente | Pessoa B | 3 |
| `US13` | `RF-013` | Cadastro e seleção de variações e adicionais por produto com cálculo no preço | Pessoa B *(ou Pessoa A)* | 5 |
| `T02` | `RNF-004` | Publicação automatizada após aprovação nas verificações de qualidade | Pessoa C | 3 |

---

## 8. Indicadores de Sucesso (KPIs) e Critérios de Pronto (Definition of Done)

### 8.1. Indicadores de Sucesso de Negócio (KPIs)
- **KPI 1 — Padronização na Entrega:** 100% dos pedidos da modalidade Entrega gerando texto padronizado completo (itens, quantidades, adicionais, observações e total) sem necessidade de redigitação pelo cliente no aplicativo de mensagens.
- **KPI 2 — Eliminação de Erros de Anotação:** Redução de falhas de comunicação entre salão/cliente e cozinha através do registro estruturado de variações, adicionais e observações por item.
- **KPI 3 — Integridade do Fluxo Operacional:** 0% de pedidos pulando etapas de preparo indevidamente ou sendo cancelados pelo cliente fora da janela de 5 minutos.

### 8.2. Critérios de Pronto do Negócio (Definition of Done — DoD)
- [ ] Todos os critérios de aceite (`RF-001` a `RF-013`) validados e demonstráveis nas revisões de Sprint.
- [ ] Senhas de operadores protegidas e área administrativa inacessível sem autenticação válida.
- [ ] Interface do cliente totalmente responsiva e funcional em dispositivos móveis (celulares).
- [ ] Regras críticas de preço, visibilidade de inativos, limite de observação, identificação por modalidade, máquina de estados e janela de 5 minutos de cancelamento integralmente validadas.
