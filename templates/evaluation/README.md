# Evaluation — Como Avaliar Aderência ao Método

Uma rubrica por feature, `NNN-slug.md` (mesmo número da spec), preenchida por
`/catraca.evaluate` ao fim da implementação. Use `RUBRIC-TEMPLATE.md`.

## Princípios

- **Evidência ou não aconteceu.** Cada linha da rubrica exige evidência
  verificável: comando executado + saída relevante, ou referência a
  teste/arquivo/commit. Auto-relato sem evidência pontua 0.
- **Modo de avaliação** (de `method.md`, Gate D/G9):
  - *rígida*: qualquer violação não justificada zera a dimensão;
  - *pedagógica* (default): violação reduz o score e a rubrica explica o que o
    método pediria e por quê;
  - *pragmática*: violação justificada na coluna própria não penaliza.

## Dimensões e score

Por skill declarada na spec: score 0–1 derivado do **Test Checklist** e dos
**Anti-Patterns** da skill (itens atendidos / itens aplicáveis; anti-pattern
presente desconta).

Dimensões transversais (sempre):

| Dimensão | O que mede | Como verificar |
|---|---|---|
| `test_first` | Testes precederam produção | histórico de commits / ordem das tasks red marcadas |
| `layer_discipline` | Imports respeitam `architecture.md` | inspeção de imports por camada |
| `coverage` | Cobertura vs alvo do perfil | relatório do test runner |
| `commit_discipline` | Um commit por task, formato conventional | `git log` |

**Verdict da feature**: `aderente` (todas as dimensões ≥ threshold do
ratchet), `parcial` (alguma abaixo), `não aderente` (maioria abaixo).

## Ratchet

`ratchet.json` guarda o melhor score já atingido por feature e dimensão:

```json
{
  "buffer": 0.05,
  "mode": "warn",
  "features": {
    "001-cadastro": {
      "verdict": "aderente",
      "scores": {"test_first": 1.0, "layer_discipline": 1.0, "coverage": 1.0,
                  "commit_discipline": 0.9, "skills": {"testing/tdd-minimal-step": 1.0}}
    }
  }
}
```

Após cada avaliação:

1. Score **maior** que o registrado → atualiza o ratchet (catraca sobe).
2. Score **menor** que `registrado - buffer` → regressão. O `mode` decide:
   - **`warn`**: registre o alerta na rubrica e siga.
   - **`block`**: HALT — pare e reporte ao usuário antes de continuar
     qualquer outra feature.
   - **`repair`**: acione o ciclo de reparo (abaixo).
3. Atualize `last_check_at` (ISO 8601).

## Ciclo de reparo (`mode: repair`)

1. **Anexe tasks de reparo** ao `tasks/NNN-*.md` da feature (seção
   "Reparo de regressão — ratchet", numeração R1, R2…), uma por dimensão
   degradada. O **red** de cada task é a evidência da regressão (relatório de
   cobertura abaixo do piso, import que viola camada, item de Test Checklist
   falhando); o **green** é a correção; **refactor** sob verde como sempre.
2. **Repare aderência, não comportamento**: o reparo cobre o que ficou sem
   teste, conserta fronteiras, extrai responsabilidades — nunca reverte
   evolução legítima do produto.
3. **Dimensões históricas não se reparam**: `test_first` e
   `commit_discipline` de código já escrito são fatos passados. Registre a
   dívida na rubrica e aplique o rigor dali em diante; não maquie o score.
4. **Um ciclo só**: execute as tasks R, reavalie uma vez. Recuperou o piso →
   catraca em dia. Continua abaixo → **HALT**: reporte ao usuário, que decide
   entre aceitar o novo patamar (rebaixar o piso conscientemente, registrando
   em `questions.md`) ou orientar outro reparo.
