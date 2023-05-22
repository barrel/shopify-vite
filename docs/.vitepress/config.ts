import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Shopify Vite Plugin',
  description: 'Vite integration for Shopify themes',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Shopify Vite Plugin' }],
    ['meta', { property: 'og:image', content: 'https://shopify-vite.netlify.app/og-image.png' }],
    ['meta', { property: 'og:url', content: 'https://shopify-vite.netlify.app/' }],
    ['meta', { property: 'og:description', content: 'Vite integration for Shopify themes by [Barrel](https://www.barrelny.com)' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@barrelny' }],
    ['meta', { name: 'theme-color', content: '#646cff' }]
  ],

  themeConfig: {
    sidebar: [
      {
        text: 'Guide',
        items: [
          {
            text: 'Getting Started',
            link: '/guide/'
          },
          {
            text: 'Example Projects',
            link: '/guide/example-projects'
          },
          {
            text: 'Troubleshooting',
            link: '/guide/troubleshooting'
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

    algolia: {
      appId: 'LWPLHR2236',
      apiKey: 'e33d44a0b2110e96d001eeb527ff015b',
      indexName: 'shopify-vite'
    },

    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Config Reference', link: '/guide/configuration' },
      { text: 'Examples', link: '/guide/example-projects' }
    ]
  }
})
