import { defineConfig, defaultAllowedOrigins } from 'vite'
import shopify from 'vite-plugin-shopify'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    shopify(),
    preact(),
    tailwindcss()
  ],
  server: {
    cors: {
      origin: [
        defaultAllowedOrigins,
        'https://johns-apparel.myshopify.com'
      ]
    }
  }
})
