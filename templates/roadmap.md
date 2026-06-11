# Roadmap

> Gerado por `/catraca.plan` a partir de `product.md`. Features ordenadas por
> dependência de domínio (o que precisa existir antes). Confirmado no Gate E
> (G11). Um checkbox por feature; o estado real mora aqui.

| # | Feature | Depende de | Spec | Status |
|---|---|---|---|---|
| 000 | Esteira de qualidade (obrigatória, vem do método) | — | — (sem spec; tasks de `tasks/TASKS-000-TEMPLATE.md`) | ☐ tasks ☐ implementada ☐ avaliada |
| 001 | | 000 | `specs/001-….md` | ☐ spec ☐ tasks ☐ implementada ☐ avaliada |

## Notas de ordenação

<!-- Por que esta ordem (ex.: login depende de cadastro; resultados dependem de
     respostas). -->

A feature 000 é fixa: nenhuma feature de produto começa antes de a esteira de
qualidade estar instalada e provada (gates de type-check, lint, commit-msg,
pre-commit staged-only e cobertura reprovando automaticamente — skill
`workflows/quality-pipeline`).
