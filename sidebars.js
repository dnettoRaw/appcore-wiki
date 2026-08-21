// @ts-check

const chapters = [
  'introduction/what-is-appcore',
  'architecture/three-artifact-contract',
  'architecture/bootstrap',
  'architecture/storage',
  'architecture/synchronization',
  'architecture/distributed',
  'architecture/supervisor',
  'architecture/updates',
  'security/security-model',
  'architecture/providers',
  'tutorials/first-application',
];

const examples = [
  'index',
  'standalone-ping',
  'command-event-query',
  'scheduled-task',
  'standalone-to-cluster',
];

const crates = [
  'appcore-args',
  'appcore-contracts',
  'appcore-types',
  'appcore-transport',
  'appcore-supervisor',
  'appcore-distributed-contracts',
  'appcore-dnt',
  'appcore-core',
  'appcore-api',
  'appcore-security',
  'appcore-storage',
  'appcore-sync',
  'appcore-ops',
  'appcore-scheduler',
  'appcore-control-plane',
  'appcore-capabilities',
  'appcore-peer-rpc',
  'appcore-gateway',
  'appcore-provider',
  'appcore-provider-vercel-neon',
  'appcore-update',
  'appcore-bin',
  'appcore-ai',
];

module.exports = {
  tutorialSidebar: [
    'index',
    ...chapters,
    {
      type: 'category',
      label: 'Examples — basic to intermediate',
      collapsed: true,
      items: examples.map((example) => `tutorials/examples/${example}`),
    },
    'architecture/crate-map',
    {
      type: 'category',
      label: 'Crate reference (22 stable + preview)',
      collapsed: true,
      items: ['crates/index', ...crates.map((crate) => `crates/${crate}`)],
    },
  ],
};
