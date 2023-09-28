import fs from 'node:fs'
import path from 'node:path'
import { AddressInfo } from 'node:net'
import { Manifest, Plugin, ResolvedConfig, normalizePath } from 'vite'
import createDebugger from 'debug'

import { CSS_EXTENSIONS_REGEX, KNOWN_CSS_EXTENSIONS } from './constants'
import type { Options, DevServerUrl } from './types'

const debug = createDebugger('vite-plugin-shopify:html')

// Plugin for generating vite-tag liquid theme snippet with entry points for JS and CSS assets
export default function shopifyHTML (options: Required<Options>): Plugin {
  let config: ResolvedConfig
  let viteDevServerUrl: DevServerUrl

  const viteTagSnippetPath = path.resolve(options.themeRoot, `snippets/${options.snippetFile}`)
  const viteTagSnippetName = options.snippetFile.replace(/\.[^.]+$/, '')

  return {
    name: 'vite-plugin-shopify-html',
    enforce: 'post',
    configResolved (resolvedConfig) {
      // Store reference to resolved config
      config = resolvedConfig
    },
    transform (code) {
      if (config.command === 'serve') {
        return code.replace(/__shopify_vite_placeholder__/g, viteDevServerUrl)
      }
    },
    configureServer ({ config, middlewares, httpServer }) {
      httpServer?.once('listening', () => {
        const address = httpServer?.address()

        const isAddressInfo = (x: string | AddressInfo | null | undefined): x is AddressInfo => typeof x === 'object'

        if (isAddressInfo(address)) {
          viteDevServerUrl = resolveDevServerUrl(address, config)

          debug({ address, viteDevServerUrl })

          const reactPlugin = config.plugins.find(plugin => plugin.name === 'vite:react-babel' || plugin.name === 'vite:react-refresh')

          const viteTagSnippetContent = viteTagDisclaimer + viteTagEntryPath(config.resolve.alias, options.entrypointsDir, viteTagSnippetName) + viteTagSnippetDev(viteDevServerUrl, options.entrypointsDir, reactPlugin)

          // Write vite-tag snippet for development server
          fs.writeFileSync(viteTagSnippetPath, viteTagSnippetContent)
        }
      })

      // Serve the dev-server-index.html page
      return () => middlewares.use((req, res, next) => {
        if (req.url === '/index.html') {
          res.statusCode = 404

          res.end(
            fs.readFileSync(path.join(__dirname, 'dev-server-index.html')).toString()
          )
        }

        next()
      })
    },
    closeBundle () {
      if (config.command === 'serve') {
        return
      }

      const manifestFilePath = path.resolve(options.themeRoot, 'assets/manifest.json')

      if (!fs.existsSync(manifestFilePath)) {
        return
      }

      const assetTags: string[] = []
      const manifest = JSON.parse(
        fs.readFileSync(manifestFilePath, 'utf8')
      ) as Manifest

      Object.keys(manifest).forEach((src) => {
        const { file, isEntry, css, imports } = manifest[src]
        const ext = path.extname(src)

        // Generate tags for JS and CSS entry points
        if (isEntry === true) {
          const entryName = normalizePath(path.relative(options.entrypointsDir, src))
          const entryPaths = [`/${src}`, entryName]
          const tagsForEntry = []

          if (ext.match(CSS_EXTENSIONS_REGEX) !== null) {
            // Render style tag for CSS entry
            tagsForEntry.push(stylesheetTag(file, options.versionNumbers))
          } else {
            // Render script tag for JS entry
            tagsForEntry.push(scriptTag(file, options.versionNumbers))

            if (typeof imports !== 'undefined' && imports.length > 0) {
              imports.forEach((importFilename: string) => {
                const chunk = manifest[importFilename]
                const { css } = chunk
                // Render preload tags for JS imports
                tagsForEntry.push(preloadScriptTag(chunk.file, options.versionNumbers))

                // Render style tag for JS imports
                if (typeof css !== 'undefined' && css.length > 0) {
                  css.forEach((cssFileName: string) => {
                    // Render style tag for imported CSS file
                    tagsForEntry.push(stylesheetTag(cssFileName, options.versionNumbers))
                  })
                }
              })
            }

            if (typeof css !== 'undefined' && css.length > 0) {
              css.forEach((cssFileName: string) => {
                // Render style tag for imported CSS file
                tagsForEntry.push(stylesheetTag(cssFileName, options.versionNumbers))
              })
            }
          }

          assetTags.push(viteEntryTag(entryPaths, tagsForEntry.join('\n  '), assetTags.length === 0))
        }

        // Generate entry tag for bundled "style.css" file when cssCodeSplit is false
        if (src === 'style.css' && !config.build.cssCodeSplit) {
          assetTags.push(viteEntryTag([src], stylesheetTag(file, options.versionNumbers), false))
        }
      })

      const viteTagSnippetContent = viteTagDisclaimer + viteTagEntryPath(config.resolve.alias, options.entrypointsDir, viteTagSnippetName) + assetTags.join('\n') + '\n{% endif %}\n'

      // Write vite-tag snippet for production build
      fs.writeFileSync(viteTagSnippetPath, viteTagSnippetContent)
    }
  }
}

