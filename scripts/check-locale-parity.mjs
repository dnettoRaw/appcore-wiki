#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const locales = {
  en: path.join(root, 'docs'),
  pt: path.join(root, 'i18n/pt/docusaurus-plugin-content-docs/current'),
  fr: path.join(root, 'i18n/fr/docusaurus-plugin-content-docs/current'),
};

function markdownFiles(directory, base = directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(target, base);
    return entry.name.endsWith('.md') ? [path.relative(base, target)] : [];
  });
}

function normalizeLink(target) {
  return target
    .replace(/^\/(?:pt|fr)(?=\/)/, '')
    .replace(/\.(?:pt|fr)\.md(?=$|[#?])/, '.en.md');
}

function invalidLocaleLinks(source, locale) {
  return [...source.matchAll(/\[[^\]]*\]\((\/[^)]+)\)/g)]
    .map((match) => match[1])
    .filter((target) => !target.startsWith(`/${locale}/`));
}

function signature(source) {
  const lines = source.split('\n');
  let inFence = false;
  let activeFence = null;
  const codeBlocks = [];
  for (const line of lines) {
    const marker = /^```([^\s`]*)/.exec(line);
    if (marker) {
      if (activeFence) {
        if (activeFence.language === 'yaml') delete activeFence.lines;
        codeBlocks.push(activeFence);
      }
      else activeFence = { language: marker[1] || '-', lines: 0 };
      if (codeBlocks.at(-1) === activeFence) activeFence = null;
      continue;
    }
    if (activeFence && line.trim().length > 0) activeFence.lines += 1;
  }
  const proseLines = lines.filter((line) => {
    if (/^```/.test(line)) {
      inFence = !inFence;
      return false;
    }
    return !inFence;
  });
  const headings = proseLines.flatMap((line) => {
    const match = /^(#{1,4})\s/.exec(line);
    return match ? [match[1].length] : [];
  });
  const fences = lines.flatMap((line) => {
    const match = /^```([^\s`]*)/.exec(line);
    return match ? [match[1] || '-'] : [];
  });
  const admonitions = proseLines.flatMap((line) => {
    const match = /^:::(\w+)?/.exec(line);
    return match ? [match[1] || 'close'] : [];
  });
  const tables = proseLines
    .filter((line) => /^\|.*\|\s*$/.test(line))
    .map((line) => line.split('|').length - 2);
  const links = [...proseLines.join('\n').matchAll(/\[[^\]]*\]\(([^)]+)\)/g)]
    .map((match) => normalizeLink(match[1]))
    .sort();
  const lists = proseLines.flatMap((line) => {
    const match = /^\s*(-|\d+\.)\s/.exec(line);
    return match ? [match[1] === '-' ? 'bullet' : 'number'] : [];
  });
  const words = source.trim().split(/\s+/).length;

  return { admonitions, codeBlocks, fences, headings, links, lists, tables, words };
}

function difference(left, right) {
  return JSON.stringify(left) === JSON.stringify(right) ? [] : [right];
}

const inventories = Object.fromEntries(
  Object.entries(locales).map(([locale, directory]) => [
    locale,
    markdownFiles(directory).sort(),
  ]),
);
const canonical = inventories.en;
const issues = [];

for (const locale of ['pt', 'fr']) {
  const missing = canonical.filter((file) => !inventories[locale].includes(file));
  const extra = inventories[locale].filter((file) => !canonical.includes(file));
  if (missing.length > 0) issues.push({ locale, kind: 'missing-files', values: missing });
  if (extra.length > 0) issues.push({ locale, kind: 'extra-files', values: extra });
}

for (const file of canonical) {
  const expected = signature(fs.readFileSync(path.join(locales.en, file), 'utf8'));
  for (const locale of ['pt', 'fr']) {
    if (!inventories[locale].includes(file)) continue;
    const localizedSource = fs.readFileSync(path.join(locales[locale], file), 'utf8');
    const actual = signature(localizedSource);
    const invalidLinks = invalidLocaleLinks(localizedSource, locale);
    if (invalidLinks.length > 0) {
      issues.push({
        locale,
        file,
        kind: 'locale-links',
        actual: invalidLinks,
      });
    }
    for (const field of Object.keys(expected)) {
      if (field === 'words') {
        const ratio = actual.words / expected.words;
        if (ratio < 0.85 || ratio > 1.35) {
          issues.push({
            locale,
            file,
            kind: 'word-coverage',
            expected: expected.words,
            actual: actual.words,
          });
        }
        continue;
      }
      if (difference(expected[field], actual[field]).length > 0) {
        issues.push({
          locale,
          file,
          kind: field,
          expected: expected[field],
          actual: actual[field],
        });
      }
    }
  }
}

if (issues.length > 0) {
  console.error(JSON.stringify({ status: 'locale-drift', issues }, null, 2));
  process.exit(1);
}

console.log(`[OK] ${canonical.length} Markdown pages have EN/PT/FR structure and coverage parity`);
