# /catraca.reverse — Engenharia reversa: projeto existente → seed (produto + Gates A–D)

Entrada auxiliar do fluxo. Em vez de partir de um prompt, parte de **código pronto** e
reconstrói o *seed* que, dado ao `/catraca.init`, regeneraria este projeto via TDD +
Clean Architecture. Pré-condição: `.catraca/` instalado + o **path de um projeto-alvo**.
Saída: o seed pronto para colar no `/catraca.init` — opcionalmente `questions.md`
(Gates A–D respondidos) já preenchido para encurtar o init.

> Regra de altitude: a catraca projeta o projeto no eixo **produto + craft** — features
> observáveis, stack, rigor. A história de *escala/sharding/system design* NÃO é dela
> (é do prumo). Se o projeto é um exercício de design com implementação trivial, o seed
> sai magro — e tudo bem.

## Passo 0 — Modo e alvo
- Receba o **path do projeto-alvo**. Modo guiado (default) ou automático.
- Releia `.catraca/manifesto.md` e `method.md`: os mesmos gates de qualidade que regem a
  implementação são a lente pela qual você lê o código existente.

## Passo 1 — Mapear a superfície (o que o projeto faz e como foi construído)
Leia, nesta ordem: superfície de API (rotas, controllers, handlers); modelos de domínio
e use cases; a **suíte de testes** (melhor fonte de comportamento esperado); manifest de
stack (`package.json`/`go.mod`/`requirements.txt`, imports); estrutura de pastas
(camadas, adapters); histórico de git (`git log`) para política de commits e sinais de
red-first.

## Passo 2 — Product spec reversa (voz de negócio)
Destile a **ideia de produto** (2–4 frases: que problema resolve, para quem) e as
**features candidatas** como capacidade observável ("responder enquete"), NUNCA como
endpoint ou classe. Rode o **checklist de leakage** de `specs/README.md`: se uma feature
virou rota/lib/assinatura, reescreva em linguagem de produto.

## Passo 3 — Inverter para os Gates A–D (ler do código real)
Para cada gate, infira a resposta a partir da evidência, citando o arquivo que a
sustenta; marque inferências fracas como `[assumed AAAA-MM-DD]`. Grave em
`./questions.md`:
- **A** objetivo/usuários (do README + superfície de API);
- **B** stack server/client/DB (do manifest e imports), dev local vs containerizado
  (há `Dockerfile`/compose?), Clean Architecture 5 camadas ou 3 (conte as camadas na
  estrutura de pastas), quais libs estão **atrás de adapter** (procure wrappers de
  bcrypt/jwt/orm em `infra`);
- **C** TDD estrito ou pragmático (a suíte cobre cada comportamento? há red-first no
  `git log`?), skills aplicáveis (`skills/index.yaml`), commits (convenção no log);
- **D** modo de avaliação e ratchet.

## Passo 4 — Amostra de specs WHEN/THEN (a partir dos testes)
Para 1–2 features, rascunhe os **acceptance criteria** em WHEN/THEN extraídos dos testes
existentes — incluindo casos de erro — sem citar classe, path ou lib, como amostra do
que o `/catraca.plan` geraria. Rode o checklist de leakage e, se houver suporte a
subagentes, a **revisão adversarial de contexto limpo** (Task) que tenta refutar a spec.

## Passo 5 — Emitir o seed
Monte um bloco **`SEED PARA /catraca.init`** = ideia de produto + features candidatas
(Passo 2) + Gates A–D respondidos com evidência (Passo 3) + a amostra de specs (Passo 4).
Esse bloco é o **prompt extraído**. Em automático, grave também `questions.md` para o
init seguir direto.

## Passo 6 — Validação por round-trip (recomendado)
Rode o seed por `/catraca.init` → `/catraca.plan` e **compare** as `specs/NNN-*.md`
geradas com o comportamento dos testes reais do Passo 1. Cada divergência é uma **lacuna
no seed** (uma feature ou critério que o produto não capturou) — endereça e re-emita.
