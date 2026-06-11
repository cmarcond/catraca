# /catraca.evaluate — Rubrica de Aderência + Ratchet

Avalia **uma feature** implementada. Pré-condições: tasks da feature completas,
suite verde. Saídas: `evaluation/NNN-slug.md` + `ratchet.json` atualizado.

## Passo 1 — Coletar evidências (antes de pontuar)

Execute e capture saída resumida:

1. suite de testes completa;
2. relatório de cobertura;
3. `git log --oneline` dos commits da feature;
4. inspeção de imports das novas unidades por camada (contra a tabela de
   `architecture.md`).

## Passo 2 — Preencher a rubrica

Crie `evaluation/NNN-slug.md` a partir de `evaluation/RUBRIC-TEMPLATE.md`:

1. **Por skill declarada na spec**: abra o SKILL.md, percorra o **Test
   Checklist** (score = atendidos/aplicáveis) e os **Anti-Patterns** (presente
   ⇒ desconta e vira "violação"). Evidência concreta em cada linha — sem
   evidência, 0.
2. **Dimensões transversais**: `test_first` (ordem red nas tasks + histórico),
   `layer_discipline` (imports), `coverage` (relatório vs alvo do perfil),
   `commit_discipline` (formato + um-por-task).
3. Aplique o **modo de avaliação** do `method.md` (G9): rígida zera dimensão
   com violação não justificada; pedagógica desconta e explica; pragmática não
   penaliza violação justificada. Em modo pedagógico, compare com as rubricas
   anteriores: violação já anotada como lição em feature anterior é
   **reincidência** e desconta mais.
4. Dê o **verdict**: `aderente` / `parcial` / `não aderente`.

## Passo 2b — Auditoria independente da rubrica

Antes do ratchet, delegue a auditoria a um **subagente de contexto limpo**
(no Claude Code, a ferramenta Task), entregando: a spec, as skills declaradas,
a rubrica preenchida com evidências e os comandos de verificação (suíte,
cobertura, `git log`, inspeção de imports). A instrução dele é **derrubar
scores**, em duas frentes:

1. **Re-execução**: rodar de novo cada evidência e procurar pontuação sem
   prova, violação não detectada ou anti-pattern ignorado.
2. **Mutação dirigida** — cobertura de linha não prova asserção; mutação é o
   teste do teste. Para cada criterio crítico da spec, mutar o elo
   correspondente na produção e rodar a suíte: se nenhum teste quebra (mesmo
   com cobertura 100%), o criterio está coberto sem estar assertado — achado.
   Reverter a mutação após cada prova. Exemplos de mutação por criterio:
   remover o registro de erro mantendo o 500; inverter uma regra de
   autorização; trocar a comparação de fronteira de um intervalo; devolver
   sucesso sem persistir.

Ele **não reescreve a rubrica** — só reporta achados; você acata (ajusta o
score) ou refuta com justificativa, e registra o resultado na linha
"Auditoria" da rubrica (incluindo mutações aplicadas × sobreviventes). *Sem
suporte a subagentes: execute você mesmo as duas frentes numa passada separada
antes do ratchet, e registre a auditoria como "self".* 

## Passo 3 — Ratchet

Siga `evaluation/README.md`:

1. compare cada score com `ratchet.json`;
2. maior → atualize (a catraca sobe); menor que `melhor - buffer` → regressão:
   - `mode: warn` ⇒ alerta registrado na rubrica;
   - `mode: block` ⇒ HALT, reporte ao usuário antes de qualquer outra feature;
   - `mode: repair` ⇒ anexe tasks de reparo (R1, R2…) ao `tasks/NNN-*.md`,
     uma por dimensão degradada (red = evidência da regressão; green =
     correção; refactor sob verde), execute-as pelo ciclo normal do
     `implement.md` e **reavalie uma vez**. Recuperou ⇒ segue; ainda abaixo ⇒
     HALT (o usuário decide: rebaixar o piso conscientemente ou orientar novo
     reparo). Repare aderência, nunca reverta comportamento; dimensões
     históricas (`test_first`, `commit_discipline` de código já escrito) não
     se reparam — registre a dívida.
3. atualize `last_check_at` e o verdict da feature.

## Passo 4 — Encerramento

- Atualize `roadmap.md` (checkbox "avaliada").
- Resuma para o usuário: verdict, scores, violações e (modo pedagógico) as
  notas de aprendizado.
- Próxima ação: feature seguinte do roadmap, ou fim do roadmap.
