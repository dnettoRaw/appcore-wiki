#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const wikiRoot = path.resolve(scriptDirectory, '..');
const defaultBaseline = path.join(wikiRoot, '.appcore-doc-sync.json');
const futureComponentsPath = path.join(wikiRoot, 'data', 'future-components.json');
const validFutureStatuses = new Set(['Research', 'Planned', 'In Design', 'Experimental', 'Alpha', 'Beta', 'RC', 'Stable', 'Deferred']);

function usage() {
  return `Usage: node scripts/check-appcore-doc-drift.mjs [options]

Options:
  --runtime <path>   AppCore-Runtime checkout (or APPCORE_RUNTIME_PATH)
  --baseline <path> Baseline file (default: .appcore-doc-sync.json)
  --accept          Record the current Runtime state after wiki integration
  --json            Emit machine-readable JSON
  --help            Show this help

Exit codes: 0 = in sync, 1 = drift detected, 2 = configuration/error`;
}

function parseArguments(argv) {
  const options = {
    accept: false,
    baseline: defaultBaseline,
    json: false,
    runtime: process.env.APPCORE_RUNTIME_PATH,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--accept') options.accept = true;
    else if (argument === '--json') options.json = true;
    else if (argument === '--help') options.help = true;
    else if (argument === '--runtime' || argument === '--baseline') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`${argument} requires a path`);
      }
      options[argument.slice(2)] = value;
      index += 1;
    } else {
      throw new Error(`unknown option: ${argument}`);
    }
  }

  if (!options.runtime) {
    const sibling = path.resolve(wikiRoot, '..', 'AppCore-Runtime');
    if (fs.existsSync(sibling)) options.runtime = sibling;
  }

  return options;
}

function run(command, args, cwd) {
  return execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trimEnd();
}

