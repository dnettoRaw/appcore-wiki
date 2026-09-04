---
title: Modelo de segurança
sidebar_position: 9
---

# Modelo de segurança

Falhas de segurança no AppCore quase sempre começam quando uma fronteira fica confusa: secret dentro de manifest, retry aceito duas vezes, request Peer RPC reaproveitado com outro body, ou update aceito só porque o path parece confiável.

Segurança no AppCore é um conjunto de fronteiras: manifests versionados, tokens assinados, secret references, replay protection, payloads limitados, arquivos privados, DNT e diagnostics redigidos.

## Por que tokens assinados não são containers de secrets?

Tokens são assinados, não cifrados. Não coloque secrets em manifests, URLs, logs ou debug output.

Credenciais de Gateway e Peer RPC usam o propósito `peer`. Credenciais de
conexão do Gateway têm vida curta, uso único e vínculo com a identidade da
conexão. Tokens de request Peer RPC podem ser vinculados ao hash do envelope.

Hashes vinculados a requests usam o formato SHA-256 canônico `v2:`, com
separação de domínio, framing por tamanho e presença explícita de campos
opcionais. Hashes antigos sem versão são rejeitados; emissores e validadores
precisam ser atualizados juntos. A autenticação HTTP de command/query falha
fechada por padrão; apenas o construtor explícito de teste local a desativa, e
`/v1/health` continua público por contrato.

## Onde o replay é bloqueado?

Replay protection aparece em várias camadas:

- idempotency keys impedem repetição de commands do cliente;
- sequências e checkpoints impedem registros de replicação duplicados;
- nonces de Peer RPC impedem envelopes reutilizados;
- valores `jti` do Gateway impedem credenciais reutilizadas;
- build IDs e versões impedem reativar o artefato ativo por outro path.

## O que a segurança de filesystem cobre?

Formatos de arquivo do Runtime rejeitam symlinks e path traversal quando o
provider possui a fronteira. Vários stores usam diretórios ou arquivos apenas
do owner no Unix, locks explícitos, leituras limitadas, arquivos temporários,
substituição atômica e sync do diretório pai.

Arquivos estruturados de secret usados pelo startup do Auth Server, auth grants
e inspeção de status têm teto de 64 KiB. Metadata acima do teto falha antes de
alocar, um byte sentinela detecta crescimento concorrente e o owner de input é
redacted e zeroizado depois do parse.

Isso não torna seguro um host inseguro. Se a conta do sistema operacional for
comprometida, arquivos locais podem ser atacados fora do processo AppCore.

## Por que DNT vincula o contexto?

DNT autentica o header e cifra payload e metadata. Como o header inclui
application ID, tenant ID opcional, content type, codec ID, key ID e schema
version, um envelope não pode mudar de contexto sem falhar na verificação.

## Por que segurança de update combina policy e bytes?

Segurança de update combina policy do descriptor, autenticidade criptográfica,
limites de bytes, integridade SHA-256, staging imutável, health checks de
activation e rollback. Artefatos locais unsigned exigem uma feature dedicada e
validação estrita de arquivos; não são default de produção.

## Como advisories apenas do lockfile são tratadas?

Uma advisory não é ignorada apenas porque se espera que uma feature esteja
desligada. O upstream de `rust_decimal` declara suporte opcional a `rkyv` 0.7,
então o Cargo registra esse package no metadata do lockfile enquanto o
FileMaker habilita somente `std` e Serde por string. Antes de aceitar
`RUSTSEC-2026-0235` como lock-only, o gate de release verifica todas as
features, targets e edges do workspace e exige que `rkyv` esteja ausente.
Ativá-lo faz o gate falhar antes da exceção.

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

Próximo: [providers](/pt/architecture/providers).
