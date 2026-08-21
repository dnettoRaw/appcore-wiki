---
title: appcore-ai — Em breve
sidebar_position: 23
---

# appcore-ai

:::caution Em breve
O `appcore-ai` está em desenvolvimento e **ainda não foi publicado**. No
momento, ele não está disponível no crates.io nem no docs.rs e não deve ser
usado como dependência.
:::

O `appcore-ai` é o crate planejado para suporte a IA no AppCore. A intenção é
trazer acesso a modelos, execução de prompts, chamadas de ferramentas,
fronteiras de memória e observabilidade de runtime para o mesmo modelo
manifest-first usado pelo restante do AppCore.

O crate não deve tornar comportamento de IA mágico ou implícito. O código da
aplicação continua dono das decisões de produto, regras de domínio e
experiência do usuário. O `appcore-ai` fica responsável pela fronteira de
runtime em torno do trabalho com IA: o que pode executar, qual provider foi
selecionado, como secrets são resolvidos, como chamadas são rastreadas e quais
capabilities um modelo pode invocar.

## Responsabilidade

O `appcore-ai` é planejado para cobrir:

- contratos de provider para chat, completion, embeddings e geração estruturada;
- envelopes de prompt e request com entrada limitada, metadados e trace context;
- seleção de provider por configuração do deployment;
- integração de tool calls com `appcore-capabilities`;
- verificações de policy para acesso a modelo, operações de escrita e contextos sensíveis;
- adapters locais e remotos sem acoplar a aplicação a um SDK de vendor;
- fronteiras opcionais de memória e retrieval mantendo dados de negócio sob dono da aplicação;
- eventos de observabilidade para ciclo de vida da request, latência, uso, falhas e decisões de policy.

Ele não deve ser dono de prompts de negócio, agentes específicos da aplicação,
modelos de dados do cliente, fluxos de UI ou regras de automação de produto.
Essas partes continuam no código da aplicação.

## Fronteira de Runtime

A fronteira planejada segue a mesma divisão usada no AppCore:

| Dono | Possui | Não possui |
| --- | --- | --- |
| Application manifest | declara quais capabilities de IA a aplicação precisa | provider IDs, API keys, endpoints |
| Deployment manifest | escolhe provider, família de modelo, limites e secret refs | prompts de negócio ou policy de domínio |
| Código da aplicação | constrói prompts, valida intenção de domínio, trata respostas | wiring de provider, carga de secrets, fallback |
| `appcore-ai` | valida requests, chama providers, registra traces, aplica policy de IA | decisões da aplicação ou efeitos colaterais escondidos |

A regra importante é explicitude. Um deployment que quer provider remoto
compatível com OpenAI, runtime local de modelo, gateway privado ou fake de teste
deve escolher esse provider deliberadamente. Providers ausentes ou incompatíveis
devem falhar no startup ou na validação da request, sem fallback silencioso.

## Conceitos Planejados

### Providers de IA

Providers devem expor um contrato pequeno de runtime em vez de um SDK específico
de vendor. Um provider pode suportar uma ou mais operações:

- geração conversacional;
- completion de prompt único;
- saída JSON estruturada;
- embeddings;
- ranking ou reranking;
- moderação ou classificação de segurança;
- respostas em streaming.

Cada provider deve documentar autenticação, timeouts, retries, limites de
payload, modelos suportados, garantias de streaming, persistência e regras de
redação.

### Perfis de modelo

Um perfil de modelo é a descrição, voltada ao deployment, da escolha de modelo.
Ele pode representar um modelo remoto hospedado, servidor local de inferência,
gateway específico de tenant ou fake usado em testes.

Perfis são planejados para manter a escolha do modelo fora do código de
negócio. A aplicação deve pedir uma capability declarada, como resumo,
extração, classificação ou planejamento com ferramentas. O deployment decide
qual modelo concreto satisfaz essa capability.

### Envelopes de prompt

A execução de prompt deve passar por um envelope com:

- application ID, installation ID e trace ID;
- capability solicitada;
- payload de entrada e formato de saída declarado;
- metadados de segurança e classificação de dados;
- timeout, tamanho e preferências de streaming;
- idempotency ou modo de operação quando a request puder acionar ferramentas.

Isso dá contexto suficiente para o runtime rejeitar entradas grandes demais,
anexar observabilidade, aplicar policy e evitar escritas operacionais
acidentais.

### Tool calls

Tool calls devem usar o modelo existente de capabilities em vez de dar ao modelo
acesso direto a internals arbitrários da aplicação. Um modelo pode propor uma
chamada de ferramenta, mas o AppCore deve roteá-la por descriptors declarados,
autorização e verificações de modo de escrita.

O fluxo pretendido é:

1. O código da aplicação envia uma request de IA com um conjunto permitido de ferramentas.
2. O `appcore-ai` envia a request para o provider selecionado.
3. O provider retorna texto, dado estruturado ou uma proposta de tool call.
4. O `appcore-ai` valida a tool call proposta contra o catálogo de capabilities.
5. A aplicação ou o runtime executa apenas capabilities autorizadas.
6. Os resultados retornam ao modelo ou ao código da aplicação conforme o fluxo declarado.

