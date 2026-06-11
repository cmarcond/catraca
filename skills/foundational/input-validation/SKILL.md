---
name: input-validation
title: Validação de entrada composta em camada própria
description: Modele cada regra de entrada como um objeto de validação combinável num agregador construído por factory, em camada própria, deixando a borda apenas chamar validate(input).
category: foundational
dependencies:
  - architecture/dependency-inversion-adapters
---

# Input Validation

Validação de **forma** da entrada (obrigatoriedade, formato, comparação entre
campos), não regra de negócio. Cada regra é um objeto que expõe
`validate(input)` e retorna **um erro** ou um **valor-vazio** (conforme a
linguagem: `null`, `None`, `Optional` ausente) significando ausência de erro.
Um **agregador** percorre a lista de regras; a borda de entrada recebe esse
agregador por injeção e só faz `error = validation.validate(input)`.

## When To Use

- Uma **borda de entrada** (rota, comando de CLI, mensagem de fila, item de
  batch) tem campos obrigatórios, formato fixo (ex.: e-mail) ou comparação
  entre campos (ex.: senha × confirmação).
- A intenção/spec define explicitamente os campos da entrada e suas restrições
  de formato.
- Você quer testar cada regra isoladamente e montar conjuntos diferentes por
  borda sem duplicar lógica.

## When Not To Use

- A regra é de **domínio** (saldo suficiente, unicidade contra dados
  existentes) → vai no caso de uso, não aqui.
- A validação depende de **capacidade externa substituível** (banco, API) →
  defina primeiro um protocolo de abstração (ver
  `dependency-inversion-adapters`). Regras puras e locais (ex.: regex de
  formato) **não** exigem abstração.
- A checagem é apenas de tipo estático já garantido pelo compilador.

## Order Of Operations

1. Defina o **contrato de validação**: `validate(input)` devolve um erro ou um
   valor-vazio. Decida se o contrato é síncrono; se alguma regra precisar de
   I/O, padronize o retorno assíncrono para todas.
2. Implemente uma regra por arquivo (campo-obrigatório, formato, comparação).
   Cada uma recebe via construtor só o que precisa (nome do campo, dependência
   abstrata).
3. Quando a regra depender de capacidade **externa substituível**, declare um
   protocolo na camada de validação e injete o adapter. Regra pura local não
   precisa disso.
4. Implemente o **agregador** que percorre a lista de regras.
5. Defina a **política de agregação conforme a intenção do spec**: parar no
   **primeiro erro** ou **coletar todos os erros** (preferível em
   formulários/APIs que reportam o conjunto). A ordem da lista na factory é a
   ordem de avaliação.
6. Crie uma **factory** que monta a lista de regras daquela borda e devolve o
   agregador configurado.
7. Injete o agregador na borda; ela apenas chama `validate` e converte erro em
   resposta de borda (ver `controller-error-boundary`).
8. Mantenha tudo numa **camada própria** de validação que **não depende de UI
   nem do domínio** (ex.: uma pasta `validation/` paralela às demais camadas).

## Test Checklist

- [ ] Cada regra tem teste unitário: caso de erro e caso de sucesso isolados.
- [ ] Comparação entre campos testada com valores iguais e diferentes.
- [ ] Agregador respeita a política escolhida: se primeiro-erro, prova de
      ordenação; se todos-os-erros, prova de coleta completa.
- [ ] Agregador retorna sucesso (valor-vazio) quando todas as regras passam.
- [ ] Factory testada/garante que a lista contém as regras esperadas na ordem
      certa.
- [ ] Teste da borda usa uma regra dublê e verifica que `validate` foi chamado
      com o input correto e que o erro propaga para a resposta.
- [ ] Regra com dependência externa usa dublê do protocolo, sem tocar
      infraestrutura real.

## Anti-Patterns

- Espalhar `if (!field) return badRequest(...)` dentro da borda em vez de
  delegar ao agregador.
- Misturar políticas de agregação sem que a intenção do spec defina qual usar
  (primeiro-erro vs todos-os-erros é trade-off, não defeito — escolha
  explicitamente).
- Regra de validação importar de UI ou domínio, criando dependência cruzada
  entre camadas.
- Colocar regra de negócio dentro de uma regra de validação por conveniência.
- Instanciar regras direto na borda em vez de construí-las por factory.
- Validação que depende de capacidade externa substituível embutida sem
  protocolo, acoplando a uma lib concreta.
