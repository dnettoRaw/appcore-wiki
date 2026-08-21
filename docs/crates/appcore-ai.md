---
title: appcore-ai — 0.1 alpha
sidebar_position: 23
---

# appcore-ai

:::caution Source-only alpha
`appcore-ai` is implemented in the AppCore Runtime workspace as
`0.1.0-alpha`, but is not yet published on crates.io or docs.rs. Its API may
change during the alpha line. It does not add fields to frozen V1 manifests.
:::

`appcore-ai` is the bounded, backend-neutral AI execution core for AppCore. It
chooses a route from explicit models, backends, devices, resource policy and
privacy constraints. Applications still own prompts, domain validation and the
decision to apply any generated result.

## What is implemented

| Area | Current behavior |
| --- | --- |
| Core API | typed requests/responses, text/chat/image/document modalities, quality and privacy policy |
| Fast path | deterministic lightweight transformations and rules, with no ML dependency |
| Routing | cost-aware local/remote planning, bounded escalation and per-model/backend single-flight load |
| Resources | CPU/RAM/VRAM admission, fair bounded execution queue, batching and residency planners |
| Artifacts | exact size + SHA-256, atomic local cache, provenance boundary and verified segment range reads |
| Generative | role-aware chat, sampling, tool definitions/calls and opt-in image data URLs |
| Local ML | optional Candle CPU inference and training for the data-only `NativeLinearV1` classifier |
| Operations | cancellation, deadlines, health summaries and payload-free metrics/observations |
| Distributed | experimental Swarm contracts; no production Peer RPC adapter is claimed |

The default feature set contains no ML framework or HTTP adapter.

## Backend and model support

| Feature | Engines or format | Actual scope |
| --- | --- | --- |
| none | lightweight resolver | normalization, matching, extraction and rule-driven answers |
| `backend-candle` | `NativeLinearV1` | in-process CPU classification |
| `training-candle` | `NativeLinearV1` | reproducible bounded SGD, checkpoint and resume |
| `backend-openai-compatible` | llama.cpp, MLX-LM, vLLM, SGLang, TensorRT-LLM, OpenVINO, TabbyAPI, generic server | bounded non-streaming chat-completions transport |
| `swarm` | host-supplied bridge | authenticated planning/execution contract, experimental |

The OpenAI-compatible adapter recognizes GGUF for llama.cpp, ONNX for
OpenVINO, and SafeTensors for the other listed profiles. The external server,
not `appcore-ai`, parses and executes those formats. Registering a format never
silently installs an engine or downloads a model.

## Run a local generative model

First start a compatible server separately. A llama.cpp deployment commonly
uses a loopback listener like this:

```bash
llama-server -m /absolute/path/model.gguf --host 127.0.0.1 --port 8080
```

Then run the executable AppCore example with the real artifact identity:

```bash
APPCORE_AI_ENGINE=llama.cpp \
APPCORE_AI_FORMAT=gguf \
APPCORE_AI_BASE_URL=http://127.0.0.1:8080 \
APPCORE_AI_MODEL=my-server-model-name \
APPCORE_AI_MODEL_SHA256=<64-hex-digest> \
APPCORE_AI_MODEL_BYTES=<exact-file-size> \
cargo run -p appcore-ai --example openai_compatible \
  --features backend-openai-compatible
```

Accepted engine values are `llama.cpp`, `mlx-lm`, `vllm`, `sglang`,
`tensorrt-llm`, `openvino`, `tabbyapi`, and `generic`. Each
`OpenAiCompatibleConfig` binds one AppCore `ModelId` to the exact model name
understood by that server. Tools, vision, seed and stop support are disabled
until the exact deployment declares them.

`OpenAiCompatibleConfig::local` rejects non-loopback endpoints. A remote
deployment must use `OpenAiCompatibleConfig::remote` and a custom
`OpenAiCompatibleTransport` backed by AppCore secret references and policy.
The built-in unauthenticated transport rejects credentials.

## Adaptive execution model

The conceptual application-facing shape is:

```rust
let output = app.ai().resolve(request).await?;
```

Under that facade, `appcore-ai` keeps model selection explicit. A model registry
binds model identity, artifact provenance, backend support, modality, quality,
privacy and resource requirements. Backend SPI implementations decide how to
execute a request, but the runtime still owns admission, cancellation, health,
observability and policy.

Execution can be local, remote or delegated to an experimental swarm:

```rust
enum AiExecutionMode {
    Local,
    Swarm,
    Auto,
}
```

`Auto` may route or escalate across allowed options, but only inside declared
policy. It should never silently move a local-only request to remote compute.

Resource profiles are intended to describe voluntary AppCore headroom:

