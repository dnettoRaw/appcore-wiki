# AppCore Wiki

Public Docusaurus documentation for AppCore Runtime.

The wiki documents the stable AppCore Runtime `1.0.0` release and all 22 stable
public crates (MSRV Rust `1.89`), plus independently versioned prereleases such
as `appcore-ai 0.1.0-beta.3`. Every public crate owns its SemVer; the current
repository release train is `1.0.2-rc`, while compatible feature candidates
advance toward 1.5 only in the crates that own them. crates.io remains the
authority for versions that have actually been published. The site includes a
progressive example path from standalone command handling to scheduled work,
Gateway activation, and cluster composition.

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
