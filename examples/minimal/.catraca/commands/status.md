# /catraca.status — Onde Estamos e Próxima Ação

Reconstrói o estado do projeto **somente a partir dos arquivos** (não de
memória da conversa) e anuncia a próxima ação. Também reconcilia revisões de
decisões.

## Passo 1 — Ler o estado

| Verificação | Fonte |
|---|---|
| Init feito? | `questions.md` (gates A–D respondidos?), `product.md`/`architecture.md`/`method.md` preenchidos? |
| Plan feito? | `roadmap.md` tem features? Specs existem para todas? |
| Feature em andamento? | Primeiro `tasks/NNN-*.md` com checkbox aberto |
| Avaliações pendentes? | Features com "implementada" marcado e "avaliada" aberto no roadmap |
| Regressões? | Alertas registrados nas rubricas + `ratchet.json` |

## Passo 2 — Reconciliar revisões

Se alguma linha de `questions.md` tem a coluna "Revisão" preenchida e ainda não
aplicada:

1. identifique os artefatos afetados (G2–G4 ⇒ `architecture.md`; G5–G8 ⇒
   `method.md`; G9–G10 ⇒ `evaluation/` + `ratchet.json` `mode`);
2. proponha as edições ao usuário (modo guiado) ou aplique e registre
   (automático);
3. marque a revisão como aplicada na própria tabela.

## Passo 3 — Reportar

Responda em poucas linhas:

- fase atual (init / plan / implement feature NNN / evaluate feature NNN /
  roadmap completo);
- pendências e alertas (rubricas abertas, regressões de ratchet, suposições
  `[assumed]` ainda não revisadas — liste-as para o usuário validar);
- **próxima ação concreta** (qual comando, qual feature).
