// @ts-check

const config = {
  title: 'NEXA Documentation',
  tagline: 'Digital Systems Built for Growth, Speed, Scale & Trust.',

  favicon: 'img/favicon.ico',

  // Your existing website
  url: 'https://nexa-web.site',

  // Docusaurus will be deployed inside /docs/
  baseUrl: '/docs/',

  organizationName: 'NEXA',
  projectName: 'nexa-docs',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',

          // IMPORTANT:
          // Do NOT use "docs" here because baseUrl is already /docs/
          routeBasePath: '/',

          sidebarPath: './sidebars.js',

          showLastUpdateTime: true,
        },

        blog: false,

        pages: {
          path: 'src/pages',
        },

        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themeConfig: {
    image: 'img/nexa-social-card.svg',

    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },

    navbar: {
      logo: {
        alt: 'NEXA',
        src: 'img/logo.jpg',
      },

      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          label: 'Documentation',
          position: 'left',
        },

        {
          label: 'Services',
          to: '/services/websites',
          position: 'left',
        },

        {
          label: 'Solutions',
          to: '/solutions/crm',
          position: 'left',
        },

        {
          label: 'Developers',
          to: '/development/architecture',
          position: 'left',
        },

        {
          href: 'https://nexa-web.site',
          label: 'NEXA Website',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',

      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Introduction',
              to: '/intro',
            },
            {
              label: 'Services',
              to: '/services/websites',
            },
            {
              label: 'Solutions',
              to: '/solutions/crm',
            },
            {
              label: 'Development',
              to: '/development/architecture',
            },
          ],
        },

        {
          title: 'Resources',
          items: [
            {
              label: 'Getting Started',
              to: '/guides/getting-started',
            },
            {
              label: 'API',
              to: '/guides/api',
            },
            {
              label: 'Security',
              to: '/deployment/security',
            },
          ],
        },

        {
          title: 'NEXA',
          items: [
            {
              label: 'NEXA Website',
              href: 'https://nexa-web.site',
            },
          ],
        },
      ],

      copyright:
        `Copyright © ${new Date().getFullYear()} NEXA. All rights reserved.`,
    },

    prism: {
      additionalLanguages: [
        'bash',
        'json',
        'php',
        'sql',
        'yaml',
        'javascript',
        'typescript',
      ],
    },
  },
};

module.exports = config;