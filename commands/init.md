# /catraca.init — Elicitar ou Assumir; Gerar Product, Architecture e Method

Roteiro do agente para a fase de inicialização. Pré-condição: `.catraca/`
instalado. Saídas: `questions.md`, `product.md`, `architecture.md`, `method.md`
preenchidos.

## Passo 0 — Detectar o modo

- Se o usuário pediu "modo automático" (ou equivalente) no prompt: **modo
  automático**. Caso contrário: **modo guiado**.
- Releia `.catraca/CLAUDE.md`, `manifesto.md` (princípios constitucionais —
  já valem; não pergunte ao usuário se ele "quer TDD") e `method.md`.

## Passo 1 — Gates A–D

**Modo guiado.** Percorra os gates de `questions.md` na ordem A → B → C → D,
**um gate por vez** (nunca todas as perguntas de uma vez). Para cada gate:

1. Apresente as perguntas do gate com sugestões derivadas do prompt inicial
   (o que o usuário já fixou no prompt vira proposta a confirmar, não
   pergunta aberta), justificadas pelo que o projeto precisa.
2. Grave cada resposta na tabela de `questions.md`.
3. Só avance ao gate seguinte com o atual completo.

**Modo automático.** Preencha todas as respostas com os defaults do perfil
canônico (rodapé de `questions.md`), marcando cada uma com
`[assumed AAAA-MM-DD]`. O que o prompt inicial fixar explicitamente (ex.:
stack) não é suposição — registre como vindo do prompt.

## Passo 2 — Product spec

Preencha `product.md` a partir do prompt + G1. Regras:

- linguagem de produto, zero decisões técnicas; sucesso é o que o usuário
  passa a conseguir fazer;
- features candidatas numeradas, nomeadas como capacidade ("login"), não como
  endpoint;
- "fora de escopo" nunca vazio — explicite ao menos o óbvio que não entra.

**Pausa (guiado):** mostre o `product.md` e peça confirmação antes de seguir.

## Passo 3 — Architecture spec

Preencha `architecture.md` a partir do Gate B (G2, G2b, G3, G4):

- perfil de camadas (estrita = tabela completa do template; leve = 3 camadas,
  documente a fusão);
- tabela de fronteiras/adapters: uma linha por dependência externa de G4 —
  protocolo (e em que camada vive) + adapter;
- convenções de teste por camada.

**Pausa (guiado):** confirmar antes de seguir.

## Passo 4 — Method

Preencha `method.md` a partir de G5–G10:

- tabela de perfil de rigor com a coluna "Origem" (resposta do usuário /
  `[assumed]` / prompt);
- tabela de skills: toda exclusão ou rebaixamento para "opcional" exige
  justificativa;
- os gates operacionalizados não são editáveis — apenas o alvo de cobertura e
  a exigência de commits variam com o perfil.

## Passo 5 — Encerramento

- Confirme que os 4 arquivos estão consistentes entre si (stack citada no
  method? camadas do architecture batem com G3?).
- Anuncie a próxima fase: `/catraca.plan`.
- Em modo automático: siga direto para o plan sem parar.
