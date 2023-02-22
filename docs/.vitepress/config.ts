export default {
  title: 'Shopify Vite Plugin',
  description: 'Vite integration for Shopify themes',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]
  ],

  themeConfig: {
    sidebar: [
      {
        text: 'Guide',
        items: [
          {
            text: 'Gettin Started',
            link: '/guide/'
          },
          {
            text: 'Configuration Reference',
            link: '/guide/configuration'
          }
        ]
      }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright (c) Barrel LLC'
    }
  }
}
