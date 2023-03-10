import { defineConfig } from 'vite'
import shopify from 'vite-plugin-shopify'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  server: {
    host: true,
    https: true,
    port: 3000
  },
  publicDir: 'public',
  resolve: {
    alias: {
      '~~': 'frontend',
      '@@': 'frontend'
    }
  },
  plugins: [
    basicSsl(),
    shopify({
      snippetFile: 'vite-tag.liquid',
      additionalEntrypoints: [
        'frontend/foo.ts', // relative to sourceCodeDir
        'resources/bar.ts', // relative to themeRoot
        'resources/cart-drawer.ts'
      ]
    })
  ],
  build: {
    sourcemap: true
  }
})
