import MagicString from 'magic-string'
import type { Plugin, ResolvedConfig } from 'vite'
import { CSS_EXTENSIONS_REGEX } from './constants'

// Plugin for adjusting URLs in CSS to load properly from Shopify dev server or CDN
export default function VitePluginCssUrl (): Plugin {
  let config: ResolvedConfig
  let devServerHost: string

  return {
    name: 'vite-plugin-shopify-css-url',
    configResolved (resolvedConfig) {
      // Store reference to resolved config
      config = resolvedConfig

      const protocol = config.server?.https === true ? 'https' : 'http'
      const host = typeof config.server?.host === 'string' ? config.server.host : 'localhost'
      const port = typeof config.server?.port !== 'undefined' ? config.server.port : 5173

      // Store reference to resolved dev server host
      devServerHost = `${protocol}://${host}:${port}`
    },
    transform (code, id) {
      if (id.match(CSS_EXTENSIONS_REGEX) !== null) {
        const s = new MagicString(code)

        if (config.command === 'serve') {
          // Prepend host to CSS URLs in development to load assets from dev server
          s.replace(/url\('\//, `url('${devServerHost}/`).replace(/url\("\//, `url("${devServerHost}/`)
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
