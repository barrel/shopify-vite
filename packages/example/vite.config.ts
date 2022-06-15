import { defineConfig } from 'vite'
import Shopify from '@barrelny/vite-plugin-shopify'

export default defineConfig({
  plugins: [
    Shopify()
  ]
})
