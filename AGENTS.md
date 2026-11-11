# AGENTS.md — Governança Agêntica Universal (Vibe Coding Sensato & SDD)

Este repositório utiliza **Vibe Coding Sensato** e **Spec Driven Development (SDD)**.
A estrutura foi projetada para ser **100% agnóstica a ambientes e harnesses** (compatível nativamente com **Antigravity**, **Claude Code**, **Cursor** e **Codex**).

---

## 1. Fonte Única de Verdade (Contexto em `/docs/`)

Antes de realizar qualquer ação, todo agente deve consultar os arquivos de contexto do projeto:
- [`docs/contexto.md`](./docs/contexto.md) — Objetivo geral, personas, glossário e escopo (In/Out) do projeto.
- [`docs/arquitetura.md`](./docs/arquitetura.md) — Diretrizes gerais de tecnologia, stack e padrões de arquitetura.
- [`docs/brd.md`](./docs/brd.md) — Business Requirement Document (Requisitos Funcionais, Regras de Negócio e Critérios de Aceite).
- [`docs/trd.md`](./docs/trd.md) — Technical Requirement Document (Rastreabilidade técnica, Schema de Dados, Contratos de API e Plano de Execução).
- [`docs/sessao_agente.md`](./docs/sessao_agente.md) — Registro cronológico de decisões arquiteturais e de negócio tomadas pelo agente.

---

## 2. Regras de Ouro do Fluxo SDD (Guardrails)

1. **Proibição de Código Prematuro:** Nenhum código da aplicação deve ser gerado antes que o `docs/brd.md` (via `/passo1`) e o `docs/trd.md` (via `/passo2`) estejam preenchidos e aprovados pelo usuário.
2. **Isolamento de Papéis:** Cada etapa (`/passo1`, `/passo2`, `/passo3`) possui responsabilidades estritas e não deve invadir o escopo da próxima etapa sem aprovação explícita.
3. **Memória Persistente Obrigatória:** Ao concluir qualquer etapa relevante ou tomar decisões importantes, atualize sempre o arquivo [`docs/sessao_agente.md`](./docs/sessao_agente.md).

---

## 3. Mapeamento de Slash Commands e Skills Especializadas

Sempre que o usuário invocar um dos comandos abaixo no chat (`/passo1`, `/passo2` ou `/passo3`), assuma imediatamente o papel correspondente e carregue sua respectiva Skill:

| Comando | Papel Especializado | Definição da Skill (Canônica) | Artefatos Alvo |
| :--- | :--- | :--- | :--- |
| **`/passo1`** | **Analista de Sistemas Experiente** *(Foco exclusivo em levantamento de regras de negócio e geração do BRD)* | [`.agents/skills/passo1/SKILL.md`](./.agents/skills/passo1/SKILL.md) | `docs/contexto.md`, `docs/brd.md`, `docs/sessao_agente.md` |
| **`/passo2`** | **Profissional Técnico de Arquitetura** *(Foco exclusivo em viabilidade técnica, escolhas de stack e geração do TRD)* | [`.agents/skills/passo2/SKILL.md`](./.agents/skills/passo2/SKILL.md) | `docs/arquitetura.md`, `docs/trd.md`, `docs/sessao_agente.md` |
| **`/passo3`** | **Configuração de Ambiente e Codificação** *(Foco em criar ambiente de teste local, subir servidores e implementar código)* | [`.agents/skills/passo3/SKILL.md`](./.agents/skills/passo3/SKILL.md) | Código da aplicação, testes locais, `docs/trd.md`, `docs/sessao_agente.md` |

---

## 4. Compatibilidade Multi-Harness

- **Antigravity:** Descoberta automática via `AGENTS.md`, `GEMINI.md` e `.agents/skills/{passo1,passo2,passo3}/SKILL.md`.
- **Claude Code:** Descoberta automática via `CLAUDE.md` e comandos nativos em `.claude/commands/{passo1,passo2,passo3}.md`.
- **Cursor:** Descoberta automática via `AGENTS.md` e `.cursor/rules/sdd-workflow.mdc`.
- **OpenAI Codex:** Descoberta automática via `AGENTS.md` e `.agents/skills/`.
