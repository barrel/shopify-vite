import fs from 'node:fs'
import path from 'node:path'
import { AddressInfo } from 'node:net'
import { Manifest, Plugin, ResolvedConfig, normalizePath } from 'vite'
import { CSS_EXTENSIONS_REGEX, KNOWN_CSS_EXTENSIONS } from '../../vite-plugin-shopify/src/constants'
import { assetUrl, viteEntryTag, viteTagDisclaimer, viteTagEntryPath, resolveDevServerUrl } from '../../vite-plugin-shopify/src/html'
import { DevServerUrl } from '../../vite-plugin-shopify/src/types'

/** Plugin configuration */
export interface Options {
  /**
   * Root path to your Shopify theme directory.
   *
   * @default './'
   */
  themeRoot?: string

  /**
   * Front-end entry points directory.
   *
   * @default 'frontend/entrypoints'
   */
  entrypointsDir?: string

  /**
   * Front-end source code directory.
   *
   * @default 'frontend'
   */
  sourceCodeDir?: string

  /**
   * Specifies the file name of the snippet that loads your assets.
   *
   * @default 'vite-tag.liquid'
   */
  snippetFile?: string
}

// Generate a production stylesheet link tag for a style asset
const stylesheetTag = (fileName: string, versionNumbers: boolean): string =>
  `<link
    rel="preload"
    fetchpriority="{{ fetchpriority | default: 'low' }}"
    href="{{ ${assetUrl(fileName, versionNumbers)} }}"
    as="style"
    onload="this.onload=null;this.rel='stylesheet'"
   >
   <noscript>
     <link rel="stylesheet" href="{{ ${assetUrl(fileName, versionNumbers)} }}">
   </noscript>`

// Generate vite-tag snippet for development
export const viteTagSnippetDev = (assetHost: string, entrypointsDir: string): string =>
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
%}
<script src="${assetHost}/@vite/client" type="module"></script>
{% if is_css == true %}
  <link
    rel="preload"
    fetchpriority="{{ fetchpriority | default: 'low' }}"
    href="{{ file_url }}"
    as="style"
    onload="this.onload=null;this.rel='stylesheet'"
   >
   <noscript>
     <link rel="stylesheet" href="{{ file_url }}">
   </noscript>
{% endif %}
`

export default function deferCss (options: Options = {}): Plugin {
  const { themeRoot = './', snippetFile = 'defer-css.liquid', sourceCodeDir = 'frontend' } = options
  const entrypointsDir = options.entrypointsDir ?? normalizePath(path.join(sourceCodeDir, 'entrypoints'))
  let config: ResolvedConfig
  let viteDevServerUrl: DevServerUrl
  const viteTagSnippetName = snippetFile.replace(/\.[^.]+$/, '')
  const viteTagSnippetPath = path.resolve(themeRoot, `snippets/${snippetFile}`)

  return {
    name: 'vite-plugin-shopify-defer-css',
    enforce: 'post',
    configResolved (resolvedConfig) {
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

          const viteTagSnippetContent = viteTagDisclaimer + viteTagEntryPath(config.resolve.alias, entrypointsDir, viteTagSnippetName) + viteTagSnippetDev(viteDevServerUrl, entrypointsDir)

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

      const manifestOption = config.build?.manifest
      const manifestFilePath = path.resolve(
        themeRoot,
        `assets/${typeof manifestOption === 'string' ? manifestOption : '.vite/manifest.json'}`
      )

      if (!fs.existsSync(manifestFilePath)) {
        return
      }

      const assetTags: string[] = []
      const manifest = JSON.parse(
        fs.readFileSync(manifestFilePath, 'utf8')
      ) as Manifest

      Object.keys(manifest).forEach((src) => {
        const { file, isEntry } = manifest[src]
        const ext = path.extname(src)

        // Generate tags for JS and CSS entry points
        if (isEntry === true) {
          const entryName = normalizePath(path.relative(entrypointsDir, src))
          const entryPaths = [`/${src}`, entryName]
          const tagsForEntry = []

          if (ext.match(CSS_EXTENSIONS_REGEX) !== null) {
            // Render style tag for CSS entry
            tagsForEntry.push(stylesheetTag(file, true))

            assetTags.push(viteEntryTag(entryPaths, tagsForEntry.join('\n  '), assetTags.length === 0))
          }
        }

        // Generate entry tag for bundled "style.css" file when cssCodeSplit is false
        if (src === 'style.css' && !config.build.cssCodeSplit) {
          assetTags.push(viteEntryTag([src], stylesheetTag(file, true), false))
        }
      })

      const viteTagSnippetContent = viteTagDisclaimer + viteTagEntryPath(config.resolve.alias, entrypointsDir, viteTagSnippetName) + assetTags.join('\n') + '\n{% endif %}\n'

      // Write vite-tag snippet for production build
      fs.writeFileSync(viteTagSnippetPath, viteTagSnippetContent)
    }
  }
}
