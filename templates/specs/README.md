# Specs — Como Escrever (e a Barreira Intenção/Solução)

Uma spec por feature, nomeada `NNN-slug.md` (numeração sequencial do roadmap).
Use `FEATURE-TEMPLATE.md` como base.

## A regra de ouro

**Spec é intenção; skill é solução.** A spec descreve o que o sistema faz em
linguagem de comportamento. O *como construir com qualidade* já está escrito
nas skills — a spec apenas as referencia por id.

Proibido em specs:

- nomes de classes, arquivos, paths, funções ou assinaturas;
- nomes de bibliotecas ou tecnologias (isso mora em `architecture.md`);
- copiar o conteúdo de uma skill para dentro da spec.

Permitido e esperado:

- comportamento observável em formato WHEN/THEN;
- vocabulário do domínio (conta, enquete, resposta…);
- códigos de status e formatos de resposta *do contrato externo* (ex.: "retorna
  403"), pois são comportamento, não estrutura interna.

## Checklist de leakage (antes de fechar a spec)

- [ ] Nenhuma frase desta spec menciona classe, arquivo, lib ou assinatura.
- [ ] Cada criterio é verificável por um teste de comportamento.
- [ ] O que for decisão técnica foi movido para `architecture.md`.
- [ ] As skills referenciadas existem em `skills/index.yaml`.

## Checklist adversarial (revisão de contexto limpo, antes do G12)

O revisor recebe só `product.md`, `architecture.md` e a spec — e tenta
**refutar**:

- [ ] **Semântica de borda**: os status distinguem não-autenticado de
      não-autorizado (tipicamente 401 vs 403)? Se não distinguem, é decisão
      deliberada ou hábito?
- [ ] **Testabilidade**: cada criterio WHEN/THEN é verificável por um teste de
      comportamento, sem interpretação?
- [ ] **Consistência de papéis**: as permissões batem com os perfis do
      `product.md`? Há papel citado sem regra, ou regra sem papel?
- [ ] **Casos negativos**: entrada inválida, ausência e falha interna têm
      criterio próprio?
- [ ] **Vazamento de solução**: algum termo é tecnologia/estrutura disfarçada
      de comportamento?
- [ ] **Contradições**: algum criterio conflita com outra spec ou com o
      fora-de-escopo?

Achado não é ordem: o autor acata ou refuta com justificativa — mas por
escrito, na spec.

## De onde vêm os critérios técnicos?

Os acceptance criteria da spec são comportamentais. Os critérios *técnicos*
(como testar, como estruturar) o agente deriva, na hora de implementar, das
seções **Test Checklist** das skills referenciadas — exatamente como no Modo B
do benchmark que validou este método.
