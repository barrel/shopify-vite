import { defineConfig, defaultAllowedOrigins } from 'vite'
import shopify from 'vite-plugin-shopify'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap'

export default defineConfig({
  plugins: [
    shopify(),
    preact(),
    tailwindcss(),
    VitePluginSvgSpritemap('./frontend/icons/*.svg', {
      injectSvgOnDev: true,
    })
  ],
})
