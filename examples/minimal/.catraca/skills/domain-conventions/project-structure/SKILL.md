---
name: project-structure
description: Agrupar arquivos pela unidade de domínio dentro de cada fronteira arquitetural, isolar todo o código de teste numa árvore espelhada e tratar reorganização como refactor de commit próprio com suíte verde antes e depois.
category: domain-conventions
dependencies: []
---

# Estrutura de pastas por camada e entidade

Organize artefatos primeiro pela fronteira arquitetural do projeto e depois
pela unidade de domínio que cada arquivo serve. Mantenha código de teste,
mocks e helpers fora do escopo de produção. Trate qualquer movimentação de
arquivos como refactor puro, sem misturar mudança de comportamento.

## When To Use

- Criar os arquivos de uma nova entidade e decidir onde cada artefato (caso de
  uso, protocolo, repositório, controller) deve ficar.
- A raiz de uma camada tem ~5+ arquivos heterogêneos num diretório plano, sem
  subdivisão.
- Arquivos de entidades distintas convivem no mesmo diretório plano.
- Mocks, spies ou factories de teste estão dentro do diretório de produção.

## When Not To Use

- A mudança real é de comportamento; nesse caso implemente a feature primeiro
  e adie a reorganização para um commit separado.
- O ganho é puramente estético e o churn de imports custa mais que a clareza
  obtida.
- A árvore já reflete a fronteira → unidade e está estável; mover de novo só
  dificulta a arqueologia do git.

## Definições

- **Fronteira arquitetural**: a divisão de mais alto nível que o projeto já
  adota (camadas, módulos, bounded contexts). É o eixo externo.
- **Unidade de domínio** ("entidade"): o conceito de negócio que agrega os
  artefatos relacionados. É o eixo interno.
- **Outro eixo**: se o projeto organiza por feature/módulo vertical em vez de
  camada, mantenha esse eixo como externo e a unidade de domínio como interno
  — não force o arranjo camada→entidade onde ele não existe.

## Order Of Operations

1. Garanta a suíte 100% verde antes de tocar em qualquer caminho. Sem suíte de
   partida verde (ou sem suíte), não há rede de segurança: adicione cobertura
   mínima dos caminhos afetados antes de mover, ou faça a reorganização em
   passos pequenos e revisáveis manualmente.
2. Defina o eixo: nível externo = a fronteira arquitetural já adotada pelo
   projeto; nível interno = a unidade de domínio.
3. Crie a árvore de testes espelhando exatamente a estrutura de produção; mova
   mocks, spies e helpers para lá.
4. Mova os arquivos por unidade de domínio; agrupe protocolos correlatos em
   subpastas por responsabilidade quando a pasta crescer.
5. Se o stack tiver etapa de build/compilação ou runner com múltiplos roots,
   ajuste a configuração: separe os roots de produção e teste, exclua a árvore
   de teste do build e simplifique a coleta de cobertura. Em stacks sem essa
   etapa, pule.
6. Conserte os imports em massa; se a linguagem usa arquivos de agregação de
   import (barris/`index`), crie-os só quando 3+ consumidores importam o mesmo
   conjunto de símbolos.
7. Rode a suíte de novo: tem de continuar verde sem alterar nenhuma asserção.
8. Faça o commit contendo só movimentação e ajuste de import, com mensagem que
   declara o racional.

## Test Checklist

- [ ] Suíte verde imediatamente antes da movimentação.
- [ ] Suíte verde imediatamente depois, sem mudar asserções nem lógica — e o
      diff contém apenas renames/moves + ajuste de import.
- [ ] Nenhum mock, spy, helper ou arquivo de spec dentro da árvore de
      produção.
- [ ] (Se houver build separado) build exclui a árvore de teste e a cobertura
      aponta só para produção.

## Anti-Patterns

- Misturar reorganização com nova feature no mesmo commit, inviabilizando o
  `git blame`.
- Manter tudo na raiz da camada até virar uma lista impossível de navegar.
- Deixar artefatos de teste no diretório de produção "porque é mais perto".
- Criar barris e subpastas profundas antecipadamente, sem duplicação ou volume
  que os justifique.
- Alterar uma asserção para "fazer o teste passar" durante a migração — sinal
  de que houve mudança de comportamento camuflada.
