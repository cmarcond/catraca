---
name: single-responsibility
title: Refactor incremental por responsabilidade
description: Fatiar refactors em passos com a suíte sempre verde — divide casos de uso/repositórios pelo uso real, otimiza queries por projection quando a fonte suporta, e renomeia sem mudar o contrato observável pelos consumidores.
category: refactor
dependencies:
  - testing/tdd-minimal-step
  - architecture/dependency-inversion-adapters
  - workflows/git-conventions
---

# Refactor incremental por responsabilidade

Reestrutura código existente sem quebrar comportamento: a estrutura nova entra
antes da antiga sair, e a suíte fica verde entre cada passo.

**Contrato externo** = o boundary observável pelos consumidores existentes do
que está sendo refatorado (assinaturas que eles chamam, valores que eles
leem). Mover um método entre camadas pode mudar a forma interna sem mudar esse
contrato; se um consumidor existente precisa ajustar a expectativa, o contrato
mudou e isto deixa de ser refactor.

**Pré-condição de arquitetura.** Os passos pressupõem camadas com inversão de
dependência (consumidores dependem de uma abstração, não da implementação
concreta) — é o que torna possível trocar a estrutura por trás sem tocar o
consumidor. Sem essa separação, "adicionar o novo ao lado do antigo" pode não
ser viável e o refactor exige outro plano.

## When To Use

- Um consumidor usa só parte do retorno → extraia uma operação dedicada para
  essa necessidade (ex.: separar "verificar existência" de "carregar
  completo").
- Um método/operação/repositório acumula responsabilidades não relacionadas.
- Uma query carrega a entidade inteira mas só alguns campos são usados →
  considere projection ou um acesso específico (ver constraint abaixo).
- Renome de um símbolo que atravessa camadas (abstração, implementação, dublês
  de teste).

> Atualização de biblioteca grande "deixando os testes apontarem o que
> quebrou" é migração de dependência, não refactor por responsabilidade —
> fora do escopo desta skill.

## When Not To Use

- Primeiro teste de um comportamento novo → use `tdd-minimal-step`. Refactor
  pressupõe comportamento já coberto.
- Não há cobertura prévia dos pontos tocados → escreva os testes primeiro; sem
  rede, não é refactor seguro.
- Divisão "para o futuro" sem consumidor concreto pedindo → adiciona estrutura
  que ninguém usa; espere o uso real.

## Order Of Operations

1. Confirme que os comportamentos afetados têm testes verdes. Se não, cubra
   antes de tocar.
2. Identifique a responsabilidade/uso concreto que motiva a mudança (quem
   consome o quê).
3. Adicione a estrutura nova ao lado da antiga: nova abstração, método,
   operação ou query.
4. Migre os consumidores um a um para o novo caminho; atualize mocks/dublês
   junto com cada migração.
5. Rode a suíte a cada passo — não acumule passos sem verde.
6. Quando nenhum consumidor usar o caminho antigo, remova-o.
7. Renome: aplique uma varredura mecânica e verificável (refactor automatizado
   ou busca/substituição revisada) com a suíte garantindo a mecânica. Mantenha
   a varredura separada de mudança de comportamento — ver `git-conventions`
   para a granularidade de commit.

### Extrair método vs. extrair acesso dedicado

Quando o uso é parcial, decida pelo eixo da mudança: se a diferença é apenas
de lógica/composição na mesma camada, extraia um método; se a diferença é de
como os dados são obtidos (uma consulta/contrato de leitura distinto), extraia
uma operação/repositório dedicado para que o consumidor dependa só do que
precisa.

### Otimização por projection

Projete apenas os campos usados **quando a fonte de dados suporta seleção de
campos no servidor**. Se a fonte não suporta projeção (ex.: API que sempre
devolve o objeto inteiro), filtrar/mapear na aplicação é a única opção
disponível e não é anti-pattern. Em qualquer caso, lembre de ampliar a
projeção quando novos campos passam a ser usados.

## Test Checklist

- [ ] Suíte estava verde antes do primeiro passo.
- [ ] Suíte ficou verde após cada passo intermediário, não só no fim.
- [ ] Contrato externo permanece igual — nenhum teste de comportamento
      precisou mudar de expectativa por causa do refactor.
- [ ] Mocks e factories foram atualizados no mesmo passo da mudança que os
      afeta.
- [ ] Cada caminho antigo só foi removido depois de zerar consumidores.
- [ ] Estrutura nova (operação/repositório/projection) é coberta pelo
      consumidor que a usa.
- [ ] Renome ficou separado de lógica nova.

## Anti-Patterns

- Big-bang: trocar tudo de uma vez e só rodar a suíte no final.
- Remover o caminho antigo antes de migrar todos os consumidores.
- Misturar renome + nova feature no mesmo passo/commit (esconde a causa de uma
  quebra).
- Dividir por estética, sem um consumidor que use só parte do retorno.
- Otimizar query por suposição em vez do uso real; ou projetar campos e
  esquecer de ampliar a projeção quando novos campos passam a ser usados.
- Refatorar com a suíte vermelha "que eu conserto depois".
