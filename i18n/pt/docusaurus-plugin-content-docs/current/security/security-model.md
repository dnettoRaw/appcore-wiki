---
title: Modelo de segurança
sidebar_position: 9
---

# Modelo de segurança

Falhas de segurança no AppCore quase sempre começam quando uma fronteira fica confusa: secret dentro de manifest, retry aceito duas vezes, request Peer RPC reaproveitado com outro body, ou update aceito só porque o path parece confiável.

Segurança no AppCore é um conjunto de fronteiras: manifests versionados, tokens assinados, secret references, replay protection, payloads limitados, arquivos privados, DNT e diagnostics redigidos.

Tokens são assinados, não cifrados. Não coloque secrets em manifests, URLs, logs ou debug output.

Hashes vinculados a requests usam o formato SHA-256 canônico `v2:`, com
separação de domínio, framing por tamanho e presença explícita de campos
opcionais. Hashes antigos sem versão são rejeitados; emissores e validadores
precisam ser atualizados juntos. A autenticação HTTP de command/query falha
fechada por padrão; apenas o construtor explícito de teste local a desativa, e
`/v1/health` continua público por contrato.

Replay é tratado em camadas: idempotency key para commands, sequência/checkpoint para sync, nonces para Peer RPC, `jti` single-use para gateway e build/version checks para updates.

DNT autentica contexto e cifra payload. Peer RPC valida tenant, cluster, core, protocolo, expiry, nonce, hash e token bound. Gateway valida conexão e mesh request. Update valida policy, assinatura, checksum e health gate.

Arquivos estruturados de secret usados pelo startup do Auth Server, auth grants
e inspeção de status têm teto de 64 KiB. Metadata acima do teto falha antes de
alocar, um byte sentinela detecta crescimento concorrente e o owner de input é
redacted e zeroizado depois do parse.

## Status do provider Windows DPAPI

A AC-009 aceitou `windows-dpapi-user-v1` para a linha de desenvolvimento
pós-1.0. A implementação `1.0.2-rc` protege cada registro limitado de rotação
com DPAPI não interativo no escopo do usuário: normalmente o mesmo usuário na
mesma máquina é necessário para descriptografar. O escopo da máquina é excluído
porque permitiria descriptografia por outros usuários locais. A seleção é
opt-in e nunca faz fallback para `env-file`, `file-keyring-v1` ou escopo da
máquina. As operações CLI devem passar `--keyring-provider
windows-dpapi-user-v1`; omitir a opção seleciona o comportamento inalterado de
`file-keyring-v1`.

O root persistido também deve pertencer ao SID do usuário atual, ter DACL
protegida apenas para o owner e rejeitar links, junctions e outros reparse
points. Backup e restore são limitados ao mesmo perfil e máquina. O provider
possui testes de repositório para rotação, revogação, restore no mesmo usuário,
separação de formato e redaction, e todos os executáveis de teste do Runtime
fazem cross-build para Windows. Ele não está certificado até a matriz real
Windows multiusuário e multimáquina passar; cross-compilation e testes mockados
não constituem essa evidência. A linha estável 1.0 não muda e a atualização é
explícita.

## Limitations

- AppCore não fornece OAuth.
- Não fornece TLS termination universal para todos os deployments.
- Não opera vault gerenciado de produção.
- Hardware-backed keys não fazem parte do contrato estável 1.0.
- Autorização de domínio pertence à aplicação.
- Um host comprometido pode atacar arquivos locais fora do processo AppCore.

Próximo: [providers](/architecture/providers).