- `Eco`: prefer lower energy and smaller memory footprint;
- `Balanced`: default throughput and latency trade-off;
- `Performance`: admit more aggressive local or remote execution;
- `Unrestricted`: remove voluntary AppCore limits while still respecting
  hardware, firmware, driver and operating-system protections.

Compute and storage are separate concerns:

```text
COMPUTE: CPU / GPU / NPU / remote
STORAGE: VRAM / RAM / NVMe / peer
```

A node may contribute compute, storage, both or neither. Swarm design therefore
needs contribution policy, integrity checks, health reporting, failover and
clear accounting before it can be production behavior.

## Chat and tool calls

```rust
let request = AiRequest::chat(
    [
        AiMessage::new(AiMessageRole::System, "Answer briefly.")?,
        AiMessage::new(AiMessageRole::User, "Explain local-first AI.")?,
    ],
    AiLimits::default(),
)?;
let response = runtime.resolve(request).await?;
```

Tool declarations carry a bounded name, description and JSON Schema. A returned
`AiOutput::ToolCalls` value is only a proposal: application code must validate
the JSON arguments and route authorized work through `appcore-capabilities`.
Generated text is never authority for a write.

## Images and documents

Image input is transported only when both backend and model declare image
support. The current compatible adapter encodes admitted `image/*` bytes as a
data URL and enforces request limits.

PDF is a first-class document modality for routing, but this alpha deliberately
does not embed a universal PDF parser, rasterizer or OCR stack. Applications
must select a bounded document backend that caps pages, pixels, expanded bytes,
time and output. Do not send arbitrary PDFs to the chat adapter and assume they
were parsed.

## Configure or train a model

Generative LLM weights are configured, not trained, by this crate: run the
chosen engine, register exact model metadata and artifact identity, declare its
capabilities, then let `AiRuntime` route requests. Fine-tuning and model
conversion remain engine-owned.

The implemented trainer is intentionally narrower: local text classification
for `NativeLinearV1`. Run its reproducible example:

```bash
cargo run -p appcore-ai --example candle_training \
  --features training-candle
```

The job explicitly bounds labels, hashed input dimensions, dataset size,
epochs, optimizer steps, batch, learning rate, seed, CPU/RAM, checkpoint
frequency and retained checkpoints. Its output contains artifact bytes,
SHA-256 identity and a registry-ready `ModelDescriptor`. This is not LLM
fine-tuning.

## AppCore application integration

The `appcore-bin/ai-alpha` feature wraps an already configured `AiRuntime` in
`AppCoreAiComponent`. The existing Supervisor owns required/optional startup,
health, admission stop, cancellation and bounded shutdown:

```rust
let component = Arc::new(AppCoreAiComponent::new(Arc::new(ai_runtime), false)?);
let ai = component.facade();
let business = MyApplication::new(ai);
ManifestApplicationHost::load("application.toml", "deployment.toml", &business)?
    .with_ai(component)
    .run()?;
```

Set `required` to `true` to fail startup when no model/backend is usable. A
caller exposing `appcore.ai.resolve` through `appcore-capabilities` must supply
an explicit bounded `AiCapabilityCodec`; Rust types are not an implicit wire
format. Declarative provider/model selection requires a future versioned
post-1.0 manifest contract.

## Choosing an engine

Measure the complete tuple of engine version, model revision, quantization,
context, batch and device. A practical starting point is:

- llama.cpp for portable GGUF and CPU/GPU hybrid execution;
- MLX-LM for Apple Silicon;
- TabbyAPI/ExLlama for low-concurrency consumer NVIDIA GPUs;
- vLLM or SGLang for high-concurrency accelerator serving;
- TensorRT-LLM for tuned NVIDIA deployments;
- OpenVINO for Intel CPU/GPU/NPU deployments;
- Candle only for the small built-in classifier, not generative LLMs.

Record cold start, time to first token, prompt/decode throughput, requests per
second, RAM, VRAM, queue depth and failures. There is no universally fastest
engine.

## Security and operational limits

- prompts, outputs, endpoints and credentials are redacted from `Debug` and
  low-cardinality observations;
- local-only requests reject remote compute and storage permissions;
- remote routes require explicit tenant grants;
- queues, attempts, peers, payloads, metadata, tools and artifacts are bounded;
- cancellation is cooperative; the current blocking HTTP transport observes it
  before and after the bounded exchange;
- model bytes require exact size and SHA-256 before activation;
- `Unrestricted` removes voluntary AppCore headroom, not OS or hardware safety.

Token streaming, PDF/OCR, automatic engine installation/process sandboxing,
production Swarm integration and declarative manifests are not delivered in
`0.1.0-alpha`. Those exclusions are release gates, not hidden fallbacks.

For complete API examples, model limits, recipes, benchmarks and the threat
model, use the crate-owned documentation under
`crates/appcore-ai/wiki` in the AppCore Runtime repository.
