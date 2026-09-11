const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      collapsed: false,
      items: [
        'intro',
      ],
    },

    {
      type: 'category',
      label: 'Services',
      collapsed: false,
      items: [
        'services/websites',
        'services/web-applications',
        'services/business-systems',
        'services/ai-automation',
        'services/custom-software',
      ],
    },

    {
      type: 'category',
      label: 'Solutions',
      collapsed: false,
      items: [
        'solutions/crm',
        'solutions/booking',
        'solutions/inventory',
        'solutions/analytics',
      ],
    },

    {
      type: 'category',
      label: 'Products',
      collapsed: false,
      items: [
        'products/overview',
        'products/nexa-core',
      ],
    },

    {
      type: 'category',
      label: 'Development',
      collapsed: true,
      items: [
        'development/architecture',
        'development/frontend',
        'development/backend',
        'development/database',
        'development/ai-integration',
      ],
    },

    {
      type: 'category',
      label: 'Deployment',
      collapsed: true,
      items: [
        'deployment/local-development',
        'deployment/production',
        'deployment/security',
      ],
    },

    {
      type: 'category',
      label: 'Guides',
      collapsed: true,
      items: [
        'guides/getting-started',
        'guides/api',
      ],
    },
  ],
};

module.exports = sidebars;