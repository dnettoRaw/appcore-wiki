// @ts-check

const sections = [
  ['Introduction', ['what-is-appcore', 'philosophy', 'design-goals', 'project-status', 'faq']],
  ['Getting Started', ['installation', 'hello-world', 'first-runtime', 'first-service', 'first-storage', 'first-sync', 'first-api']],
  ['Architecture', ['overview', 'runtime', 'lifecycle', 'dependency-graph', 'boot-sequence', 'service-model', 'threading', 'async-model', 'synchronization', 'security-model', 'storage-model', 'distributed-model', 'update-model']],
  ['Crates', ['appcore-core', 'appcore-storage', 'appcore-api', 'appcore-sync', 'appcore-security', 'appcore-dnt', 'appcore-supervisor', 'appcore-gateway', 'appcore-peer-rpc', 'appcore-control-plane', 'appcore-capabilities', 'appcore-provider', 'appcore-update', 'appcore-types', 'appcore-contracts', 'runtime-console']],
  ['Concepts', ['commands', 'queries', 'events', 'services', 'tenants', 'capabilities', 'leader-election', 'fencing', 'checkpoints', 'snapshots', 'idempotency', 'journals', 'manifests', 'providers', 'health']],
  ['Security', ['overview', 'authentication', 'authorization', 'replay-protection', 'cryptography', 'dnt', 'secrets', 'storage-security', 'update-security', 'threat-model', 'secure-deployment']],
  ['Tutorials', ['todo-app', 'inventory-app', 'quotation-system', 'offline-first', 'distributed-app', 'custom-provider']],
  ['Examples', ['calculator', 'inventory', 'sync', 'storage', 'commands', 'gateway', 'update']],
  ['Operations', ['deployment', 'backup', 'restore', 'monitoring', 'observability', 'metrics', 'logging', 'troubleshooting', 'disaster-recovery']],
  ['Development', ['workspace', 'coding-style', 'testing', 'benchmarks', 'release-process', 'contributing', 'roadmap']],
  ['Experimental', ['ilm', 'ui-runtime', 'page-builder', 'tpm', 'hardware-security', 'future-plans']],
];

const sectionPath = {
  Introduction: 'introduction',
  'Getting Started': 'getting-started',
  Architecture: 'architecture',
  Crates: 'crates',
  Concepts: 'concepts',
  Security: 'security',
  Tutorials: 'tutorials',
  Examples: 'examples',
  Operations: 'operations',
  Development: 'development',
  Experimental: 'experimental',
};

const languageCategory = (language, label) => ({
  type: 'category',
  label,
  collapsed: language !== 'en',
  items: [
    `${language}/index`,
    ...sections.map(([section, slugs]) => ({
      type: 'category',
      label: section,
      collapsed: true,
      items: slugs.map((slug) => `${language}/${sectionPath[section]}/${slug}`),
    })),
  ],
});

const sidebars = {
  tutorialSidebar: [
    'index',
    languageCategory('en', 'English'),
    languageCategory('pt', 'Português'),
    languageCategory('fr', 'Français'),
  ],
};

module.exports = sidebars;
