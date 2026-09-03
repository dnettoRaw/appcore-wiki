---
title: appcore-ai — 0.1 beta
sidebar_position: 23
---

# appcore-ai

:::caution Beta pública
`appcore-ai 0.1.0-beta.3` está publicado no crates.io. A API pode mudar durante
a beta, e o docs.rs pode levar algum tempo para concluir o build de uma nova
release. Ela não adiciona campos aos manifests V1 estáveis.
:::

`appcore-ai` é o core de execução de IA limitado e independente de backend. Ele
escolhe uma rota a partir de modelos, backends, devices, recursos e policy de
privacidade explícitos. A aplicação continua dona dos prompts, validação de
domínio e decisão de aplicar qualquer resultado gerado.

## O que está implementado

| Área | Comportamento atual |
| --- | --- |
| API central | requests/responses tipados, texto/chat/imagem/documento, qualidade e privacidade |
| Caminho rápido | transformações e regras lightweight determinísticas, sem ML |
| Routing | custo local/remoto, escalation limitada e load single-flight por modelo/backend |
| Recursos | snapshots nativos CPU/RAM, topologia unificada/dedicada, admission por device exato, sampling single-flight, batching e residency |
| Artifacts | tamanho + SHA-256, cache atômico no-follow/revalidado, provenance e ranges verificados |
| Generativo | chat com papéis, sampling, tool calls recuperáveis, JSON Schema, contratos de streaming e data URLs de imagem opt-in |
| ML local | Candle CPU e training para o classificador data-only `NativeLinearV1` |
| Operação | cancelamento, deadlines, health e telemetria sem payload |
| Distribuído | contratos Swarm experimentais; sem claim de adapter Peer RPC de produção |

O build default não inclui framework de ML nem adapter HTTP.

A ativação do cache local também é limitada em memória quando o artefato já
existe. Stores idempotentes e corridas entre writers abrem o arquivo regular
sem seguir links, verificam o tamanho exato, comparam e calculam SHA-256
incrementalmente com um buffer fixo de 16 KiB. O artefato completo owned pelo
caller não é duplicado.

## Backends e modelos aceitos

| Feature | Engine/formato | Escopo real |
| --- | --- | --- |
| nenhuma | resolver lightweight | normalização, matching, extração e regras |
| `accelerator-nvidia` | NVIDIA NVML | descoberta read-only opcional de VRAM/utilização no Linux/Windows; sem instalar/controlar driver |
| `backend-candle` | `NativeLinearV1` | classificação CPU in-process |
| `training-candle` | `NativeLinearV1` | SGD reprodutível, checkpoint e resume |
| `backend-openai-compatible` | llama.cpp, MLX-LM, vLLM, SGLang, TensorRT-LLM, OpenVINO, TabbyAPI, generic | chat-completions limitado; SSE nativo exige implementação de transporte streaming |
| `swarm` | bridge fornecida pelo host | contrato autenticado experimental |

O adapter OpenAI-compatible reconhece GGUF para llama.cpp, ONNX para OpenVINO
e SafeTensors para os demais profiles. Quem interpreta e executa esses formatos
é o servidor externo. Registrar um formato nunca instala engine nem baixa
modelo silenciosamente.

## Rodar um LLM local

Inicie o servidor compatível separadamente. Exemplo de listener loopback do
llama.cpp:

```bash
llama-server -m /caminho/absoluto/modelo.gguf --host 127.0.0.1 --port 8080
```

Depois execute o exemplo real com a identidade exata do artifact:

```bash
APPCORE_AI_ENGINE=llama.cpp \
APPCORE_AI_FORMAT=gguf \
APPCORE_AI_BASE_URL=http://127.0.0.1:8080 \
APPCORE_AI_MODEL=nome-exato-no-servidor \
APPCORE_AI_MODEL_SHA256=<digest-hex-de-64-caracteres> \
APPCORE_AI_MODEL_BYTES=<tamanho-exato-do-arquivo> \
cargo run -p appcore-ai --example openai_compatible \
  --features backend-openai-compatible
```

