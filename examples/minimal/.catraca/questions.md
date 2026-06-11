# Questions — User Feedback Gates

> Registro vivo das decisões do projeto. Em modo guiado, o agente pergunta e
> grava as respostas. Em modo automático, grava o default com a marca
> `[assumed AAAA-MM-DD]`. Para revisar uma decisão depois: edite a coluna
> "Resposta", anote a revisão e rode `/catraca.status` para o agente
> reconciliar os artefatos afetados.

## Gate A — Produto (no init)

| # | Pergunta | Resposta | Revisão |
|---|---|---|---|
| G1 | Qual o objetivo real do projeto? Quem usa? O que o usuário consegue fazer quando estiver pronto? | | |

## Gate B — Plataforma e técnica (antes do architecture spec)

| # | Pergunta | Resposta | Revisão |
|---|---|---|---|
| G2 | Plataforma e linguagem: server-side (linguagem, runtime, framework)? client-side (se houver)? banco de dados? | | |
| G2b | Ambiente de desenvolvimento: local com infraestrutura efêmera nos testes (default), ou containerizado desde o início (devcontainer + compose)? | | |
| G3 | Clean Architecture estrita (5 camadas) ou leve (3 camadas)? | | |
| G4 | Quais dependências externas devem ser isoladas atrás de adapters? | | |

> G2b: se a stack escolhida exigir serviço local sem variante efêmera
> confiável (ex.: banco sem opção em memória), o agente deve recomendar
> containerizado, com justificativa. Se o roadmap ganhar uma feature de
> deploy, a containerização nasce lá, como feature própria — não retroage
> sobre a esteira.

> As ferramentas de qualidade e teste (linter, type-check, hooks, runner,
> cobertura) não são perguntadas aqui: a feature 000 propõe as adequadas à
> plataforma escolhida e pede confirmação.

## Gate C — Método (antes do method.md final)

| # | Pergunta | Resposta | Revisão |
|---|---|---|---|
| G5 | Rigor do TDD: estrito ou pragmático? | | |
| G6 | Quais skills do método (de `.catraca/skills/`) são obrigatórias? | | |
| G7 | Quais skills são opcionais/não aplicáveis (e por quê)? | | |
| G8 | Commits pequenos com conventional commits: exigidos ou recomendados? | | |

## Gate D — Avaliação (antes do primeiro implement)

| # | Pergunta | Resposta | Revisão |
|---|---|---|---|
| G9 | Avaliação rígida, pedagógica ou pragmática? | | |
| G10 | Em regressão de score, o ratchet alerta (`warn`), bloqueia (`block`) ou aciona reparo automático (`repair`)? | | |

## Gate E — Por feature (durante o plan; recorrente)

| Feature | G11: roadmap confirmado? | G12: criterios de aceitação confirmados? |
|---|---|---|
| | | |

## Defaults do perfil canônico (usados no modo automático)

TDD estrito · Clean Architecture estrita (5 camadas) · toda lib via adapter ·
ambiente local com infraestrutura efêmera nos testes · cobertura 100%
bloqueante · conventional commits exigidos (um por task) · avaliação
pedagógica · ratchet em `repair` · 13 skills obrigatórias salvo
inaplicabilidade óbvia registrada.
