---
name: test-setup-factories
title: "Factories de setup: SUT, dados e dublês compartilhados"
description: Centraliza o arranjo dos testes em factories — uma que constrói o SUT retornando-o junto com seus dublês, e factories de dados reutilizáveis — para que mudanças no construtor ou nos models toquem um lugar só.
category: testing
dependencies: []
---

# Test Setup Factories

**Princípio invariante:** centralize o arranjo (arrange) dos testes em
factories, para que uma mudança no construtor do componente ou na forma de um
model toque **um** ponto, não cada spec.

Há duas factories complementares:

1. Uma **factory do componente sob teste** que monta os dublês, instancia o
   componente e devolve o componente **junto com** os dublês que algum teste
   precise configurar ou inspecionar.
2. **Factories de dados** que produzem objetos/entradas de teste
   reutilizáveis, em vez de literais duplicados.

> Em stacks sem injeção por construtor ou sem tipos, mantenha o princípio (um
> helper que devolve o sujeito + seus colaboradores) e adapte a forma.

## When To Use

- O componente tem **duas ou mais** dependências injetadas (ou você já prevê
  que terá).
- O mesmo dado de teste ou dublê se repete em **dois ou mais** specs.
- A mesma dependência é dublada em camadas/módulos distintos.

## When Not To Use

- Função pura/isolada sem dependências e sem setup repetido.
- Um único spec consome o dado e nenhum outro precisa dele.
- Quando a factory esconderia o detalhe exato que o teste precisa afirmar
  (caso de borda específico) — aí prefira override explícito ou literal local.

## Order Of Operations

1. **Crie uma factory de construção do SUT** que instancia os dublês, monta o
   componente e retorna o componente **com** seus dublês. Cada teste extrai só
   o que usa.
2. **Mantenha paridade com o construtor real**: a ordem e o conjunto de dublês
   devem refletir as dependências reais. Ao adicionar uma dependência,
   atualize **só** a factory.
3. **Extraia dados repetidos** para factories de dados nomeadas e importáveis.
   Substitua literais duplicados pelas chamadas.
4. **Exponha variação por override**, não por duplicação: a factory de dados
   deve aceitar parâmetros/overrides (ex.: um objeto parcial mesclado sobre o
   padrão) para que um teste de borda altere só o campo relevante sem recriar
   o objeto inteiro.
5. **Promova dublês recorrentes a um módulo compartilhado** apenas quando
   realmente reusados por mais de um consumidor. Substitua as cópias locais
   por imports — e **varra todos os specs** que importavam a versão local para
   não deixar migração pela metade.
6. **Faça as factories evoluírem com os models**: quando o domínio muda,
   ajuste a factory, não cada assert.

## Test Checklist

O checklist verifica o **princípio**, não nomes específicos. Não reprove uma
suíte por usar outra nomenclatura.

- [ ] Todo teste com dependências obtém o componente via a factory de
      construção.
- [ ] A factory devolve o componente e cada dublê que algum teste precise
      configurar/inspecionar.
- [ ] Nenhum literal de dado duplicado entre specs — virou factory de dados.
- [ ] Adicionar uma dependência ao construtor exigiu mudança só na factory de
      construção.
- [ ] Casos de borda usam override/parâmetro da factory, sem reconstruir o
      objeto inteiro.
- [ ] Dublê compartilhado só foi promovido a módulo comum quando há reuso
      real, sem cópias locais remanescentes.
- [ ] Cada teste ainda deixa visível o arranjo específico de que depende.

## Anti-Patterns

- **Setup genérico demais**: factory tão rica que esconde o arranjo específico
  de um teste — o leitor não vê por que ele passa.
- **Mock central inchado**: dado falso com muitos campos acopla testes a
  atributos que nem usam.
- **Borda mascarada**: factory que devolve sempre o caso feliz; quando o borda
  importa, varie-o **explicitamente** via override no teste.
- **Factory desalinhada do construtor**: não reflete as dependências reais,
  dando falsa confiança.
- **Promoção prematura a módulo compartilhado**: extrair um dublê para um
  arquivo comum entre camadas cria acoplamento entre elas; só compartilhe sob
  reuso real.
- **Migração parcial**: extrair para módulo compartilhado sem remover as
  cópias locais.

## Convenções sugeridas (opcionais)

Úteis para legibilidade, não obrigatórias:

- O componente sob teste se chama `sut`; a factory, `makeSut()`, devolve
  `{ sut, ...dublês }`.
- Prefixos consistentes: `mock*`/`fake*` para dados e dublês; `make*` para
  construção. O valor está na **consistência**, não na escolha do prefixo.
- Dublês compartilhados vivem na árvore de testes, espelhando a estrutura de
  produção (ver `project-structure`).
