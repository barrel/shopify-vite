import { defineConfig } from 'vite'

import shopify from 'vite-plugin-shopify'
import shopifyModules from 'vite-plugin-shopify-modules'
import shopifyThemeSettings from 'vite-plugin-shopify-theme-settings'

export default defineConfig({
  build: {
    manifest: true
  },
  plugins: [
    // "Shopify" plugin enables entrypoint detection, smart generation of script and link tags, and support for Shopify CDN-hosted assets
    shopify(),
    // "Shopify Modules" plugin enables "modules" folder pattern
    shopifyModules(),
    // "Shopify Theme Settings" plugin enables managing theme settings schema in individual files under "config/src/*.json"
    shopifyThemeSettings()
  ]
})
