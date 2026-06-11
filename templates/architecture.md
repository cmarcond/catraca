# Architecture Spec

> Gerado por `/catraca.init` a partir do Gate B (ou dos defaults `[assumed]`).
> Aqui moram as decisões técnicas; as specs de feature não as repetem.

## Plataforma e stack

| Dimensão | Escolha | Origem (resposta/assumed) |
|---|---|---|
| Server-side: linguagem/runtime | | |
| Server-side: framework | | |
| Client-side (se houver) | | |
| Banco de dados | | |
| Outras dependências (hash/tokens/etc.) | | |
| Ambiente de desenvolvimento (G2b) | | |

> Ferramentas de qualidade e teste (linter, type-check, hooks, runner,
> cobertura) são propostas e confirmadas na feature 000, conforme esta
> plataforma — registradas em `tasks/000-*.md`.

## Camadas

<!-- Perfil escolhido no Gate B: estrita (5 camadas) ou leve (3 camadas).
     Default canônico: estrita. -->

| Camada | Responsabilidade | Pode importar de |
|---|---|---|
| `domain` | Modelos e contratos de use cases | — (nada) |
| `data` | Implementações de use cases + protocolos de dados | `domain` |
| `presentation` | Controllers, validação de borda, erros de borda | `domain` |
| `validation` (opcional) | Validators compostos | `presentation` |
| `infra` | Adapters de banco, criptografia, libs | `data` (protocolos) |
| `main` | Factories, composição, rotas, server | todas |

**Regra de import (verificável):** nenhum arquivo de uma camada importa de uma
camada que não esteja na sua coluna "pode importar de". Lib de terceiros só
aparece em `infra` (e em `main` para o framework HTTP).

## Fronteiras / Adapters

<!-- Gate B, pergunta G4: que dependências externas ficam atrás de adapter.
     Uma linha por fronteira. Inclua o destino de logs de erro (skill
     `architecture/error-observability`): stdout estruturado é o default
     honesto; banco/serviço quando houver requisito. -->

| Dependência externa | Protocolo (camada que define) | Adapter (infra) |
|---|---|---|
| Destino de logs de erro | protocolo de registro de erro | adapter do destino |
| | | |

## Convenções de teste por camada

| Camada | Tipo de teste | Skill de referência |
|---|---|---|
| `domain`/`data`/`presentation` | Unitário com test doubles e `makeSut()` | `testing/test-doubles`, `testing/test-setup-factories` |
| `infra` | Integração com banco em memória | `testing/integration-tests` |
| `main` | Rotas com cliente HTTP de teste | `testing/integration-tests` |