Valores aceitos para engine: `llama.cpp`, `mlx-lm`, `vllm`, `sglang`,
`tensorrt-llm`, `openvino`, `tabbyapi` e `generic`. Cada config liga um
`ModelId` AppCore ao nome exato entendido pelo servidor. Tools, visão, seed e
stop ficam desabilitados até o deployment exato declarar suporte.

`OpenAiCompatibleConfig::local` rejeita endpoints fora de loopback. Um
deployment remoto usa `OpenAiCompatibleConfig::remote` e transporte customizado
apoiado por referências de segredo e policy AppCore. O transporte default
rejeita credenciais.

### Mudanças OpenAI-compatible na beta.2

- respostas não-2xx preservam o status HTTP exato e o delta limitado de
  `Retry-After`; o routing só repete falhas transitórias;
- argumentos malformados de tool call permanecem disponíveis como JSON bruto,
  junto com finish reason, uso e contagem de argumentos inválidos;
- a SPI de transporte retorna futures, enquanto o HTTP bloqueante incluído usa
  um gate de workers limitado em vez de bloquear o executor assíncrono;
- profiles explícitos podem omitir sampling, escolher o campo de limite de
  tokens e acrescentar parâmetros de provider limitados e não reservados;
- output estruturado por JSON Schema usa `response_format` nativo ou fallback
  textual JSON explícito e limitado;
- `resolve_stream` oferece cancelamento cooperativo e backpressure pelo sink.
  SSE nativo só é habilitado quando deployment e transporte customizado
  declaram e implementam streaming. Depois de emitir um evento, uma falha
  transitória é retornada sem misturar output de uma rota fallback.

O decoder limitado analisa frames SSE completos e coalescidos diretamente dos
chunks emprestados pelo transporte. Ele retém somente uma cauda incompleta entre
chamadas e compacta o buffer pendente uma vez por chunk, sem `Vec` temporário ou
deslocamento repetido do body para cada frame.

