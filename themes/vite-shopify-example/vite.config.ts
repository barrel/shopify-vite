import { defineConfig } from 'vite'
import shopify from 'vite-plugin-shopify'
import shopifyModules from 'vite-plugin-shopify-modules'
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
        'modules/**/*.{ts,js}'
      ]
    }),
    shopifyModules()
  ],
  build: {
    sourcemap: true
  }
})
