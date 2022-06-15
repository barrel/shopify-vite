import fs from 'fs'
import path from 'path'
import type { Plugin, ResolvedConfig } from 'vite'

import { CSS_EXTENSIONS_REGEX, KNOWN_CSS_EXTENSIONS } from './constants'
import { ResolvedVitePluginShopifyOptions } from './options'

// Plugin for generating vite-tag liquid theme snippet with entry points for JS and CSS assets
export default function shopifyHTML (options: ResolvedVitePluginShopifyOptions): Plugin {
  let config: ResolvedConfig

  const snippetPath = path.resolve(options.themeRoot, 'snippets/vite-tag.liquid')

  return {
    name: 'vite-plugin-shopify-html',
    enforce: 'post',
    configResolved (resolvedConfig) {
      // Store reference to resolved config
      config = resolvedConfig
    },
    configureServer () {
      const protocol = config.server?.https === true ? 'https:' : 'http:'
      const host = typeof config.server?.host === 'string' ? config.server.host : 'localhost'
      const port = typeof config.server?.port !== 'undefined' ? config.server.port : 5173

      const viteTagSnippetContent = viteTagSnippetDev(`${protocol}//${host}:${port.toString()}`, options.entrypointsDir)

      // Write vite-tag snippet for development server
      fs.writeFileSync(snippetPath, viteTagSnippetContent)
    },
    closeBundle () {
      const assetTags: string[] = []

      const manifest = fs.readFileSync(path.resolve(options.themeRoot, 'assets/assets-manifest.json'), 'utf8')
      const manifestJson = JSON.parse(manifest)

      Object.keys(manifestJson).forEach((entryPath) => {
        const { file, src, isEntry, css, imports } = manifestJson[entryPath]
        const ext = path.extname(entryPath)

        if (isEntry === true) {
          const entryName = path.relative(options.entrypointsDir, src)
          const tagsForEntry = []

          if (ext.match(CSS_EXTENSIONS_REGEX) !== null) {
            // Render style tag for CSS entry
            tagsForEntry.push(stylesheetTag(css[0]))
          } else {
            // Render script tag for JS entry
            tagsForEntry.push(scriptTag(file))

            if (typeof css !== 'undefined' && css.length > 0) {
              css.forEach((cssFileName: string) => {
                // Render style tag for imported CSS file
                tagsForEntry.push(stylesheetTag(cssFileName))
              })
            }

            if (typeof imports !== 'undefined' && imports.length > 0) {
              imports.forEach((importFilename: string) => {
                const chunk = manifestJson[importFilename]
                // Render preload tags for JS imports
                tagsForEntry.push(preloadTag(chunk.file, 'script'))
              })
            }
          }

          assetTags.push(viteEntryTag(entryName, tagsForEntry.join('\n  '), assetTags.length === 0))
        }
      })

      const viteTagSnippetContent = assetTags.join('\n') + '\n{% endif %}\n'

      // Write vite-tag snippet for production build
      fs.writeFileSync(snippetPath, viteTagSnippetContent)
    }
  }
}

// Generate conditional statement for entry tag
const viteEntryTag = (entryName: string, tag: string, isFirstEntry = false): string =>
  `{% ${!isFirstEntry ? 'els' : ''}if vite-tag == "${entryName}" %}\n  ${tag}`

// Generate a preload link tag for a script or style asset
const preloadTag = (fileName: string, as: 'script' | 'style'): string =>
  `<link rel="${as === 'script' ? 'modulepreload' : 'preload'}" href="{{ '${fileName}' | asset_url }}" as="${as}">`

// Generate a script tag for a script asset
const scriptTag = (fileName: string): string =>
  `<script src="{{ '${fileName}' | asset_url }}" type="module" crossorigin="anonymous"></script>`

// Generate a stylesheet link tag for a style asset
const stylesheetTag = (fileName: string): string =>
  `{{ '${fileName}' | asset_url | stylesheet_tag }}`

// Generate vite-tag snippet for development
const viteTagSnippetDev = (assetHost = 'http://localhost:5173', entrypointsDir = 'frontend/assets'): string =>
  `{% liquid
  assign file_url = vite-tag | prepend: '${assetHost}/${entrypointsDir}/'
  assign file_extension = vite-tag | split: '.' | last
  assign css_extensions = '${KNOWN_CSS_EXTENSIONS.join('|')}' | split: '|'
  assign is_css = false
  for css_ext in css_extensions
    if file_extension == css_ext
      assign is_css = true
    endif
  endfor
%}
{% if is_css == true %}
  {{ file_url | stylesheet_tag }}
{% else %}
  <script src="{{ file_url }}" type="module" crossorigin="anonymous"></script>
{% endif %}
`
