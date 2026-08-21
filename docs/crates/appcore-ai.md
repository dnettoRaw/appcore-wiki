---
title: appcore-ai — Coming soon
sidebar_position: 23
---

# appcore-ai

:::caution Coming soon
`appcore-ai` is under development and **has not been published yet**. It is not
currently available on crates.io or docs.rs and should not be used as a
dependency.
:::

`appcore-ai` is the planned AI support crate for AppCore. It is intended to
bring model access, prompt execution, tool calls, memory boundaries and runtime
observability into the same manifest-first model used by the rest of AppCore.

The crate is not meant to make AI behavior magical or implicit. Application code
still owns product decisions, domain rules and user experience. `appcore-ai`
owns the runtime boundary around AI work: what is allowed to run, which provider
is selected, how secrets are resolved, how calls are traced, and which
capabilities a model may invoke.

## Responsibility

`appcore-ai` is planned to cover:

- model provider contracts for chat, completion, embeddings and structured
  generation;
- prompt and request envelopes with bounded input, metadata and trace context;
- provider selection through deployment-owned configuration;
- tool-call integration with `appcore-capabilities`;
- policy checks for model access, write operations and sensitive contexts;
- local and remote provider adapters without coupling application code to one
  vendor SDK;
- optional memory and retrieval boundaries that keep business data
  application-owned;
- observability events for request lifecycle, latency, token or unit usage,
  failures and policy decisions.

It should not own business prompts, application-specific agents, customer data
models, UI flows or product-level automation rules. Those remain application
code.

## Runtime Boundary

The planned boundary follows the same split used across AppCore:

| Owner | Owns | Does not own |
| --- | --- | --- |
| Application manifest | declares which AI capabilities the app needs | provider IDs, API keys, endpoints |
| Deployment manifest | selects provider, model family, limits and secret references | business prompts or domain policy |
| Application code | builds prompts, validates domain intent, handles responses | provider wiring, secret loading, fallback |
| `appcore-ai` | validates requests, calls providers, records traces, enforces AI policy | application decisions or hidden side effects |

The important rule is explicitness. A deployment that wants an OpenAI-compatible
remote provider, a local model runtime, a private gateway, or a test fake should
select that provider deliberately. Missing or incompatible providers should fail
startup or request validation instead of silently falling back to another model.

## Planned Concepts

### AI providers

Providers are expected to expose a small runtime contract rather than a
vendor-specific SDK. A provider may support one or more operations:

- conversational generation;
- single prompt completion;
- structured JSON output;
- embeddings;
- ranking or reranking;
- moderation or safety classification;
- streaming responses.

Each provider should document authentication, timeout behavior, retry policy,
payload limits, supported model IDs, streaming guarantees, persistence behavior
and redaction rules.

### Model profiles

A model profile is the deployment-facing description of a model choice. It can
represent a remote hosted model, a local inference server, a tenant-specific
gateway, or a fake provider used in tests.

Profiles are planned to keep model choice out of business code. Application code
should ask for a declared AI capability such as summarization, extraction,
classification or tool-assisted planning. The deployment decides which concrete
model satisfies that capability.

### Prompt envelopes

Prompt execution should travel through an envelope that carries:

- application ID, installation ID and trace ID;
- requested capability;
- input payload and declared output shape;
- safety and data-classification metadata;
- timeout, size and streaming preferences;
- idempotency or operation mode when a request may trigger tools.

This gives the runtime enough context to reject oversized input, attach
observability, apply policy and prevent accidental operational writes.

### Tool calls

Tool calls should use the existing capability model instead of giving the model
direct access to arbitrary application internals. A model may propose a tool
call, but AppCore should route it through declared capability descriptors,
authorization and write-mode checks.

The intended flow is:

1. Application code submits an AI request with an allowed tool set.
2. `appcore-ai` sends the request to the selected provider.
3. The provider returns text, structured data or a tool-call proposal.
4. `appcore-ai` validates the proposed tool call against the capability catalog.
5. The application or runtime executes only authorized capabilities.
6. Results return to the model or to application code according to the declared
   flow.

AI output is never authority by itself. Domain code still validates proposed
actions before committing business state.

### Memory and retrieval

`appcore-ai` may provide runtime contracts for retrieval and memory, but it
should not turn AppCore storage into a generic vector database. The planned
boundary is:

- embeddings and retrieval requests pass through provider contracts;
- application code owns what data is indexed;
- deployment chooses where indexes live;
- secrets and credentials stay in provider-owned configuration;
- stored memory must be scoped by application, tenant and policy.

Long-term memory should be explicit and inspectable. The crate should avoid
hidden cross-tenant memory, unbounded prompt accumulation and provider-owned
side channels that bypass AppCore storage and security policy.

## Security Model

AI calls cross a high-risk boundary because prompts may contain user content,
private data, generated instructions and tool results. `appcore-ai` is planned
to treat that boundary as runtime infrastructure.

The crate should enforce or expose hooks for:

- secret references instead of inline API keys;
- redaction-safe logging;
- bounded request and response sizes;
- timeout and retry limits;
- tenant and installation scoping;
- policy checks before remote model calls;
- explicit allowlists for tool calls;
- write-mode and leadership checks before operational actions;
- auditable failure reasons when a request is rejected.

Applications still need their own product safety rules. The runtime can enforce
mechanical boundaries, but it cannot decide whether a generated answer is
correct for a specific business domain.

## Observability

AI behavior needs operational visibility without leaking prompts by default.
The planned observability surface should record:

- provider and model profile selected;
- request start, stream progress and completion;
- latency, timeout and retry counts;
- token, unit or cost counters when a provider exposes them;
- policy accept/reject decisions;
- tool-call proposals and execution outcomes;
- redacted error classes.

Raw prompt and completion logging should be opt-in and policy-controlled.
Default diagnostics should be useful for operations while avoiding accidental
storage of sensitive content.

## Example Shape

The public Rust API is not final, but the intended usage shape is:

```rust
// Conceptual shape only. appcore-ai is not published yet.
let answer = app.ai()
    .capability("notes.summarize")
    .input(note_text)
    .expect_json::<Summary>()
    .run()
    .await?;
```

For tool-assisted flows, the application would declare which capabilities may be
used:

```rust
// Conceptual shape only. appcore-ai is not published yet.
let plan = app.ai()
    .capability("orders.assistant")
    .allow_tool("orders.quote.read")
    .allow_tool("orders.quote.propose_update")
    .input(user_request)
    .run()
    .await?;
```

Those examples describe the direction, not a stable API.

## Deployment Shape

A future deployment manifest may select AI infrastructure the same way it
selects other providers:

```toml
# Conceptual shape only. appcore-ai is not published yet.
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

The exact manifest keys are not stable. The design goal is stable: application
artifacts declare AI needs, deployments select concrete AI infrastructure.

## Testing

The crate should support deterministic tests without remote network calls.
Planned test surfaces include:

- fake providers with scripted responses;
- structured-output validation fixtures;
- tool-call authorization tests;
- timeout and retry tests;
- redaction and observability assertions;
- policy rejection cases for unsafe or undeclared operations.

Applications should test domain behavior around AI output as ordinary business
logic. A model response should be treated as input that still needs validation.

## Limitations

- `appcore-ai` is not a replacement for product design or domain rules.
- It should not hide provider choice inside application code.
- It should not silently fall back to a weaker or cheaper model.
- It should not store prompts, completions or memory without explicit policy.
- It should not give models direct write access to application state.
- It should not make generated content trusted without validation.
- The API, dependency boundary, manifest keys, version, MSRV and examples remain
  provisional until the crate is published.
