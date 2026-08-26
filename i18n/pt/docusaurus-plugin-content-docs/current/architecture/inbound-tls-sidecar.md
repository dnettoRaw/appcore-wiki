---
title: Sidecar TLS de entrada
sidebar_position: 13
---

# Sidecar TLS de entrada

TLS de entrada pertence ao boundary do deployment. O AppCore escuta apenas em
HTTP loopback; Caddy ou Envoy possui o socket TLS público, certificados, health
checks e forwarding. O Runtime nunca lê a chave privada nem expõe fallback
cleartext.

```mermaid
flowchart LR
    Client[Cliente] -->|HTTPS| Sidecar[Caddy ou Envoy]
    Sidecar -->|HTTP em loopback| Runtime[AppCore Runtime]
```

A linha fonte 2.0 fornece perfis Caddy 2.11.4 para systemd, launchd e
Windows/WinSW, e Envoy 1.39.0 para systemd. Isto é desenvolvimento, não parte da
superfície estável 1.0.

## Forma obrigatória do deployment

- Ligue o Runtime a `127.0.0.1:<porta>` e negue acesso remoto no firewall.
- Exponha o sidecar somente com TLS; mantenha o admin em loopback.
- Proteja os caminhos de certificado/chave; nunca grave bytes da chave em manifests, argumentos ou logs.
- Inicie Runtime e depois sidecar. Publique somente após `/v1/health` via HTTPS passar com hostname e cadeia validados.
- Readiness é o health HTTPS externo; liveness e health loopback são sinais de diagnóstico.

Os templates ficam em `packaging/tls-sidecar` na fonte beta privada.
`appcore-dev service check` bloqueia a remoção do upstream loopback, entradas
TLS, health limitado, limites de capacidade ou hardening do serviço.

## Rotação e rollback

Valide o par completo em novo caminho owner-only e publique-o atomicamente.
Caddy valida e recarrega o candidato; Envoy observa moves atômicos no diretório.
Preserve o par anterior até o health HTTPS confirmar o novo certificado.

Falha mantém ou restaura o par anterior. Se o sidecar parar, o endpoint público
fica indisponível e a porta Runtime continua inacessível. Se o Runtime parar, o
sidecar marca o upstream unhealthy sem usar destino alternativo ou cleartext.

Rotação não exige trocar a routing generation AppCore: requests aceitas ficam
no sidecar e o listener Runtime permanece estável. Troca de endereço pertence
ao routing externo do deployment.

## Evidência e limites

Os perfis foram aceitos pelas imagens oficiais Caddy 2.11.4 e Envoy 1.39.0 em
Docker Linux/arm64. AC-024 continua aberta até instalações Unix e Windows reais
cobrirem bloqueio cleartext, rotação durante requests, expiração/revogação,
perda de processo, rollback e carga limitada. Windows também depende de AC-009.

Continue em [reload HTTP coordenado](./reload).
