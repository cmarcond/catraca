---
name: layered-typing
title: Tipagem por camada para desacoplar domínio e infraestrutura
description: O tipo de fronteira nasce na camada que o publica e a dependência aponta para o domínio; cada caso de uso é dono do seu contrato de entrada/saída, com redução a booleano apenas quando o contrato do chamador é estável.
category: domain-conventions
dependencies:
  - architecture/dependency-inversion-adapters
---

# Layered Typing

## Princípio (invariante)

Um **tipo de fronteira** — o contrato de entrada/saída que uma camada expõe
para outra — nasce na camada que o publica, e a direção da dependência aponta
para o domínio. O caso de uso é dono do seu contrato de entrada/saída; a
camada de dados é dona dos tipos que sua infraestrutura consome. A infra
depende de **protocolos/contratos** definidos no domínio, mas não de **models
de dados concretos** do domínio.

Isto vale em qualquer linguagem; a materialização varia (ver exemplo no fim).

### Tipo de fronteira vs tipo interno

Aplique a skill apenas a tipos que cruzam camada (domínio↔dados/infra) ou a
tipos compartilhados por mais de uma camada. Tipo usado num único ponto
interno não é fronteira — não force convenção sobre ele.

## When To Use

- Um tipo está prestes a cruzar fronteira de camada (domínio↔dados/infra).
- Há sintoma de import circular, ou um adapter/repositório está prestes a
  importar models do domínio.
- O retorno de uma operação de escrita/verificação está mais rico do que o
  chamador consome.

## When Not To Use

- Código de runtime puro sem decisão de tipo de fronteira.
- Tipo interno usado num único ponto, sem cruzar camada.

## Order Of Operations

1. Identifique a fronteira: quem publica o contrato e quem consome.
2. Confirme a direção: a infra implementa protocolos do domínio; ela **não**
   importa models de dados do domínio. Se um adapter precisa de um tipo de
   entrada/saída, declare-o no protocolo da camada de dados.
3. Pergunte o que o chamador usa do retorno (ver "Decidir reduzir a
   booleano").
4. Atualize mocks, dublês e testes no mesmo passo: mudança de contrato ou de
   tipo espelhado quebra todos eles juntos.

## Decidir reduzir a booleano (passo obrigatório)

Antes de declarar um retorno como booleano (sucesso/existência):

- Reduza **somente** quando o contrato do chamador estiver estável e nenhum
  consumidor atual ou previsto usar o objeto retornado.
- **Não** reduza se houver consumidor (atual ou plausível a curto prazo) do
  identificador/entidade — manter o resultado rico evita uma segunda
  consulta. Na dúvida, mantenha o objeto.

## Decidir espelhar vs fundir tipos

- **Espelhe** (mantenha tipos separados, ainda que iguais) quando pertencem a
  camadas que devem evoluir independentemente.
- **Funda** quando pertencem à mesma camada/contrato e a igualdade não é
  coincidência — aí é duplicação acidental.

## Test Checklist

- [ ] Nenhum arquivo de infraestrutura importa **models de dados** do domínio
      (importar protocolos do domínio é permitido).
- [ ] Cada caso de uso expõe seu contrato de entrada/saída na camada que o
      publica, usado pela implementação e pelos dublês.
- [ ] Retornos de escrita/verificação foram reduzidos apenas após o passo
      "Decidir reduzir a booleano".
- [ ] Tipos espelhados entre camadas estão sincronizados, e o espelhamento
      passou no teste espelhar-vs-fundir.
- [ ] A verificação de tipos (quando a linguagem tem) passa e nenhum import
      circular foi reintroduzido.

## Anti-Patterns

- Importar models de dados do domínio dentro de adapters/repositórios para
  "reaproveitar" um tipo — inverte a direção da dependência.
- Um arquivo central de models compartilhados que toda camada importa, criando
  acoplamento e ciclos.
- Retornar o objeto persistido inteiro quando o chamador comprovadamente só
  precisa saber se deu certo (ou reduzir cedo demais, exigindo segunda
  consulta).
- Tratar tipos espelhados entre casos de uso parecidos como duplicação a ser
  fundida sem aplicar o teste espelhar-vs-fundir.

## Exemplo de materialização (ilustrativo)

Em linguagens com namespaces/módulos de tipos: para cada caso de uso, um
namespace homônimo com `Params` e `Result`, referenciados pela implementação e
pelos dublês. Em linguagens sem isso: tipos nomeados por convenção
(`AddXParams`/`AddXResult`) co-localizados com o contrato; em linguagens
dinâmicas, documente o contrato no próprio protocolo.
