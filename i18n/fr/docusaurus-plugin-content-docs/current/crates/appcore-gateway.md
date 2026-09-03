---
title: appcore-gateway
sidebar_position: 18
---

# appcore-gateway

:::info Paquet publié
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-gateway/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-gateway/1.0.0) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-gateway)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-gateway/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-gateway/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-gateway/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

**Responsabilité :** relay WebSocket isolé par tenant pour les connexions
Gateway entre clients externes et workers AppCore.

**Dépendances internes :** contracts, types, security, distributed
contracts et peer RPC.

**API principale :** `GatewayConfig`, `GatewayState`, état par tenant, registry
et resolver de capability, connexions worker/client bornées,
`MeshPeerTransport`, DTOs request/response du mesh relay, pruner heartbeat et
factory du router Axum. Les contrats content-envelope opaque sont réexportés
pour router des payloads chiffrés.

> **Migration du RC actuel :** l'accès direct à
> `GatewayState::tenants` a été supprimé afin que des tenants indépendants ne
> partagent plus un verrou unique. Le code qui utilise ce champ échoue à la
> compilation ; utilisez `tenant_partition`,
> `tenant_partition_or_insert`, `tenant_count` et `connection_count`. Les maps V1
> des requests en attente sont privées ; utilisez `pending_request_count`
> pour l'observation et laissez `EnvelopeRouter` gérer leur lifecycle lié à la
> generation. Aucun alias historique ni map miroir n'est fourni.

Le répertoire privé stocke 32 générations de shards immuables en copy-on-write.
Les scans d'admission, heartbeat et HA ne copient que ces 32 handles `Arc` et
libèrent tous les verrous de shard avant d'inspecter les partitions partagées ;
aucune liste complète de tenants n'est allouée ou clonée.

Le gateway résout le tenant depuis le suffixe de domaine défini par le
deployment ou depuis un paramètre de query réservé aux tests locaux, authentifie
les connexions lorsque configuré, route les enveloppes Peer RPC et les requests
HTTP Peer RPC via mesh relay uniquement dans la partition du tenant et retire
les workers stale avec des files de sortie bornées.

Le chemin normal d'activation du Runtime utilise la map d'adapters du
Deployment Manifest :

```toml
[adapters.gateway]
provider_id = "appcore-gateway"
settings = { bind_address = "127.0.0.1:8080", domain_suffix = "gateway.example.com", heartbeat_interval_ms = "30000", heartbeat_timeout_ms = "90000" }
secret_refs = {}
```

Le mode cluster exige aussi `paths.gateway_replay` absolu, un fichier sur un volume
partage et inscriptible par toutes les instances Gateway.

Le parser accepte uniquement ces quatre settings non secretes. Les endpoints,
references de secret, settings inconnues et overrides d'authentification
echouent fermes. `appcore-bin` ajoute et autorise le descriptor owner
`runtime.gateway` dans le catalogue partage, reutilise la securite du Runtime
et enregistre l'instance comme service critique du Supervisor. Sans
`adapters.gateway`, aucun runtime, listener ou task Gateway n'existe.

Les upgrades authentifies acceptent les credentials uniquement dans le header
`Authorization` ; les credentials en query sont rejetes. Les tokens worker
utilisent `worker_connection_hash` pour lier tenant, cluster, installation,
Core et capabilities. Les tokens client utilisent `client_connection_hash`
pour lier tenant, cluster et device. Ce sont des tokens `peer` a usage unique,
avec `jti`, request hash et une duree maximale de 60 secondes ; le socket expire
avec le token.

Le mesh relay valide le schema V1, les metadonnees de routage Peer RPC internes,
le digest du body et le hash signe avant forwarding. Le payload applicatif
reste opaque. Frames et messages sont limites a 4 Mio ; les limites tenant,
connexion, capability, request en attente, timeout, queue et routage concurrent
echouent fermees. Le heartbeat exige le JSON exact et une reponse worker n'est
acceptee que depuis la generation de connexion selectionnee.

`mesh-relay` est un peer transport pour les Cores qui gardent des connexions
Gateway sortantes au lieu d'exposer des ports locaux ou IPs stables. Ce n'est
pas un systeme de consensus, un terminateur TLS public ni un gestionnaire de
secrets de production. La federation edge relay et les transports alternatifs
ne doivent pas affaiblir l'authentification, expiry, nonce ou replay protection
de Peer RPC.

Le host utilise un `FilePeerNonceStore` durable et sur entre processus :
standalone le garde dans le storage prive, tandis que cluster echoue ferme sans
`paths.gateway_replay` absolu sur un fichier partage et inscriptible. Les sockets
expirent apres 60 secondes maximum. Les embedders peuvent injecter un autre
`PeerNonceStore`; leur defaut reste local et borne. Le rate limit par IP source
et la terminaison TLS restent au deployment.

