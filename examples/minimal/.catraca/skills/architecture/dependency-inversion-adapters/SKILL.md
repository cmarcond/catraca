---
name: dependency-inversion-adapters
title: Inversão de dependência, protocolos e adapters
description: Depender de protocolos injetados via construtor, encapsular libs externas atrás de adapters e centralizar a composição no ponto de entrada, mantendo a regra de negócio independente de framework e infraestrutura.
category: architecture
dependencies: []
---

# Inversão de dependência, protocolos e adapters

Princípio central: um componente de regra de negócio depende de protocolos que
ele mesmo declara, recebe as implementações por injeção (tipicamente o
construtor), e a montagem da cadeia de objetos fica concentrada num único
ponto de composição no ponto de entrada da aplicação. Assim a regra não
importa nem instancia infraestrutura concreta.

> Nomenclatura **ilustrativa** (adapte ao seu stack): camadas
> `data`/`presentation`/`infra`/`main`, fábricas `makeX()` na composição. Em
> outro stack, traduza para o equivalente (ex.: módulo de bootstrap ou DI
> container).

## When To Use

- Um caso de uso ou controlador precisa de I/O ou colaborador externo: banco,
  criptografia, token, HTTP, fila, relógio.
- Vai entrar uma lib de terceiros (hash, token, validador, driver) no fluxo de
  negócio.
- É preciso compor um caso de uso com suas dependências de I/O no ponto de
  entrada (montar controller/caso de uso para uma rota, middleware ou
  resolver).
- *(quando aplicável)* Um mesmo comportamento precisa ser exposto por mais de
  um transporte.

## When Not To Use

- Código de teste puro (dublês e SUT são consumidores do protocolo, não
  definem nova fronteira).
- Função utilitária pura, sem efeito colateral e sem cruzar fronteira de
  camada.
- Dependência trivial, value object ou configuração imutável que pode ser
  passada direto como argumento sem ganho real de substituição.

## Order Of Operations

1. Identifique a fronteira de camada: o que a regra precisa, não como é feito
   (ex.: "criptografar", não o nome da lib). Fronteira de camada = transição
   entre a regra de negócio e detalhe substituível (I/O, lib, transporte).
2. Declare o protocolo na camada que **consome** a dependência. Agrupe métodos
   coesos que tendem a ser usados pelo mesmo colaborador; um protocolo por
   **responsabilidade**, não necessariamente um por método.
3. Faça o componente receber esse protocolo por injeção; evite instanciar a
   dependência substituível dentro dele.
4. Implemente o concreto na camada externa. Se é lib de terceiros, crie um
   Adapter que implementa o protocolo interno e isola o import da lib.
5. Concentre a instanciação da cadeia num único ponto de composição; o ponto
   de entrada consome só esse composer.
6. *(quando aplicável)* Para um novo transporte, escreva um adapter
   transporte→componente e reaproveite o componente existente em vez de
   duplicar a regra.
7. No teste, o dublê implementa o mesmo protocolo — sem tocar na implementação
   real.

## Test Checklist

- [ ] O componente pode ser construído com dublês de todos os protocolos, sem
      rede/banco real.
- [ ] Existe teste verificando que o componente chama cada dependência com os
      valores corretos.
- [ ] O componente propaga/trata erro lançado pela dependência.
- [ ] A instanciação de concretos que cruzam fronteira de camada ocorre só no
      ponto de composição.
- [ ] Nenhum import de lib de terceiros aparece dentro da regra de negócio
      (fica restrito a adapters/infra).
- [ ] *(quando há adapter de lib externa)* O adapter tem teste próprio que
      isola/mocka só a lib.
- [ ] *(quando há múltiplos transportes)* A regra é exercitada uma vez; o
      adapter de transporte é testado isolado.

## Anti-Patterns

- Instanciar dependência concreta substituível dentro do componente de
  negócio.
- Importar a lib de terceiros direto na regra de negócio em vez de atrás de um
  adapter.
- Interface gorda: um protocolo com muitos métodos não relacionados. Sinal
  oposto (fragmentação): um enxame de protocolos de um método só, todos usados
  juntos pelo mesmo colaborador — nesse caso, agrupe.
- Ponto de composição que faz mais que construir (validação, regra, branching
  de negócio).
- Duplicar regra de negócio por transporte (copiar lógica de um controller
  para um resolver).
- Adapter de transporte com ramificação de regra de negócio: ele só traduz
  request→entrada e resultado→response.