const viteTagDisclaimer = '{% comment %}\n  IMPORTANT: This snippet is automatically generated by vite-plugin-shopify.\n  Do not attempt to modify this file directly, as any changes will be overwritten by the next build.\n{% endcomment %}\n'

// Generate liquid variable with resolved path by replacing aliases
const viteTagEntryPath = (
  resolveAlias: Array<{ find: string | RegExp, replacement: string }>,
  entrypointsDir: string,
  snippetName: string
): string => {
  const replacements: Array<[string, string]> = []

  resolveAlias.forEach((alias) => {
    if (typeof alias.find === 'string') {
      replacements.push([alias.find, normalizePath(path.relative(entrypointsDir, alias.replacement))])
    }
  })

  return `{% assign path = ${snippetName} | ${replacements.map(([from, to]) => `replace: '${from}/', '${to}/'`).join(' | ')} %}\n`
}

// Generate the asset's url with or without version numbers
const assetUrl = (fileName: string, versionNumbers: boolean): string => {
  if (!versionNumbers) {
    return `'${fileName}' | asset_url | split: '?' | first`
  }
  return `'${fileName}' | asset_url`
}

// Generate conditional statement for entry tag
const viteEntryTag = (entryPaths: string[], tag: string, isFirstEntry = false): string =>
  `{% ${!isFirstEntry ? 'els' : ''}if ${entryPaths.map((entryName) => `path == "${entryName}"`).join(' or ')} %}\n  ${tag}`

// Generate a preload link tag for a script or style asset
const preloadScriptTag = (fileName: string, versionNumbers: boolean): string =>
  `<link rel="modulepreload" href="{{ ${assetUrl(fileName, versionNumbers)} }}" crossorigin="anonymous">`

// Generate a production script tag for a script asset
const scriptTag = (fileName: string, versionNumbers: boolean): string =>
  `<script src="{{ ${assetUrl(fileName, versionNumbers)} }}" type="module" crossorigin="anonymous"></script>`

// Generate a production stylesheet link tag for a style asset
const stylesheetTag = (fileName: string, versionNumbers: boolean): string =>
  `{{ ${assetUrl(fileName, versionNumbers)} | stylesheet_tag: preload: preload_stylesheet }}`

// Generate vite-tag snippet for development
const viteTagSnippetDev = (assetHost: string, entrypointsDir: string, reactPlugin: Plugin | undefined): string =>
  `{% liquid
  assign path_prefix = path | slice: 0
  if path_prefix == '/'
    assign file_url_prefix = '${assetHost}'
  else
    assign file_url_prefix = '${assetHost}/${entrypointsDir}/'
  endif
  assign file_url = path | prepend: file_url_prefix
  assign file_name = path | split: '/' | last
  if file_name contains '.'
    assign file_extension = file_name | split: '.' | last
  endif
  assign css_extensions = '${KNOWN_CSS_EXTENSIONS.join('|')}' | split: '|'
  assign is_css = false
  if css_extensions contains file_extension
    assign is_css = true
  endif
%}${reactPlugin === undefined
  ? ''
  : `
<script src="${assetHost}/@id/__x00__vite-plugin-shopify:react-refresh" type="module"></script>`}
<script src="${assetHost}/@vite/client" type="module"></script>
{% if is_css == true %}
  {{ file_url | stylesheet_tag }}
{% else %}
  <script src="{{ file_url }}" type="module"></script>
{% endif %}
`

/**
 * Resolve the dev server URL from the server address and configuration.
 */
function resolveDevServerUrl (address: AddressInfo, config: ResolvedConfig): DevServerUrl {
  const configHmrProtocol = typeof config.server.hmr === 'object' ? config.server.hmr.protocol : null
  const clientProtocol = configHmrProtocol !== null ? (configHmrProtocol === 'wss' ? 'https' : 'http') : null
  const serverProtocol = config.server.https !== false ? 'https' : 'http'
  const protocol = clientProtocol ?? serverProtocol

  const configHmrHost = typeof config.server.hmr === 'object' ? config.server.hmr.host : null
  const configHost = typeof config.server.host === 'string' ? config.server.host : null
  const serverAddress = isIpv6(address) ? `[${address.address}]` : address.address
  const host = configHmrHost ?? configHost ?? serverAddress

  const configHmrClientPort = typeof config.server.hmr === 'object' ? config.server.hmr.clientPort : null
  const port = configHmrClientPort ?? address.port

  return `${protocol}://${host}:${port}`
}

function isIpv6 (address: AddressInfo): boolean {
  return address.family === 'IPv6' ||
    // In node >=18.0 <18.4 this was an integer value. This was changed in a minor version.
    // See: https://github.com/laravel/vite-plugin/issues/103
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error-next-line
    address.family === 6
}
