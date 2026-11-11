# CLAUDE.md — FoodExpress (SDD & Vibe Coding Sensato)

Este projeto segue rigorosamente as diretrizes definidas em [`AGENTS.md`](./AGENTS.md).

## Instruções Obrigatórias
1. Leia [`AGENTS.md`](./AGENTS.md) e [`docs/sessao_agente.md`](./docs/sessao_agente.md) no início de cada tarefa.
2. Respeite o fluxo **Spec Driven Development (SDD)**:
   - `/passo1` -> Executa a skill em [`.agents/skills/passo1/SKILL.md`](./.agents/skills/passo1/SKILL.md) (Analista de Sistemas Experiente — foco em `docs/contexto.md` e `docs/brd.md`).
   - `/passo2` -> Executa a skill em [`.agents/skills/passo2/SKILL.md`](./.agents/skills/passo2/SKILL.md) (Profissional Técnico de Arquitetura — foco em `docs/arquitetura.md` e `docs/trd.md`).
   - `/passo3` -> Executa a skill em [`.agents/skills/passo3/SKILL.md`](./.agents/skills/passo3/SKILL.md) (Configuração de Ambiente e Codificação — foco em ambiente local, servidores e implementação guiada pelo TRD).
3. **Não gere código da aplicação** até que os passos `/passo1` e `/passo2` estejam concluídos e aprovados.