O trabalho é acompanhado publicamente na
[issue #1](https://github.com/dnettoRaw/app-core-public/issues/1).

## Modelo de execução adaptativo

A forma conceitual voltada à aplicação é:

```rust
let output = app.ai().resolve(request).await?;
```

Por baixo dessa facade, `appcore-ai` mantém seleção de modelo explícita. Um
model registry liga identidade do modelo, proveniência de artifact, suporte de
backend, modalidade, qualidade, privacidade e requisitos de recurso. Backends
decidem como executar a request, mas o runtime continua dono de admission,
cancelamento, health, observabilidade e policy.

`ModelRegistryLimits` torna explícita a retenção de metadata: modelos,
localizações por modelo, localizações agregadas e bytes contabilizados possuem
tetos configuráveis abaixo dos máximos fixos de segurança. Iteradores iniciais
e adições posteriores excessivos falham antes da retenção ou copy-on-write,
enquanto duplicatas continuam idempotentes. `ModelRegistry::pressure` expõe
contagens e bytes atuais/de pico e rejeições sem labels de alta cardinalidade.

A execução pode ser local, remota ou delegada a swarm experimental:

```rust
enum AiExecutionMode {
    Local,
    Swarm,
    Auto,
}
```

`Auto` pode rotear ou escalar entre opções permitidas, mas apenas dentro da
policy declarada. Ele nunca deve mover silenciosamente uma request local-only
para compute remoto.

Perfis de recurso descrevem headroom voluntário do AppCore:

- `Eco`: preferir menor energia e menor uso de memória;
- `Balanced`: trade-off padrão de throughput e latência;
- `Performance`: admitir execução local ou remota mais agressiva;
- `Unrestricted`: remove limites voluntários do AppCore, mas ainda respeita
  proteções de hardware, firmware, driver e sistema operacional.

Compute e storage são preocupações separadas:

```text
COMPUTE: CPU / GPU / NPU / remote
STORAGE: VRAM / RAM / NVMe / peer
```

Um node pode doar compute, storage, ambos ou nenhum. O design de swarm precisa
de contribution policy, checks de integridade, health, failover e accounting
claro antes de virar comportamento de produção.

## Recursos reais de hardware

```bash
cargo run -p appcore-ai --example hardware_report
cargo run -p appcore-ai --example hardware_report \
  --features accelerator-nvidia
```

`SystemHardwareProbe::default()` usa cache on-demand de um segundo com
single-flight: não há thread de polling enquanto AppCore AI está ocioso. Ele lê
topologia/carga da CPU, CPU do processo e RAM disponível por APIs nativas no
macOS, Linux e Windows. Apple Silicon é GPU integrada que compartilha o pool de
RAM. Linux tem descoberta DRM sysfs best-effort de AMD/NVIDIA; a feature
opcional `accelerator-nvidia` carrega a NVML do sistema dinamicamente para VRAM
total/livre/usada e utilização da GPU NVIDIA exata.

Métrica desconhecida fica `None`, nunca zero ou ilimitada. Duas GPUs não são
somadas para caber um modelo: admission, carga e VRAM livre usam o `DeviceId`
exato. Memória unificada é cobrada uma vez, sem pools fictícios de RAM + VRAM.
`Eco`, `Balanced`, `Performance`, `Unrestricted` e `Custom` calculam headroom
voluntário da disponibilidade atual e aplicam hysteresis sob pressão. O mesmo
budget limita batching, residency, treino e contribuição Swarm explícita.

A execução de referência cobre macOS arm64 no Apple M1. Probes Linux/Windows,
incluindo NVML opcional, compilam e têm testes determinísticos, mas não foram
certificados fisicamente neste passe. Sysfs AMD é parcial; térmica/utilização
fora das fontes documentadas e NPU continuam indisponíveis, não simuladas.

## Chat, tools, imagens e PDF

```rust
let request = AiRequest::chat(
    [
        AiMessage::new(AiMessageRole::System, "Responda brevemente.")?,
        AiMessage::new(AiMessageRole::User, "Explique IA local-first.")?,
    ],
    AiLimits::default(),
)?;
let response = runtime.resolve(request).await?;
```

Uma tool possui nome, descrição e JSON Schema limitados. `AiOutput::ToolCalls`
é apenas proposta: a aplicação valida os argumentos e roteia trabalho
autorizado por `appcore-capabilities`. Texto gerado nunca é autoridade de
escrita.

Imagem só é transportada quando backend e modelo declaram suporte. PDF é uma
modalidade de documento para routing, mas a beta não embute parser, rasterizer
nem OCR universal. A aplicação escolhe um processor limitado por páginas,
pixels, bytes expandidos, tempo e output.

## Configurar ou treinar

LLMs generativos são configurados, não treinados, por este crate: execute o
engine, registre metadata e identidade exatas, declare capabilities e deixe o
`AiRuntime` rotear. Fine-tuning e conversão pertencem ao engine.

O trainer implementado é propositalmente menor: classificação local
`NativeLinearV1`. Execute:

```bash
cargo run -p appcore-ai --example candle_training \
  --features training-candle
```

O job limita labels, dimensões de features, dataset, epochs, steps, batch,
learning rate, seed, CPU/RAM e checkpoints. O resultado contém bytes, SHA-256 e
um `ModelDescriptor` pronto para o registry. Isso não é fine-tuning de LLM.

## Integração com uma aplicação

A feature `appcore-bin/ai-alpha` envolve um `AiRuntime` já configurado em
`AppCoreAiComponent`. O Supervisor existente possui startup required/optional,
health, bloqueio de admission, cancelamento e shutdown limitado:

```rust
let component = Arc::new(AppCoreAiComponent::new(Arc::new(ai_runtime), false)?);
let ai = component.facade();
let business = MinhaAplicacao::new(ai);
ManifestApplicationHost::load("application.toml", "deployment.toml", &business)?
    .with_ai(component)
    .run()?;
```

Use `required = true` para falhar startup sem modelo/backend utilizável. Expor
`appcore.ai.resolve` por `appcore-capabilities` exige `AiCapabilityCodec`
limitado e explícito. A seleção declarativa aguarda contrato versionado pós-1.0.

## Qual engine escolher

- llama.cpp: GGUF portátil e execução híbrida CPU/GPU;
- MLX-LM: Apple Silicon;
- TabbyAPI/ExLlama: NVIDIA consumer com baixa concorrência;
- vLLM ou SGLang: serving de alta concorrência;
- TensorRT-LLM: deployments NVIDIA ajustados;
- OpenVINO: Intel CPU/GPU/NPU;
- Candle: apenas o pequeno classificador incluído, não LLM generativo.

Meça engine, revisão, quantização, contexto, batch e device juntos. Registre
cold start, TTFT, tokens/s, requests/s, RAM, VRAM, fila e falhas. Não existe
engine universalmente mais rápido.

## Performance e prontidão beta

O benchmark repetível `perf_lab` gera saída humana ou JSONL e cobre lightweight,
routing, scaling de registry/scheduler, batching, artifacts, Candle/training e
1–1.000 candidatos Swarm. No Apple M1 documentado, resolve quente com 32 rotas
passou de 96,417 us para 21,958 us p50 e batch Candle 32 de 68,959 us para
31,041 us. O relatório também mantém visíveis regressões de batch pequeno e o custo
intencional da proteção no-follow.

Um workload separado com 65.536 localizações de peers antes retinha todas as
entradas e alcançava 7,83 MiB de RSS pico/retido. Com admissão limitada, ele
retém o máximo default de 128 por modelo, rejeita o restante explicitamente e
mediu 1,91 MiB de RSS pico (-75,61%) e 1,89 MiB retido (-75,86%) em cinco
processos Apple M1.

O veredito local é **READY FOR BETA** dentro do escopo documentado. Execução
física Windows/Linux, soak real em aceleradores e adapter Swarm Peer RPC de
produção continuam evidências do programa beta. Isolamento do processo pertence
ao deployment e composição declarativa permanece trabalho pós-1.0; nenhum dos
dois é anunciado por esta beta.

## Segurança, limites e status

- prompts, outputs, endpoints e credenciais são redigidos dos diagnósticos;
- LocalOnly rejeita permissões remotas; rotas remotas exigem grants do tenant;
- filas, attempts, peers, payloads, metadata, tools e artifacts são limitados;
- cancelamento é cooperativo; o worker bloqueante limitado o encaminha para a
  exchange HTTP e transportes streaming o verificam entre chunks;
- modelo exige tamanho exato e SHA-256 antes da ativação;
- `Unrestricted` não desliga proteções do SO ou hardware.

O release beta.2 define streaming, mas o HTTP incluído continua sendo de resposta
completa; o transporte do deployment deve implementar SSE nativo explicitamente.
PDF/OCR, instalação/sandbox automático do engine, Swarm de produção e manifests
declarativos continuam fora do escopo desta beta.
Consulte [guide.pt.md](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ai/wiki/guide.pt.md),
[basic.pt.md](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ai/wiki/examples/basic.pt.md) e
[intermediate.pt.md](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ai/wiki/examples/intermediate.pt.md)
para APIs e exemplos. O [guia exato de recursos](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ai/wiki/resources.pt.md)
documenta matriz de plataforma, custo da dependência, fit de modelo e métricas
operacionais. O [relatório de performance](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ai/wiki/benchmarks.pt.md)
e a [matriz beta](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ai/wiki/release-readiness.pt.md)
ficam versionados com o crate.
