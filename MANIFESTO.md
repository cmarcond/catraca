# Manifesto do Catraca — Princípios Constitucionais

> Estes princípios valem para **todo** projeto que usa o Catraca. Eles
> não são perguntados, não dependem do prompt do usuário e não se negociam por
> feature. O que os User Feedback Gates calibram é o **rigor de aplicação**
> (perfil em `method.md`) — nunca a vigência dos princípios. As regras
> operacionais completas estão em `.catraca/skills/`.
>
> O método é **agnóstico de linguagem e plataforma**: a plataforma é escolhida
> no Gate B, e as ferramentas que materializam os gates de qualidade são
> propostas na feature 000, adequadas ao contexto escolhido.

## Princípios

1. **Todo comportamento nasce de um teste que falha.** Red → Green →
   Refactor, por comportamento, não por arquivo. Implementação mínima; valor
   fixo só vive até o teste que o generaliza.
2. **Dependências apontam para dentro.** Domínio não conhece banco, HTTP nem
   framework. Protocolos (interfaces) são declarados na camada que precisa
   deles; implementações chegam por injeção de construtor.
3. **Toda biblioteca de terceiros entra por um adapter.** Criptografia,
   tokens, driver de banco, validadores: nenhum import de lib fora da camada
   de infraestrutura.
4. **Erro é preocupação de borda — e nenhum erro morre em silêncio.**
   Controllers capturam exceções e as mapeiam para respostas; o domínio não
   fala HTTP. A resposta ao cliente é genérica, mas o erro completo é
   registrado para observabilidade: payload limpo, log integral.
5. **Validação é composição.** Cada regra é um objeto pequeno; um composite as
   agrega; uma factory monta tudo na camada de composição.
6. **Refatorar é andar com a rede armada.** Suite verde a cada passo; a
   estrutura nova entra antes de a velha sair.
7. **Uma responsabilidade por unidade.** Classes, use cases e testes pequenos,
   com nome que diz o que fazem.
8. **Cobertura é gate, não troféu.** Queda de cobertura é bloqueador, não
   aviso.
9. **Commits pequenos contam a história.** Conventional commits, imperativo,
   um commit por task — validados por hook, não por disciplina.
10. **Specs são intenção; skills são solução.** A spec diz o que o sistema
    faz (WHEN/THEN); como fazer com qualidade já está escrito nas skills. Não
    misture.
11. **Gates automáticos, não disciplina.** Toda convenção verificável vira um
    hook que reprova commit/push (feature 000 — esteira de qualidade), antes
    de qualquer feature de produto.

## As 13 skills

| Categoria | Skill | Regra em uma linha |
|---|---|---|
| testing | `tdd-minimal-step` | Ciclo red-green-refactor por comportamento, implementação mínima |
| testing | `test-doubles` | Spies/stubs/mocks isolam a unidade; stub de sucesso, mock de falha |
| testing | `test-setup-factories` | Fábrica de SUT retorna `{sut, ...stubs}`; boilerplate padronizado |
| testing | `integration-tests` | Repositórios contra banco em memória, sem mocks |
| architecture | `dependency-inversion-adapters` | Protocolos onde se usa, adapters onde se implementa |
| architecture | `controller-error-boundary` | Exceções viram respostas na borda |
| architecture | `error-observability` | Nenhum 500 sem registro; payload limpo, log integral |
| foundational | `input-validation` | Regras como objetos, composite + factory |
| refactor | `single-responsibility` | Refactor incremental sob verde |
| domain-conventions | `layered-typing` | Tipos de entrada/saída por caso de uso |
| domain-conventions | `project-structure` | Camadas primeiro; composição na borda externa |
| workflows | `git-conventions` | Conventional commits, um por task |
| workflows | `quality-pipeline` | Gates automáticos de qualidade como pré-condição |

Cada skill traz: quando usar, quando não usar, pré-condições, ordem de
operações, **Test Checklist** (de onde derivam os critérios técnicos de
aceitação) e **Anti-Patterns** (o que reprova na rubrica).
