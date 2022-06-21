import MagicString from 'magic-string'
import type { Plugin, ResolvedConfig } from 'vite'
import { CSS_EXTENSIONS_REGEX } from './constants'

// Plugin for adjusting URLs in CSS to load properly from Shopify dev server or CDN
export default function VitePluginCssUrl (): Plugin {
  let config: ResolvedConfig

  return {
    name: 'vite-plugin-shopify-css-url',
    configResolved (resolvedConfig) {
      // Store reference to resolved config
      config = resolvedConfig
    },
    transform (code, id) {
      if (id.match(CSS_EXTENSIONS_REGEX) !== null) {
        const s = new MagicString(code)

        if (config.command === 'serve') {
          // Use domain-relative host for aliased CSS URLs in development
          s.replace(/\/@fs\//, '/')
        }

        if (s.hasChanged()) {
          return {
            code: s.toString(),
            map: s.generateMap({ source: id, includeContent: true })
          }
        }
      }
    }
  }
}
