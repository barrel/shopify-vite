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
      '@@': resolve('resources/js'),
      '@modules': resolve('frontend/modules')
    }
  },
  plugins: [
    basicSsl(),
    shopify({
      snippetFile: 'vite.liquid',
      additionalEntrypoints: [
        'frontend/foo.ts', // relative to sourceCodeDir
        'frontend/bar.ts',
        'frontend/modules/**/*.ts',
        'resources/**/*.js' // relative to themeRoot
      ]
    })
  ],
  build: {
    sourcemap: true
  }
})
