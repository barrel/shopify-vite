import { defineConfig } from 'vite'
import shopify from 'vite-plugin-shopify'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    shopify(),
    preact(),
    tailwindcss()
  ]
})
