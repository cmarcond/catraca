# Tasks — 000 Esteira de Qualidade

> Feature obrigatória que precede qualquer feature de produto (skill
> `workflows/quality-pipeline`: "gates automáticos, não disciplina"). Não vem
> de `product.md` — vem do método. Não segue ciclo red/green/refactor: cada
> ferramenta entra como um **chore** separado, e o equivalente do "red" é
> **provocar uma violação e ver o gate reprovar**. Adapte as ferramentas à
> stack de `architecture.md`; os gates abaixo são o invariável.

Skills ativas: `workflows/quality-pipeline`, `workflows/git-conventions`,
`domain-conventions/project-structure`

## Tasks

### T0.0 — Mapear necessidades → propor ferramentas para esta plataforma

As **necessidades** são fixas (tabela "Necessidades" da skill
`quality-pipeline`): verificação de tipos (se a linguagem tiver), lint
zero-warnings, validação de mensagem de commit, pre-commit sobre o staged,
testes por escopo, cobertura como gate. As **ferramentas** que as implementam
dependem da plataforma de `architecture.md`.

- [ ] tabela necessidade → ferramenta proposta preenchida abaixo
- [ ] **modo guiado**: proposta apresentada ao usuário e confirmada;
      **modo automático**: registrada como `[assumed]` em `questions.md`

| Necessidade | Ferramenta proposta (para esta stack) |
|---|---|
| Verificação de tipos | |
| Lint zero-warnings | |
| Hook de mensagem de commit | |
| Pre-commit staged-only (lint+testes) | |
| Test runner por escopo | |
| Cobertura como gate | |

### T0.0b — Ambiente containerizado *(somente se G2b = containerizado)*

- [ ] devcontainer/Dockerfile + compose com os serviços da stack
- [ ] suíte e hooks executam **dentro** do container (pre-commit do host
      delega ao container)
- [ ] **prova do gate**: container sobe do zero e a suíte roda nele; hooks
      reprovam de dentro do container
- [ ] commit `chore: ...`

(Se G2b = local, pule esta task: infraestrutura de teste é efêmera — banco em
memória ou container descartável só durante a suíte — e nada é instalado como
serviço na máquina.)

### T0.1 — Esqueleto do projeto + verificação de tipos como primeiro gate

- [ ] estrutura de diretórios por camada (conforme `architecture.md`)
- [ ] compilador/type-checker em modo estrito; comando de verificação roda e
      reprova com erro de tipo provocado (prova do gate)
- [ ] commit `chore: ...`

### T0.2 — Lint com zero warnings

- [ ] linter configurado (padrão da stack); zero warnings é o critério
- [ ] **prova do gate**: violação de estilo provocada é reprovada
- [ ] commit `chore: ...`

### T0.3 — Hook de mensagem de commit

- [ ] hook `commit-msg` valida conventional commits (`type: descrição`)
- [ ] **prova do gate**: commit com mensagem inválida é rejeitado
- [ ] commit `chore: ...`

### T0.4 — Pre-commit rodando lint + testes sobre o staged

- [ ] hook `pre-commit` roda lint e testes relacionados **apenas dos arquivos
      staged** (rápido o bastante para ninguém querer `--no-verify`)
- [ ] **prova do gate**: arquivo staged com lint quebrado ⇒ commit reprovado
- [ ] commit `chore: ...`

### T0.5 — Test runner com escopos + gate de cobertura

- [ ] runner configurado com scripts por escopo (unitário, integração, ci)
- [ ] cobertura medida com alvo do perfil (`method.md`); queda reprova
- [ ] **prova do gate**: teste falhando provocado ⇒ suite reprova
- [ ] commit `chore: ...`

### T0.6 — Verificação fim a fim da esteira

- [ ] sequência completa provada: mensagem inválida reprovada; lint quebrado
      reprovado no pre-commit; teste vermelho reprova a suite; tudo corrigido
      ⇒ commit passa
- [ ] registro das provas (saídas dos comandos) para a rubrica
- [ ] commit `chore: ...` (se sobrou ajuste)

### T-final — Avaliação da feature

- [ ] rubrica preenchida em `../evaluation/000-esteira-de-qualidade.md`
      (Test Checklist da `quality-pipeline`: gate reprova por convenção;
      `--no-verify` desnecessário; pre-commit só no staged; baseline de
      cobertura registrado)
- [ ] `ratchet.json` atualizado
