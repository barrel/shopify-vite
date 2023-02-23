import { defineConfig } from 'vitepress'

export default defineConfig({
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
            text: 'Example Projects',
            link: '/guide/example-projects'
          },
          {
            text: 'Configuration Reference',
            link: '/guide/configuration'
          }
        ]
      }
    ],

    editLink: {
      pattern: 'https://github.com/barrel/shopify-vite/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/barrel/shopify-vite' },
      { icon: 'twitter', link: 'https://twitter.com/barrelny' },
      { icon: 'instagram', link: 'https://www.instagram.com/barrelny/' },
      { icon: 'facebook', link: 'https://www.facebook.com/barrelny' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/company/barrel/' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Made with ❤️ by Barrel'
    },

    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Config Reference', link: '/guide/configuration' },
      {
        text: 'Plugins',
        items: [
          { text: 'Shopify Modules', link: 'https://github.com/barrel/shopify-vite/tree/main/packages/vite-plugin-shopify-modules' },
          { text: 'Shopify Theme Settings', link: 'https://github.com/barrel/shopify-vite/tree/main/packages/vite-plugin-shopify-theme-settings' }
        ]
      }
    ]
  }
})