`GatewayRuntime` possede le listener, le runtime Tokio current-thread, le
router, le pruner heartbeat et la thread. Le startup bind synchronement : une
adresse invalide ou occupee arrete donc le host. Le shutdown cooperatif borne
joint tout le travail. Avant le delai, il abandonne le future serveur et ferme
les connexions lentes ou incompletes avant de joindre la thread. `Orphaned`
reste seulement une quarantaine defensive de panne thread. Les snapshots surs
contiennent uniquement lifecycle, adresses de bind et compteurs. Les utilisateurs directs de `spawn_heartbeat_pruner` doivent
conserver et attendre le join handle retourne.

La fédération HA transfère chaque request admise à son worker blocking borné,
puis déplace directement le buffer JSON encodé dans `HttpRequest`. Le payload
Peer RPC interne complet n'est cloné à aucune de ces frontières d'ownership.
Le credential externe utilise `json_payload_hash` pour transmettre le JSON
canonique à SHA-256 ; le hashing ne conserve aucun second body encodé complet.

Les hashes de connexion worker et client utilisent un framing binaire
canonique V2 avec le marqueur `v2:`. Les anciens hashes sans version ne sont
pas interchangeables; émetteurs de token et consommateurs Gateway doivent être
mis à jour ensemble.

Chaque tenant conserve des index directs et bornés par Core ID et par
`(cluster_id, core_id)`. Le lookup de routage est O(1) ; register, reconnect,
disconnect et prune heartbeat mettent à jour map primaire, registre de
capabilities et index sous le même verrou tenant. Des compteurs saturés de
rebuild et d'incohérence exposent la santé sans labels non bornés.

Dans la beta Runtime actuelle, l'index inverse des capabilities partage un seul
owner immuable du nom entre toutes les annonces worker d'un tenant, tout en
préservant l'index direct de routage. `capabilities_for_iter` fournit une vue
empruntée stable et `stats` rapporte uniquement noms distincts, workers,
annonces et octets UTF-8 uniques. Le départ du dernier annonceur libère le nom
partagé. Aux limites de 1 024 workers/64 capabilities sur Apple M1, le pic RSS
est passé de 30,20 à 27,70 Mio et le lookup p50 de 55,53 à 50,22 ns.

## `1.0.2-rc` : registre HA Redis

