---
title: appcore-ai — 0.1 alpha
sidebar_position: 23
---

# appcore-ai

:::caution Alpha disponível no código-fonte
`appcore-ai` está implementado no workspace do AppCore Runtime como
`0.1.0-alpha`, mas ainda não foi publicado no crates.io nem no docs.rs. A API
pode mudar durante o alpha e não adiciona campos aos manifests V1 congelados.
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
| Recursos | admission de CPU/RAM/VRAM, fila justa limitada, planners de batching e residency |
| Artifacts | tamanho + SHA-256, cache atômico, provenance e leitura verificada por ranges |
| Generativo | chat com papéis, sampling, tools/tool calls e data URLs de imagem opt-in |
| ML local | Candle CPU e training para o classificador data-only `NativeLinearV1` |
| Operação | cancelamento, deadlines, health e telemetria sem payload |
| Distribuído | contratos Swarm experimentais; sem claim de adapter Peer RPC de produção |

O build default não inclui framework de ML nem adapter HTTP.

## Backends e modelos aceitos

| Feature | Engine/formato | Escopo real |
| --- | --- | --- |
| nenhuma | resolver lightweight | normalização, matching, extração e regras |
| `backend-candle` | `NativeLinearV1` | classificação CPU in-process |
| `training-candle` | `NativeLinearV1` | SGD reprodutível, checkpoint e resume |
| `backend-openai-compatible` | llama.cpp, MLX-LM, vLLM, SGLang, TensorRT-LLM, OpenVINO, TabbyAPI, generic | chat-completions limitado e sem streaming |
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
modalidade de documento para routing, mas o alpha não embute parser, rasterizer
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

## Segurança, limites e status

- prompts, outputs, endpoints e credenciais são redigidos dos diagnósticos;
- LocalOnly rejeita permissões remotas; rotas remotas exigem grants do tenant;
- filas, attempts, peers, payloads, metadata, tools e artifacts são limitados;
- cancelamento é cooperativo; o HTTP bloqueante observa antes/depois da exchange;
- modelo exige tamanho exato e SHA-256 antes da ativação;
- `Unrestricted` não desliga proteções do SO ou hardware.

Streaming de tokens, PDF/OCR, instalação/sandbox automático do engine, Swarm de
produção e manifests declarativos não foram entregues em `0.1.0-alpha`. Consulte
`crates/appcore-ai/wiki` no repositório Runtime para APIs, exemplos, modelos,
benchmarks, threat model e gates completos.
