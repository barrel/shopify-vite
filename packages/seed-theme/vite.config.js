import { defineConfig } from 'vite'

import shopify from 'vite-plugin-shopify'
import shopifyModules from 'vite-plugin-shopify-modules'

export default defineConfig({
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  plugins: [
    // Add shopify plugin to enable entrypoint detection, smart generation of script and link tags, and support for importing assets into the bundle.
    shopify({
      entrypointsDir: 'frontend/entrypoints'
    }),
    shopifyModules({
      modulesDir: 'modules'
    })
  ]
})