Ceci décrit l'état de développement, pas une fonctionnalité du paquet stable
`1.0.0`. La beta privée du Runtime jusqu'au commit
[`deff156`](https://github.com/dnettoRaw/AppCore-Runtime/commit/deff156)
définit `GatewayRegistryProvider`, implémente `RedisGatewayRegistryProvider` et
ajoute le `GatewayHaCoordinator` borné. Elle utilise des epochs monotones par tenant,
des fences exactes instance/génération worker, un hash slot Redis Cluster par
tenant, timeout/concurrency bornés et des credentials zeroizing résolus
séparément. Redis sans TLS reste limité au loopback; un endpoint distant exige
`rediss://`. Une mutation ambiguë n'est jamais rejouée automatiquement.

Le provider limite chaque tenant à 1 024 workers, 4 096 sessions et 2 048
requests en attente. Une conformance réelle Redis 7.4 a validé ownership entre
deux providers, isolation tenant, rejet du schema, completion stale/dupliquée,
les trois murs de capacité, coupure de connexion, reconnect explicite et
recovery avec epoch supérieur. La cross-compilation Windows GNU a réussi; le
cross-check Linux depuis macOS manquait d'un sysroot OpenSSL Linux et ne
constitue pas une preuve Linux.

Le gate lifecycle du commit
[`756b794`](https://github.com/dnettoRaw/AppCore-Runtime/commit/756b794)
rejette admission HTTP/WebSocket, dispatch et completion hors de `Healthy`. Le
coordinateur acquiert tous les epochs tenant configurés avant `Healthy`,
renouvelle ou annule l'ensemble exact dans des rounds serialisés et limite
chaque round à 64 opérations concurrentes et cinq secondes. Le mode
single-instance sans HA conserve son comportement existant.

Le Runtime possède maintenant cette task et rejoue chaque worker live borné et
session non expirée avant `Healthy`. Un nouveau socket entre dans l'ownership
partagé avant admission locale; disconnect, prune heartbeat et shutdown
suppriment les records exacts. La route locale claim maintenant les epochs
origin/target et la génération worker avant dispatch, complete avant de
retourner un succès et annule sur panne de queue, timeout ou shutdown. Un
future abandonné par son owner ne laisse qu'un record borné par un TTL de 30
secondes. Des compteurs fixes exposent claims/completions/cancellations sans
labels request.

L'endpoint V2 de fédération authentifié lie maintenant le body exact, les epochs
source/target et la génération worker à un credential séparé, court et à usage
unique. La target valide le claim partagé avant de toucher le socket, retourne
des erreurs AC-021 typées et l'origin complète le fence avant d'accepter la
réponse. L'E2E combiné utilise deux états Gateway, des connexions Redis 7.4
indépendantes et Caddy 2.11.4 comme seule route annoncée vers la target. Il perd
brutalement l'owner, attend le TTL borné du lease, reprend un epoch supérieur et
route à nouveau via Caddy en moins de cinq secondes. Le rapport local AC-022
propre à `7197416` a validé tous les sous-systèmes : lookup partagé à
0,58--0,67 us p99, recovery de 1 000 tenants à 2,25 ms p99, route fenced locale
à 0,35 ms p99 et route fédérée à 0,91 ms p99. Les preuves CI Linux et Windows
restent requises avant que le profil HA soit déployable, et aucun fallback
local n'est permis. Suivez
[AC-013 public](https://github.com/dnettoRaw/app-core-public/issues/15).

## `1.0.3-rc` : sélection bornée des workers

`FirstAvailable` reste le défaut et choisit désormais selon un ordre stable
d'identité worker, plutôt que l'ordre aléatoire par processus du `HashSet`.
L'enum V1 exhaustif `SelectionPolicy` reste limité à `FirstAvailable` ; le
nouveau `WorkerSelectionPolicy` non exhaustif porte les policies opt-in
`RoundRobin`, `LeastInflight`, `HealthWeighted` et `Affinity`. Les consommateurs
du brouillon RC précédent ne changent que le nom de l'enum ; les manifestes et
contrats wire ne changent pas. `CapabilityResolver::select` considère
uniquement les workers annoncés du tenant courant et retourne des échecs typés
pour capability absente, aucun worker sain, tous à capacity ou affinity
invalide.

Health est borné par l'âge du heartbeat ; least-inflight utilise aussi la
profondeur de file de sortie comme départage déterministe. Affinity accepte au
plus 128 octets et utilise un rendezvous hashing stateless par tenant, sans map
de clés croissante. La sélection précède la signature de l'enveloppe Peer RPC.
Le dispatch Gateway ne réécrit jamais sa cible V1 et acquiert indépendamment un
permit d'au plus 64 routes concurrentes par worker, libéré sur chaque chemin
terminal.

Le gate final propre macOS/aarch64 au
[`7caddc1`](https://github.com/dnettoRaw/AppCore-Runtime/commit/7caddc1510e2cf88059c0dedaf3df0144d1e197b)
a mesuré 17 125 ns p99 pour round-robin, 18 542 ns pour least-inflight et
38 083 ns pour affinity sur 64 workers. Les invariants distribution round-robin
exacte, health, capacity et affinity stateless ont réussi. Il s'agit d'une
preuve locale au dépôt, pas d'une certification production ou multiplateforme.

## `1.0.4-rc` : télémétrie de routage bornée

Le RC actuel expose un snapshot pull indépendant du fournisseur via
`GatewayMetrics::telemetry_snapshot` et une frontière explicite
`GatewayTelemetryExporter`. Elle enregistre des résultats de route fixes, les
routes inflight/maximales, la saturation de file, les reconnexions, retries,
échecs d'authentification et d'export, ainsi que des histogrammes fixes pour la
latence de route, l'attente worker, l'attente lock et le payload. La
cardinalité est limitée à 128 séries de capability ; les noms validés
supplémentaires sont réunis dans la série fixe
`appcore.gateway.capability.overflow`. Tenant, connexion, request, token et
payload ne deviennent jamais des labels.

Les owners Runtime utilisent `GatewayRuntime::details` pour la télémétrie et
l'état HA additifs. Le `GatewayRuntimeSnapshot` V1 constructible conserve ses
champs d'origine, et `GatewayMetrics` préserve son contrat stable d'unwind
safety.

Le routage n'appelle jamais d'exporter. Les adapters Prometheus ou
OpenTelemetry du deployment tirent le snapshot possédé et contrôlent leur
file, retry et policy transport. Une certification propre en profil release au
[commit d'implémentation `31c4fbe`](https://github.com/dnettoRaw/AppCore-Runtime/commit/31c4fbec34d403770bf59dfe76d36732cb9b4450)
a mesuré 1 792 ns p99 pour une route instrumentée sans worker disponible et
5 792 ns p99 pour un snapshot de 129 séries, avec des budgets respectifs de
1 ms et 5 ms. Ces mesures constituent une preuve locale au dépôt, pas une
certification du trafic ou du collector en production.

**Maturité :** profil stable de peer transport pour la surface distribuée V1.
