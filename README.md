# Catraca

Framework spec-driven instalável que aplica um método rigoroso de engenharia
(TDD + Clean Architecture + SOLID + Design Patterns) a projetos novos, guiando
um agente de código do prompt inicial à avaliação de aderência.

Não é uma engine: é uma camada de arquivos Markdown/YAML instalada em
`.catraca/` no projeto alvo. O agente hospedeiro (Claude Code primeiro)
executa; o framework guia — specs, perguntas, skills, tasks TDD e avaliação.

## Instalação

```bash
python3 catraca/install.py /caminho/do/projeto-alvo
```

O instalador:

- cria `.catraca/` com templates, comandos e a biblioteca de 13 skills;
- é **idempotente**: arquivo existente idêntico é pulado; existente e diferente
  é preservado (a versão nova entra como `*.new`); com `--force`, o existente
  vira backup `*.bak` antes de ser sobrescrito;
- com `--claude` (default), instala os comandos também em
  `.claude/commands/catraca/` para uso como slash commands no Claude Code;
- termina com um relatório de criados/pulados/conflitos.

Opções: `--force`, `--no-claude`, `--skills-source DIR` (default: `skills/` na
raiz deste repositório).

## Uso

Depois de instalar, abra o agente no projeto alvo e cole o prompt inicial —
**só a ideia do produto**, sem stack nem técnica:

> Quero criar uma API REST de enquetes. Siga `.catraca/CLAUDE.md` e rode
> `/catraca.init` em modo guiado.

A stack é decidida na fase própria (Gate B). TDD, Clean Architecture, SOLID e
Design Patterns não precisam ser pedidos: são **constitucionais**
(`.catraca/manifesto.md`) — valem para qualquer projeto que use o framework;
os gates só calibram o rigor.

O agente entra no fluxo:

| Fase | Comando | Saída |
|---|---|---|
| Elicitação (perguntas ou defaults) | `/catraca.init` | `questions.md`, `product.md`, `architecture.md`, `method.md` |
| Planejamento | `/catraca.plan` | `roadmap.md`, `specs/NNN-*.md` |
| Implementação TDD | `/catraca.implement` | código + testes, `tasks/NNN-*.md` |
| Avaliação | `/catraca.evaluate` | `evaluation/NNN-*.md`, `ratchet.json` |
| Situação | `/catraca.status` | próxima ação |
| Engenharia reversa | `/catraca.reverse` | *seed* (produto + Gates A–D) a partir de projeto existente |

**Modo guiado**: o agente para nos User Feedback Gates (objetivo, stack, rigor
do TDD, Clean Architecture estrita ou leve, skills obrigatórias, commits,
avaliação, ratchet) e grava as respostas em `questions.md`.

**Modo automático**: diga "modo automático" no prompt inicial; o agente assume
os defaults do perfil canônico do método (TDD estrito, 5 camadas, cobertura
100%, conventional commits) e registra cada suposição como `[assumed]` em
`questions.md`, revisável depois.

Documentação completa: [docs/usage.md](docs/usage.md).

## Estrutura

```
catraca/
├── MANIFESTO.md        # o método em uma página
├── install.py          # instalador idempotente (stdlib apenas)
├── templates/          # vira o conteúdo de .catraca/ no projeto alvo
├── commands/           # init, plan, implement, evaluate, status
├── docs/usage.md       # guia de uso
└── examples/minimal/   # instalação mínima de demonstração
```

O framework carrega **biblioteca própria** de skills (`catraca/skills/`):
13 regras operacionais agnósticas de linguagem e plataforma, destiladas do
método e limpas de qualquer referência à origem. O instalador as copia para
`.catraca/skills/` no projeto alvo, de modo que o projeto instalado é
autocontido. A plataforma do projeto é escolhida no Gate B; as ferramentas de
qualidade (linter, type-check, hooks, runner, cobertura) são propostas na
feature 000 conforme a plataforma escolhida.

## Princípios de design

- **Barreira intenção/solução**: specs falam de comportamento (WHEN/THEN),
  nunca de classes ou paths; a solução mora nas skills.
- **Gates automáticos, não disciplina**: toda roadmap começa pela feature 000
  (esteira de qualidade), que instala hooks reprovando commit/push — como nas
  primeiras aulas do curso, o ambiente com gates ativos precede a primeira
  feature.
- **Test-first como hard gate**: código de produção sem teste vermelho antes é
  apagado e refeito.
- **Estado em Markdown**: checkboxes e arquivos versionados; sem banco, sem
  estado oculto.
- **Avaliação com evidência**: cada linha da rubrica exige comando + saída;
  `ratchet.json` registra os melhores scores e acusa regressão.
- **Sem código do curso**: o framework carrega regras destiladas (skills),
  jamais código do projeto didático original.
