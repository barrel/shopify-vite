import { defineConfig } from 'vite'
import shopify from 'vite-plugin-shopify'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { resolve } from 'node:path'

export default defineConfig({
  server: {
    host: true,
    https: true,
    port: 3000
  },
  publicDir: 'public',
  resolve: {
    alias: {
      '~~': resolve('frontend'),
      '@@': resolve('frontend'),
      '@modules': resolve('resources/modules'),
      '~modules': resolve('resources/modules')
    }
  },
  plugins: [
    basicSsl(),
    shopify({
      snippetFile: 'vite-tag.liquid',
      additionalEntrypoints: [
        'frontend/foo.ts', // relative to sourceCodeDir
        'resources/bar.ts', // relative to themeRoot
        'resources/cart-drawer.ts',
        'resourses/modules/**.ts'
      ]
    })
  ],
  build: {
    sourcemap: true
  }
})
