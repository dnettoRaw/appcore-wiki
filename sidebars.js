// @ts-check

const chapters = [
  'introduction/what-is-appcore',
  'architecture/three-artifact-contract',
  'architecture/bootstrap',
  'architecture/storage',
  'architecture/synchronization',
  'architecture/distributed',
  'architecture/supervisor',
  'architecture/performance-budgets',
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

const stableCrates = [
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
];

const futureRoadmap = [
  'roadmap/index',
  'architecture/future-architecture',
  'crates/appcore-ai',
  'crates/appcore-filemaker',
  'crates/appcore-ui',
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
      label: 'Crate reference — 22 stable',
      collapsed: true,
      items: ['crates/index', ...stableCrates.map((crate) => `crates/${crate}`)],
    },
    {
      type: 'category',
      label: 'Coming Soon / Future Roadmap',
      collapsed: true,
      items: futureRoadmap,
    },
  ],
};