Saída de IA nunca é autoridade por si só. O código de domínio ainda valida ações
propostas antes de gravar estado de negócio.

### Memória e retrieval

O `appcore-ai` pode oferecer contratos de runtime para retrieval e memória, mas
não deve transformar o storage do AppCore em um banco vetorial genérico. A
fronteira planejada é:

- embeddings e requests de retrieval passam por contratos de provider;
- o código da aplicação decide quais dados são indexados;
- o deployment escolhe onde índices vivem;
- secrets e credenciais ficam em configuração de provider;
- memória persistida deve ser escopada por aplicação, tenant e policy.

Memória de longo prazo deve ser explícita e inspecionável. O crate deve evitar
memória escondida entre tenants, acúmulo ilimitado de prompts e canais laterais
do provider que contornem storage e policy de segurança do AppCore.

## Modelo de Segurança

Chamadas de IA atravessam uma fronteira de alto risco porque prompts podem
conter conteúdo de usuário, dados privados, instruções geradas e resultados de
ferramentas. O `appcore-ai` é planejado para tratar essa fronteira como
infraestrutura de runtime.

O crate deve aplicar ou expor hooks para:

- secret refs em vez de API keys inline;
- logs seguros para redação;
- limites de tamanho de request e response;
- limites de timeout e retry;
- escopo por tenant e installation;
- checks de policy antes de chamadas remotas;
- allowlists explícitas para tool calls;
- checks de write-mode e liderança antes de ações operacionais;
- razões auditáveis quando uma request é rejeitada.

Aplicações ainda precisam de suas próprias regras de segurança de produto. O
runtime consegue aplicar fronteiras mecânicas, mas não consegue decidir se uma
resposta gerada está correta para um domínio de negócio específico.

## Observabilidade

Comportamento de IA precisa de visibilidade operacional sem vazar prompts por
padrão. A superfície planejada de observabilidade deve registrar:

- provider e perfil de modelo selecionados;
- início, progresso de stream e conclusão da request;
- latência, timeout e contagem de retries;
- tokens, unidades ou custos quando o provider expõe esses dados;
- decisões de policy aceitas ou rejeitadas;
- propostas de tool call e resultados de execução;
- classes de erro redigidas.

Log bruto de prompts e completions deve ser opt-in e controlado por policy. Os
diagnósticos padrão devem ajudar operação sem armazenar conteúdo sensível por
acidente.

## Forma de Uso

A API Rust pública ainda não é final, mas o formato de uso pretendido é:

```rust
// Forma conceitual apenas. appcore-ai ainda não foi publicado.
let answer = app.ai()
    .capability("notes.summarize")
    .input(note_text)
    .expect_json::<Summary>()
    .run()
    .await?;
```

Para fluxos com ferramentas, a aplicação declararia quais capabilities podem ser
usadas:

```rust
// Forma conceitual apenas. appcore-ai ainda não foi publicado.
let plan = app.ai()
    .capability("orders.assistant")
    .allow_tool("orders.quote.read")
    .allow_tool("orders.quote.propose_update")
    .input(user_request)
    .run()
    .await?;
```

Esses exemplos descrevem a direção, não uma API estável.

## Forma de Deployment

Um futuro deployment manifest poderá escolher infraestrutura de IA da mesma
forma que escolhe outros providers:

```toml
# Forma conceitual apenas. appcore-ai ainda não foi publicado.
[providers.ai]
provider_id = "openai-compatible"
model_profile = "business-assistant"
api_key = "env:APPCORE_AI_API_KEY"

[ai.profiles.business-assistant]
chat_model = "configured-by-deployment"
embedding_model = "configured-by-deployment"
timeout_ms = 30000
max_input_bytes = 65536
```

As chaves exatas do manifest ainda não são estáveis. O objetivo de design é
estável: artifacts de aplicação declaram necessidades de IA, deployments
escolhem a infraestrutura concreta.

## Testes

O crate deve suportar testes determinísticos sem chamadas remotas de rede.
Superfícies planejadas de teste incluem:

- providers fake com respostas roteirizadas;
- fixtures de validação de saída estruturada;
- testes de autorização de tool call;
- testes de timeout e retry;
- asserts de redação e observabilidade;
- casos de rejeição por policy para operações inseguras ou não declaradas.

Aplicações devem testar comportamento de domínio ao redor da saída de IA como
lógica de negócio comum. Uma resposta de modelo deve ser tratada como entrada
que ainda precisa de validação.

## Limitações

- `appcore-ai` não substitui design de produto nem regras de domínio.
- Ele não deve esconder escolha de provider dentro do código da aplicação.
- Ele não deve aplicar fallback silencioso para um modelo mais fraco ou barato.
- Ele não deve armazenar prompts, completions ou memória sem policy explícita.
- Ele não deve dar aos modelos acesso direto de escrita no estado da aplicação.
- Ele não deve tornar conteúdo gerado confiável sem validação.
- API, fronteira de dependências, chaves de manifest, versão, MSRV e exemplos continuam provisórios até o crate ser publicado.
