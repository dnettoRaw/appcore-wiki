---
title: Reload coordenado
sidebar_position: 8
---

# Reload coordenado

O AppCore 1.0 inicia uma configuração HTTP imutável e continua sendo o pacote
estável. O candidato `appcore-api 1.0.2-rc` introduz uma transação opt-in de geração de
routing para mudanças que mantêm o endereço do listener.

## Transação

1. Compor um Router candidato com geração `u64` estritamente mais nova.
2. Exigir o mesmo endereço habilitado e prazos positivos e limitados.
3. Chamar `/v1/health` no candidato antes da ativação.
4. Fechar a admissão antiga e selecionar atomicamente o candidato para novos requests.
5. Chamar `/v1/health` novamente pelo candidato selecionado.
6. Drenar o in-flight antigo antes de liberar seus recursos.

Um request aceito mantém sua geração até terminar. A camada de reload não o
move nem o repete. Falha de saúde após a troca ou de drain restaura a geração
anterior, fecha a admissão com falha e executa limpeza limitada. Reloads
concorrentes ou obsoletos falham explicitamente.
Uma geração com falha e requests ocupa o único slot em drain. Outro reload
falha até o último permit liberar esse Router, impedindo que timeouts repetidos
acumulem gerações de routing desligadas.
Cancelar o future de reload após a troca restaura sincronicamente a geração
anterior e move requests já admitidos pelo candidato para o mesmo slot limitado
em drain.

## Ownership e limites

`appcore-api` possui as gerações de routing. O executável de deployment registra o owner como
o serviço gerenciado `http` existente. O Supervisor atual continua sendo o
único owner de lifecycle e restart de processo permanece externo.

Prazos de health e drain são limitados a 60 segundos. Snapshots expõem apenas
contadores de geração, in-flight, transação, sucesso, falha e rollback. Eles
nunca contêm payloads, tokens, IDs de request ou tenant nem endereços.
`generation_snapshot` expõe uma geração ativa e no máximo uma em drain, com
admissão e in-flight, sem reter histórico.

Leadership não deriva da geração de routing. Commands continuam validando o
lease e fencing atuais, então o reload não cria dois epochs válidos.

## Rotação de endereço e certificado

Mudar o endereço exige que a composition root ligue e valide outra geração de
listener antes de alterar o routing externo. Isso não vira reload in-place
silenciosamente. Certificados inbound continuam como boundary de sidecar do
deployment em AC-024; sua rotação não reinterpreta manifests do Runtime.

Use o [perfil sidecar TLS de entrada](./inbound-tls-sidecar) para rotação de
certificado. Ele mantém o listener do Runtime estável e não cria um segundo
caminho de routing no Runtime.

O candidato atual `appcore-api 1.0.2-rc` implementa routing no mesmo listener, e
o executável de deployment o compõe como serviço HTTP supervisionado sobre um
TCP listener pré-ligado. Composição com mudança de endereço, gatilho coordenado
de configuração e certificação externa multiplataforma continuam como trabalho
pós-GA. A API não está disponível no pacote estável `1.0.0`.

## Evidência

O teste com socket real mantém um request da geração 1 ativo, troca no mesmo
listener, atende a geração 2 e então conclui a geração 1. O AC-022 local limpo
mediu overhead p99 de 750 ns, reload p99 de 26,7 us a 41.488 reloads/s e
snapshot p99 de 42 ns. Os 256 reloads fizeram commit sem falha, rollback ou
in-flight residual. CI Linux e Windows continuam como evidência autoritativa.
