# AppCore Wiki

Public Docusaurus documentation for AppCore Runtime.

The wiki documents the 22 public AppCore crates (MSRV Rust `1.89`). The Runtime
workspace currently develops `1.0.1-rc.9`; the published application facade is
still `appcore-bin@1.0.1-rc.8`, while the independently versioned
`appcore-args@1.0.1-rc.9` is also available on crates.io. The site includes a
progressive example path from standalone command handling to scheduled work
and cluster composition.

English is the source locale; Portuguese and French use Docusaurus native
localization:

- `docs`
- `i18n/pt/docusaurus-plugin-content-docs/current`
- `i18n/fr/docusaurus-plugin-content-docs/current`

Crate catalogs:

- `docs/crates`
- `i18n/pt/docusaurus-plugin-content-docs/current/crates`
- `i18n/fr/docusaurus-plugin-content-docs/current/crates`

Progressive examples:

- `docs/tutorials/examples`
- `i18n/pt/docusaurus-plugin-content-docs/current/tutorials/examples`
- `i18n/fr/docusaurus-plugin-content-docs/current/tutorials/examples`

## Local development

```bash
npm install
npm run start
```

Use `npm run start -- --locale pt` or `npm run start -- --locale fr` to preview
a translation locally.

## Build

```bash
npm run build:all
```

## Detect Runtime documentation drift

The Node.js checker fingerprints Runtime-owned documentation and the public
crate graph. It does not modify either repository:

```bash
npm run docs:drift -- --runtime /path/to/AppCore-Runtime
```

After reviewing and integrating a reported Runtime change, update the checked-in
baseline explicitly:

```bash
npm run docs:drift:accept -- --runtime /path/to/AppCore-Runtime
```

The command exits with `0` when the wiki baseline matches, `1` when it detects
drift, and `2` for configuration or execution errors. Use `--json` for CI.
