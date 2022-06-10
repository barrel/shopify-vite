import { defineConfig } from 'vite'
import Shopify from '@barrelny/vite-plugin-shopify'

export default defineConfig({
  build: {
    emptyOutDir: true
  },
  plugins: [
    Shopify()
  ]
})
