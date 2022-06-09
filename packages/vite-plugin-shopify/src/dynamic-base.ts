import MagicString from 'magic-string'
import escapeRE from 'escape-string-regexp'
import type { Plugin } from 'vite'
import { VITE_ASSET_RE, publicAssetsURL, buildAssetsURL } from './constants'

export default function VitePluginShopifyDynamicBase (): Plugin {
  return {
    name: 'vite-plugin-shopify-dynamic-base',
    apply: 'build',
    enforce: 'post',
    resolveId (id) {
      if (id.startsWith('/__THEME_BASE__')) {
        return id.replace('/__THEME_BASE__', '')
      }
      return null
    },
    transform (code, id) {
      const s = new MagicString(code)

      const assetId = code.match(VITE_ASSET_RE)
      if (assetId !== null) {
        s.overwrite(0, code.length,
          [
            `${publicAssetsURL}`,
            `${buildAssetsURL}`,
            `export default buildAssetsURL("${assetId[1]}".replace("/__THEME_BASE__", ""));`
          ].join('\n')
        )
      }

      if (code.includes('THEME_BASE') && !code.includes(`${publicAssetsURL}`)) {
        s.prepend(`${publicAssetsURL}`)
      }

      if (id === 'vite/preload-helper') {
        // Define vite base path as buildAssetsUrl
        s.replace(/const base = ['"]\/__THEME_BASE__\/['"]/, 'const base = publicAssetsURL')
      }

      // Sanitize imports
      s.replace(/from *['"]\/__THEME_BASE__(\/[^'"]*)['"]/g, 'from "$1"')

      // Dynamically compute string URLs featuring baseURL
      const delimiterRE = /(?<!(const base = |from *))(`([^`]*)\/__THEME_BASE__\/([^`]*)`|'([^\n']*)\/__THEME_BASE__\/([^\n']*)'|"([^\n"]*)\/__THEME_BASE__\/([^\n"]*)")/g
      /* eslint-disable-next-line no-template-curly-in-string */
      s.replace(delimiterRE, r => '`' + r.replace(/\/__THEME_BASE__\//g, '${publicAssetsURL}').slice(1, -1) + '`')

      if (s.hasChanged()) {
        return {
          code: s.toString(),
          map: s.generateMap({ source: id, includeContent: true })
        }
      }
    },
    generateBundle (_, bundle) {
      const generatedAssets = Object.entries(bundle).filter(([_, asset]) => asset.type === 'asset').map(([key]) => escapeRE(key))
      const assetRE = new RegExp(`\\/__THEME_BASE__\\/(${generatedAssets.join('|')})`, 'g')

      for (const file in bundle) {
        const asset = bundle[file]
        if (asset.fileName.includes('legacy') && asset.type === 'chunk' && asset.code.includes('innerHTML')) {
          for (const delimiter of ['`', '"', "'"]) {
            asset.code = asset.code.replace(
              new RegExp(`(?<=innerHTML=)${delimiter}([^${delimiter}]*)\\/__THEME_BASE__\\/([^${delimiter}]*)${delimiter}`, 'g'),
              /* eslint-disable-next-line no-template-curly-in-string */
              '`$1${(window?.themeAssetsBaseUrl)}$2`'
            )
          }
        }
        if (asset.type === 'asset' && typeof asset.source === 'string' && asset.fileName.endsWith('.css')) {
          const depth = file.split('/').length - 1
          const assetBase = depth === 0 ? '.' : Array.from({ length: depth }).map(() => '..').join('/')
          const publicBase = Array.from({ length: depth + 1 }).map(() => '..').join('/')
          asset.source = asset.source
            .replace(assetRE, r => r.replace(/\/__THEME_BASE__/g, assetBase))
            .replace(/\/__THEME_BASE__/g, publicBase)
        }
        if (asset.type === 'chunk' && typeof asset.code === 'string') {
          asset.code = asset.code
            .replace(/"\/__THEME_BASE__\/([^"]*)"\.replace\("\/__THEME_BASE__",\s?""\)/g, '"$1"')
            .replace(/'\/__THEME_BASE__\/([^']*)'\.replace\("\/__THEME_BASE__",\s?""\)/g, '"$1"')
        }
      }
    }
  }
}
