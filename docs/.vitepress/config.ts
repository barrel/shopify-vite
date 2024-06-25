import { fileURLToPath, URL } from 'node:url'
import { HeadConfig, defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Volt, a Vite plugin for Shopify development',
  description: 'Vite integration for Shopify themes',
  appearance: 'force-dark',

  transformHead({ assets }) {
    const head: HeadConfig[] = []

    const headFont = assets.find(file => /IBMPlexSans.*\.woff2$/)

    if (headFont) {
      head.push([
        'link',
        {
          rel: 'preload',
          href: headFont,
          as: 'font',
          type: 'font/woff2',
          crossOrigin: '',
        }
      ])
    }

    return head
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Shopify Vite Plugin' }],
    ['meta', { property: 'og:image', content: 'https://shopify-vite.netlify.app/og-image.jpg' }],
    ['meta', { property: 'og:url', content: 'https://shopify-vite.netlify.app/' }],
    ['meta', { property: 'og:description', content: 'Vite integration for Shopify themes by Barrel' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@barrelny' }],
    ['meta', { name: 'theme-color', content: '#000000' }]
  ],

  themeConfig: {
    logo: '/logo.svg',
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
            text: 'Recommended Plugins',
            link: '/guide/plugins'
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
      { text: 'Examples', link: '/guide/example-projects' },
      { text: 'Plugins', link: '/guide/plugins' },
    ]
  },
  vite: {
    resolve: {
      alias: [
        {
          find: /^.*\/(VPNavBarSocialLinks|VPNavScreenSocialLinks)\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/BrandButtons.vue', import.meta.url)
          )
        },
        {
          find: /^.*\/(VPFooter)\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/Footer.vue', import.meta.url)
          )
        }
      ]
    }
  }
})
