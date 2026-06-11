# Tasks — Como Decompor e Marcar

Um arquivo por feature, `NNN-slug.md` (mesmo número da spec), gerado por
`/catraca.implement` a partir da spec + skills. Use `TASKS-TEMPLATE.md`.

## Regras

1. **Uma task = um comportamento**, não um arquivo. Vem da menor regra
   observável (skill `tdd-minimal-step`).
2. **Toda task nasce trifásica**: sub-itens red / green / refactor. O red
   registra *qual asserção* deve falhar; marcar o red sem ter visto o teste
   falhar é violação de gate.
3. **Ordem segue as camadas**: comportamentos de domínio/data antes de
   presentation; infra (adapters) quando o protocolo já existe; main por último
   (composição + rotas).
4. **Checkbox é o estado.** Não há outro registro de progresso. Task feita =
   três fases marcadas + gates do `method.md` verificados.
5. **Um commit por task** (se commits exigidos), mensagem
   `type(scope): descrição imperativa`.
6. Tarefas de avaliação (rubrica + ratchet) entram como última task da feature.
