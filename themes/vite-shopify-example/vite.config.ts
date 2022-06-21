import { defineConfig } from 'vite'
import shopify from 'vite-plugin-shopify'

export default defineConfig({
  plugins: [
    shopify()
  ]
})
