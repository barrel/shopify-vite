import { defineConfig } from 'vite'
import shopify from 'vite-plugin-shopify'
import shopifyModules from 'vite-plugin-shopify-modules'

export default defineConfig({
  plugins: [
    shopify({
      additionalEntrypoints: [
        'frontend/foo.ts', // relative to sourceCodeDir
        'resources/bar.ts', // relative to themeRoot
        'modules/**/*.{ts,js}'
      ]
    }),
    shopifyModules()
  ],
  build: {
    emptyOutDir: true
  }
})
