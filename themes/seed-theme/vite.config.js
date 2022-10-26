import shopify from 'vite-plugin-shopify'
import shopifyModules from 'vite-plugin-shopify-modules'
import shopifyThemeSettings from 'vite-plugin-shopify-theme-settings'

export default {
  build: {
    emptyOutDir: process.env.VITE_WATCH !== 'true',
    sourcemap: true,
    watch: process.env.VITE_WATCH === 'true' && {
      exclude: ['assets/*', 'snippets/vite-*.liquid', 'config/settings_schema.json']
    }
  },
  plugins: [
    // "Shopify" plugin enables entrypoint detection, smart generation of script and link tags, and support for Shopify CDN-hosted assets
    shopify({
      additionalEntrypoints: ['modules/**/*.js']
    }),
    // "Shopify Modules" plugin enables "modules" folder pattern
    shopifyModules(),
    // "Shopify Theme Settings" plugin enables managing theme settings schema in individual files under "config/src/*.json"
    shopifyThemeSettings()
  ]
}