function runOptional(command, args, cwd) {
  try {
    return run(command, args, cwd);
  } catch {
    return '';
  }
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function normalize(relativePath) {
  return relativePath.split(path.sep).join('/');
}

function isRelevant(relativePath) {
  if (/^[^/]+\.md$/.test(relativePath) || relativePath.endsWith('/AGENTS.md')) return true;
  if (relativePath === 'Cargo.toml' || relativePath === 'Cargo.lock') return true;
  if (/^release\/.*\.md$/.test(relativePath)) return true;
  if (/^crates\/appcore-[^/]+\/Cargo\.toml$/.test(relativePath)) return true;
  if (/^crates\/appcore-[^/]+\/(?:[^/]+\.md|wiki\/.*\.md)$/.test(relativePath)) return true;
  if (/^crates\/appcore-[^/]+\/src\/lib\.rs$/.test(relativePath)) return true;
  return /^tests\/three-artifact-app\/(?:README\.md|Cargo\.toml|application\.toml|deployment\.[^.]+\.toml|src\/business\.rs)$/.test(relativePath);
}

function listRelevantFiles(runtimeRoot) {
  const output = execFileSync(
    'git',
    ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
    { cwd: runtimeRoot, encoding: 'buffer', maxBuffer: 64 * 1024 * 1024 },
  );

  return output
    .toString('utf8')
    .split('\0')
    .filter(Boolean)
    .map(normalize)
    .filter(isRelevant)
    .sort();
}

function fingerprintFiles(runtimeRoot, files) {
  return Object.fromEntries(
    files.map((relativePath) => {
      const bytes = fs.readFileSync(path.join(runtimeRoot, relativePath));
      return [relativePath, sha256(bytes)];
    }),
  );
}

function publicCrateGraph(runtimeRoot) {
  const metadata = JSON.parse(run('cargo', ['metadata', '--no-deps', '--format-version', '1'], runtimeRoot));
  const cratesRoot = `${normalize(fs.realpathSync(path.resolve(runtimeRoot, 'crates')))}/`;

  return metadata.packages
    .filter((pkg) => {
      const manifest = normalize(fs.realpathSync(pkg.manifest_path));
      return manifest.startsWith(cratesRoot)
        && pkg.name.startsWith('appcore-')
        && !(Array.isArray(pkg.publish) && pkg.publish.length === 0);
    })
    .map((pkg) => ({
      name: pkg.name,
      version: pkg.version,
      rustVersion: pkg.rust_version ?? null,
      appcoreDependencies: [...new Set(
        pkg.dependencies
          .map((dependency) => dependency.name)
          .filter((name) => name.startsWith('appcore-')),
      )].sort(),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

function relevantDirtyPaths(runtimeRoot) {
  const status = run('git', ['status', '--porcelain=v1', '--untracked-files=all'], runtimeRoot);
  if (!status) return [];
  return status
    .split('\n')
    .map((line) => normalize(line.slice(3).split(' -> ').at(-1)))
    .filter(isRelevant)
    .sort();
}

function buildSnapshot(runtimeRoot) {
  const files = listRelevantFiles(runtimeRoot);
  const fileHashes = fingerprintFiles(runtimeRoot, files);
  const crates = publicCrateGraph(runtimeRoot);
  return {
    schemaVersion: 1,
    acceptedAt: new Date().toISOString(),
    runtimeCommit: run('git', ['rev-parse', 'HEAD'], runtimeRoot),
    runtimeRemote: runOptional('git', ['config', '--get', 'remote.origin.url'], runtimeRoot) || null,
    relevantDigest: sha256(JSON.stringify(fileHashes)),
    publicCrateGraphDigest: sha256(JSON.stringify(crates)),
    files: fileHashes,
    crates,
  };
}

function compareFiles(previous, current) {
  const previousPaths = new Set(Object.keys(previous));
  const currentPaths = new Set(Object.keys(current));
  return {
    added: [...currentPaths].filter((item) => !previousPaths.has(item)).sort(),
    modified: [...currentPaths].filter((item) => previousPaths.has(item) && previous[item] !== current[item]).sort(),
    removed: [...previousPaths].filter((item) => !currentPaths.has(item)).sort(),
  };
}

function compareCrates(previous, current) {
  const oldByName = new Map(previous.map((item) => [item.name, item]));
  const newByName = new Map(current.map((item) => [item.name, item]));
  return {
    added: [...newByName.keys()].filter((name) => !oldByName.has(name)).sort(),
    changed: [...newByName.keys()].filter((name) => {
      const oldValue = oldByName.get(name);
      return oldValue && JSON.stringify(oldValue) !== JSON.stringify(newByName.get(name));
    }).sort(),
    removed: [...oldByName.keys()].filter((name) => !newByName.has(name)).sort(),
  };
}

function wikiCoverage(crates) {
  const locales = [
    { code: 'en', directory: path.join(wikiRoot, 'docs', 'crates') },
    { code: 'pt', directory: path.join(wikiRoot, 'i18n', 'pt', 'docusaurus-plugin-content-docs', 'current', 'crates') },
    { code: 'fr', directory: path.join(wikiRoot, 'i18n', 'fr', 'docusaurus-plugin-content-docs', 'current', 'crates') },
  ];
  const issues = [];

  for (const crate of crates) {
    for (const locale of locales) {
      const file = path.join(locale.directory, `${crate.name}.md`);
      if (!fs.existsSync(file)) {
        issues.push(`${locale.code}: missing ${crate.name}.md`);
        continue;
      }
      const content = fs.readFileSync(file, 'utf8');
      for (const required of [`guide.${locale.code}.md`, `basic.${locale.code}.md`, `intermediate.${locale.code}.md`]) {
        if (!content.includes(required)) issues.push(`${locale.code}: ${crate.name}.md does not link ${required}`);
      }
    }
  }
  return issues;
}

function readFutureComponents() {
  if (!fs.existsSync(futureComponentsPath)) {
    return { components: [], errors: [`missing future component data: ${path.relative(wikiRoot, futureComponentsPath)}`], warnings: [] };
  }

  const data = JSON.parse(fs.readFileSync(futureComponentsPath, 'utf8'));
  const components = Array.isArray(data.components) ? data.components : [];
  const errors = [];
  const warnings = [];

  if (data.schemaVersion !== 1) errors.push(`unsupported future component schema: ${data.schemaVersion}`);

  const names = new Set();
  const slugs = new Set();
  for (const component of components) {
    if (!component.name || !component.slug || !component.status || !component.category || !component.summary || !component.horizon) {
      errors.push(`future component is missing required fields: ${JSON.stringify(component)}`);
      continue;
    }
    if (names.has(component.name)) errors.push(`duplicate future component name: ${component.name}`);
    if (slugs.has(component.slug)) errors.push(`duplicate future component slug: ${component.slug}`);
    if (!validFutureStatuses.has(component.status)) errors.push(`invalid future component status for ${component.name}: ${component.status}`);
    names.add(component.name);
    slugs.add(component.slug);
  }

  return { components, errors, warnings };
}

function validateFutureRoadmap(crates) {
  const { components, errors, warnings } = readFutureComponents();
  const crateNames = new Set(crates.map((crate) => crate.name));

  for (const component of components) {
    if (component.status === 'Stable' && !crateNames.has(component.name)) {
      errors.push(`future component ${component.name} is marked Stable but is absent from the public crate graph`);
    }
    if (['Research', 'Planned', 'In Design', 'Deferred'].includes(component.status) && crateNames.has(component.name)) {
      warnings.push(`future component ${component.name} appears in the public crate graph with status ${component.status}; review promotion manually`);
    }
  }

  const requiredPages = [
    ['en', path.join(wikiRoot, 'docs', 'roadmap', 'index.md'), 'Future components'],
    ['pt', path.join(wikiRoot, 'i18n', 'pt', 'docusaurus-plugin-content-docs', 'current', 'roadmap', 'index.md'), 'Componentes futuros'],
    ['fr', path.join(wikiRoot, 'i18n', 'fr', 'docusaurus-plugin-content-docs', 'current', 'roadmap', 'index.md'), 'Composants futurs'],
    ['en', path.join(wikiRoot, 'docs', 'architecture', 'future-architecture.md'), 'Conceptual roadmap'],
    ['pt', path.join(wikiRoot, 'i18n', 'pt', 'docusaurus-plugin-content-docs', 'current', 'architecture', 'future-architecture.md'), 'Roadmap conceitual'],
    ['fr', path.join(wikiRoot, 'i18n', 'fr', 'docusaurus-plugin-content-docs', 'current', 'architecture', 'future-architecture.md'), 'Roadmap conceptuelle'],
    ['en', path.join(wikiRoot, 'docs', 'crates', 'appcore-ai.md'), 'published on crates.io'],
    ['pt', path.join(wikiRoot, 'i18n', 'pt', 'docusaurus-plugin-content-docs', 'current', 'crates', 'appcore-ai.md'), 'publicado no crates.io'],
    ['fr', path.join(wikiRoot, 'i18n', 'fr', 'docusaurus-plugin-content-docs', 'current', 'crates', 'appcore-ai.md'), 'publié sur crates.io'],
    ['en', path.join(wikiRoot, 'docs', 'crates', 'appcore-ui.md'), 'has not been published yet'],
    ['pt', path.join(wikiRoot, 'i18n', 'pt', 'docusaurus-plugin-content-docs', 'current', 'crates', 'appcore-ui.md'), 'ainda não foi publicado'],
    ['fr', path.join(wikiRoot, 'i18n', 'fr', 'docusaurus-plugin-content-docs', 'current', 'crates', 'appcore-ui.md'), "n'est pas encore publié"],
  ];

  const roadmapPages = [
    path.join(wikiRoot, 'docs', 'roadmap', 'index.md'),
    path.join(wikiRoot, 'i18n', 'pt', 'docusaurus-plugin-content-docs', 'current', 'roadmap', 'index.md'),
    path.join(wikiRoot, 'i18n', 'fr', 'docusaurus-plugin-content-docs', 'current', 'roadmap', 'index.md'),
  ];
  const cratePageDirectories = [
    path.join(wikiRoot, 'docs', 'crates'),
    path.join(wikiRoot, 'i18n', 'pt', 'docusaurus-plugin-content-docs', 'current', 'crates'),
    path.join(wikiRoot, 'i18n', 'fr', 'docusaurus-plugin-content-docs', 'current', 'crates'),
  ];

  for (const component of components) {
    const version = /\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?/.exec(component.horizon)?.[0];
    for (const file of roadmapPages) {
      const content = fs.readFileSync(file, 'utf8');
      const row = content.split('\n').find((line) => line.startsWith('|') && line.includes(component.name));
      if (!row) {
        errors.push(`${path.relative(wikiRoot, file)} does not list ${component.name}`);
        continue;
      }
      if (!row.includes(`| ${component.status} |`)) {
        errors.push(`${path.relative(wikiRoot, file)} does not expose status ${component.status} for ${component.name}`);
      }
      if (version && !row.includes(version)) {
        errors.push(`${path.relative(wikiRoot, file)} does not expose ${component.name} version ${version}`);
      }
    }
    if (version && crateNames.has(component.name)) {
      for (const directory of cratePageDirectories) {
        const file = path.join(directory, `${component.name}.md`);
        if (!fs.readFileSync(file, 'utf8').includes(version)) {
          errors.push(`${path.relative(wikiRoot, file)} does not expose ${component.name} version ${version}`);
        }
      }
    }
  }

  for (const [locale, file, requiredText] of requiredPages) {
    if (!fs.existsSync(file)) {
      errors.push(`${locale}: missing future roadmap page ${path.relative(wikiRoot, file)}`);
      continue;
    }
    const content = fs.readFileSync(file, 'utf8');
    if (!content.includes(requiredText)) {
      errors.push(`${locale}: ${path.relative(wikiRoot, file)} is missing future disclaimer text "${requiredText}"`);
    }
  }

  return { componentCount: components.length, errors, warnings };
}

function hasChanges(group) {
  return Object.values(group).some((items) => items.length > 0);
}

function humanList(label, items) {
  if (items.length === 0) return [];
  return [`${label} (${items.length}):`, ...items.map((item) => `  - ${item}`)];
}

function writeResult(options, result) {
  if (options.json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }

  if (result.status === 'accepted') {
    console.log(`Recorded AppCore documentation baseline at ${result.runtimeCommit}.`);
    console.log(`Tracked ${result.fileCount} relevant files and ${result.crateCount} public crates.`);
    return;
  }

  if (result.status === 'in-sync') {
    console.log(`AppCore documentation is in sync (${result.runtimeCommit}).`);
    console.log(`Checked ${result.fileCount} relevant files, ${result.crateCount} public crates, ${result.futureComponentCount} future components, and 3 wiki locales.`);
    for (const warning of result.roadmapWarnings) console.log(`Roadmap warning: ${warning}`);
    return;
  }

  const lines = [
    'AppCore documentation drift detected.',
    `Baseline commit: ${result.baselineCommit}`,
    `Current commit:  ${result.runtimeCommit}`,
    ...humanList('Added source files', result.files.added),
    ...humanList('Modified source files', result.files.modified),
    ...humanList('Removed source files', result.files.removed),
    ...humanList('Added public crates', result.crates.added),
    ...humanList('Changed public crates', result.crates.changed),
    ...humanList('Removed public crates', result.crates.removed),
    ...humanList('Relevant uncommitted source paths', result.dirtyPaths),
    ...humanList('Wiki coverage issues', result.coverageIssues),
    ...humanList('Future roadmap issues', result.roadmapIssues),
    ...humanList('Future roadmap warnings', result.roadmapWarnings),
    '',
    'Integrate these changes in all three wiki locales, then run the checker with --accept.',
  ];
  console.log(lines.join('\n'));
}

function fail(options, error) {
  const message = error instanceof Error ? error.message : String(error);
  if (options?.json) console.error(JSON.stringify({ status: 'error', error: message }));
  else console.error(`Documentation drift check failed: ${message}`);
  process.exitCode = 2;
}

let options;
try {
  options = parseArguments(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    process.exit(0);
  }
  if (!options.runtime) throw new Error('Runtime checkout not found; pass --runtime or APPCORE_RUNTIME_PATH');

  const runtimeRoot = path.resolve(options.runtime);
  const baselinePath = path.resolve(options.baseline);
  if (!fs.existsSync(path.join(runtimeRoot, '.git'))) {
    throw new Error(`not an AppCore-Runtime Git checkout: ${runtimeRoot}`);
  }

  const current = buildSnapshot(runtimeRoot);
  const coverageIssues = wikiCoverage(current.crates);
  const roadmap = validateFutureRoadmap(current.crates);
  const dirtyPaths = relevantDirtyPaths(runtimeRoot);

  if (options.accept) {
    if (roadmap.errors.length > 0) {
      throw new Error(`cannot accept baseline with future roadmap issues:\n${roadmap.errors.join('\n')}`);
    }
    if (coverageIssues.length > 0) {
      throw new Error(`cannot accept baseline with wiki coverage issues:\n${coverageIssues.join('\n')}`);
    }
    if (dirtyPaths.length > 0) {
      throw new Error(`cannot accept baseline from a dirty Runtime checkout:\n${dirtyPaths.join('\n')}`);
    }
    fs.writeFileSync(baselinePath, `${JSON.stringify(current, null, 2)}\n`);
    writeResult(options, {
      status: 'accepted',
      runtimeCommit: current.runtimeCommit,
      fileCount: Object.keys(current.files).length,
      crateCount: current.crates.length,
      futureComponentCount: roadmap.componentCount,
    });
    process.exit(0);
  }

  if (!fs.existsSync(baselinePath)) {
    throw new Error(`baseline not found: ${baselinePath}; integrate the wiki and run with --accept`);
  }
  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  if (baseline.schemaVersion !== 1) throw new Error(`unsupported baseline schema: ${baseline.schemaVersion}`);

  const files = compareFiles(baseline.files, current.files);
  const crates = compareCrates(baseline.crates, current.crates);
  const drift = hasChanges(files) || hasChanges(crates) || dirtyPaths.length > 0 || coverageIssues.length > 0 || roadmap.errors.length > 0;
  const result = {
    status: drift ? 'drift' : 'in-sync',
    baselineCommit: baseline.runtimeCommit,
    runtimeCommit: current.runtimeCommit,
    fileCount: Object.keys(current.files).length,
    crateCount: current.crates.length,
    files,
    crates,
    dirtyPaths,
    coverageIssues,
    futureComponentCount: roadmap.componentCount,
    roadmapIssues: roadmap.errors,
    roadmapWarnings: roadmap.warnings,
  };
  writeResult(options, result);
  process.exit(drift ? 1 : 0);
} catch (error) {
  fail(options, error);
}
