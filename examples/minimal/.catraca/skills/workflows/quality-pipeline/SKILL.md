---
name: quality-pipeline
title: Esteira de qualidade e gates contínuos
description: Transforme convenções de qualidade em gates automáticos que reprovam o commit/push (lint, type-check, cobertura), atualize dependências em lotes verificados pela suíte e investigue com breakpoints. Princípio independente de stack.
category: workflows
dependencies:
  - testing/tdd-minimal-step
---

# Esteira de qualidade e gates contínuos

Convenção que depende de lembrar é frágil; o ganho vem de transformar a
convenção em um gate que reprova automaticamente. Esta skill descreve o
**princípio invariável** (independente de linguagem); a **materialização** —
quais ferramentas implementam cada gate — é decidida na feature 000, para a
stack escolhida em `architecture.md`.

## When To Use

- Iniciando um projeto **e ainda não existe** nenhum gate que reprove um
  commit/push (lint, type-check, cobertura). Se já existe, ajuste o gate, não
  reintroduza a esteira.
- Fechando uma feature ou refactor: confirmar que a cobertura não regrediu
  contra o baseline antes do push.
- Atualizando dependências quando há **update major** ou mudança de toolchain
  que pode quebrar comportamento.

## When Not To Use

- Mudança de comportamento isolada que não toca toolchain, scripts, configs ou
  versões — neste caso vale **apenas** o passo de cobertura no fechamento, não
  o setup nem o fluxo de updates.
- Spikes descartáveis fora do fluxo de entrega. Heurística: aplique os gates
  quando o código será mantido por mais de uma sessão ou compartilhado; pule
  quando o artefato será jogado fora após a investigação.

## Princípio invariável

1. **Gates automáticos, não disciplina.** Cada convenção verificável (formato,
   tipos, estilo, cobertura) deve ter um hook que **reprova** o commit/push,
   não apenas avisa.
2. **Pre-commit só sobre o que mudou.** O hook valida o conjunto staged, não o
   repositório inteiro — caso contrário fica lento e o time recorre a
   `--no-verify`.
3. **Cobertura como gate com baseline explícito.** Registre o percentual por
   escopo (ex.: unitário, integração) do último commit verde como baseline. O
   push reprova se algum escopo cair abaixo do baseline (ou do alvo do perfil
   em `method.md`). Atualize o baseline só quando subir de própria iniciativa.
4. **Updates em lotes verificados.** Atualize dependências em lotes pequenos e
   reversíveis atomicamente (um lote = uma área funcional correlata), rodando
   a suíte antes e depois de cada lote, para que a quebra seja bissecionável.
5. **Investigação por breakpoint** quando precisar inspecionar estado em
   runtime, com mapeamento de fonte correto — em vez de instrumentar com
   prints.

## Necessidades (o que a esteira deve cobrir)

Traduza cada necessidade numa ferramenta **da stack escolhida** (a feature 000
propõe as ferramentas e o usuário confirma):

| Necessidade | Gate |
|---|---|
| Verificação de tipos (se a linguagem tiver) | reprova no commit |
| Estilo/lint com zero warnings | reprova no commit |
| Formato de mensagem de commit | hook `commit-msg` rejeita |
| Lint + testes relacionados do staged | hook `pre-commit` |
| Testes por escopo (unitário, integração, ci) | scripts separados |
| Cobertura vs baseline/alvo | reprova no push/fechamento |

## Order Of Operations

Setup inicial (um chore por ferramenta, commits separados — ver a feature
000):

1. Verificador de tipos no modo mais estrito disponível; é o primeiro gate.
2. Linter com zero warnings no commit.
3. Hook de `commit-msg` validando a convenção de mensagem do projeto.
4. Hook de `pre-commit` rodando lint e testes **apenas sobre os arquivos
   staged**.
5. Test runner com scripts separados por escopo (unitário, integração, ci) e
   cobertura medida.

Fechamento de feature/refactor:

1. Suíte verde localmente antes de qualquer push.
2. Compare a cobertura por escopo contra o baseline/alvo; queda reprova.
3. Cubra comportamento real; teste trivial só para subir o número não conta
   como proteção.

Atualização de dependências:

1. Branch própria; suíte verde antes, para fixar baseline.
2. Atualize em lotes por área; rode a suíte após cada lote; corrija ou reverta
   o lote antes do próximo.
3. Major version: leia o changelog e migre em refactor progressivo.
4. Congele uma versão só com justificativa registrada onde o time a vê (ex.:
   comentário no manifesto de dependências ou ADR).

## Test Checklist

- [ ] Existe um gate que reprova o commit/push para cada convenção verificável
      do projeto.
- [ ] `--no-verify` não é necessário no fluxo normal — se a tentação aparece,
      o hook está lento ou validando arquivos demais.
- [ ] Pre-commit roda contra a stage area, não contra todo o repositório.
- [ ] Cobertura comparada contra o baseline/alvo, por escopo; queda reprova.
- [ ] Cada lote de update validado pela suíte isoladamente e reversível
      sozinho.
- [ ] (Se aplicável) breakpoint para na linha correta, sem prints deixados no
      código.

## Anti-Patterns

- Convenção verificável deixada como acordo verbal ou aviso em vez de gate.
- Hook de pre-commit lento que processa a base inteira, empurrando o time para
  `--no-verify`.
- Perseguir o número de cobertura com testes triviais; cobertura é gate contra
  regressão, não meta numérica.
- Atualizar muitas dependências num único lote: mistura causas de quebra e
  impede bissecção.
- Atualizar dependências sem suíte confiável como rede de proteção.
- Mapeamento de fonte desatualizado deixando o breakpoint na linha errada.
