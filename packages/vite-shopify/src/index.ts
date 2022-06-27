import { Plugin } from 'vite'

import shopify from 'vite-plugin-shopify'
import shopifyModules from 'vite-plugin-shopify-modules'
import shopifyThemeSettings from 'vite-plugin-shopify-theme-settings'

export default function shopifyPreset (options = {}): Plugin[] {
  return [
    ...shopify(options),
    shopifyModules(options),
    shopifyThemeSettings(options)
  ]
}
