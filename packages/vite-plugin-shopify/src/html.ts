import fs from 'node:fs'
import path from 'node:path'
import { AddressInfo } from 'node:net'
import { Manifest, Plugin, ResolvedConfig, normalizePath } from 'vite'
import createDebugger from 'debug'
import startTunnel from '@shopify/plugin-cloudflare/hooks/tunnel'
import { renderInfo, isTTY } from '@shopify/cli-kit/node/ui'

import { CSS_EXTENSIONS_REGEX, KNOWN_CSS_EXTENSIONS, hotReloadScriptId, hotReloadScriptUrl } from './constants'
import type { Options, DevServerUrl, FrontendURLResult } from './types'
import type { TunnelClient } from '@shopify/cli-kit/node/plugins/tunnel'

const debug = createDebugger('vite-plugin-shopify:html')

// Plugin for generating vite-tag liquid theme snippet with entry points for JS and CSS assets
export default function shopifyHTML (options: Required<Options>): Plugin {
  let config: ResolvedConfig
  let viteDevServerUrl: DevServerUrl
  let tunnelClient: TunnelClient | undefined
  let tunnelUrl: string | undefined

  const viteTagSnippetPath = path.resolve(options.themeRoot, `snippets/${options.snippetFile}`)
  const viteTagSnippetName = options.snippetFile.replace(/\.[^.]+$/, '')
  const viteTagSnippetPrefix = (config: ResolvedConfig): string =>
    viteTagDisclaimer + viteTagEntryPath(config.resolve.alias, options.entrypointsDir, viteTagSnippetName)

  return {
    name: 'vite-plugin-shopify-html',
    enforce: 'post',
    configResolved (resolvedConfig) {
      // Store reference to resolved config
      config = resolvedConfig
    },
    transform (code) {
      if (config.command === 'serve') {
        return code.replace(/__shopify_vite_placeholder__/g, tunnelUrl ?? viteDevServerUrl)
      }
    },
    configureServer ({ config, middlewares, httpServer }) {
      const tunnelConfig = resolveTunnelConfig(options)

      if (tunnelConfig.frontendPort !== -1) {
        config.server.port = tunnelConfig.frontendPort
        config.server.allowedHosts = [new URL(tunnelConfig.frontendUrl).hostname]
      }

      httpServer?.once('listening', () => {
        const address = httpServer?.address()

        const isAddressInfo = (x: string | AddressInfo | null | undefined): x is AddressInfo => typeof x === 'object'

        if (isAddressInfo(address)) {
          viteDevServerUrl = resolveDevServerUrl(address, config)
          const reactPlugin = config.plugins.find(plugin =>
            plugin.name === 'vite:react-babel' || plugin.name === 'vite:react-refresh'
          )

          debug({ address, viteDevServerUrl, tunnelConfig })

          setTimeout(() => {
            void (async (): Promise<void> => {
              if (options.tunnel === false) {
                return
              }

              if (tunnelConfig.frontendUrl !== '') {
                tunnelUrl = tunnelConfig.frontendUrl
                isTTY() && renderInfo({ body: `${viteDevServerUrl} is tunneled to ${tunnelUrl}` })
                return
              }

              const hook = await startTunnel({
                config: null,
                provider: 'cloudflare',
                port: address.port
              })
              tunnelClient = hook.valueOrAbort()
              tunnelUrl = await pollTunnelUrl(tunnelClient)
              config.server.allowedHosts = [new URL(tunnelUrl).hostname]
              isTTY() && renderInfo({ body: `${viteDevServerUrl} is tunneled to ${tunnelUrl}` })
              const viteTagSnippetContent = viteTagSnippetPrefix(config) + viteTagSnippetDev(
                tunnelUrl, options.entrypointsDir, reactPlugin, options.themeHotReload
              )

              // Write vite-tag with a Cloudflare Tunnel URL
              fs.writeFileSync(viteTagSnippetPath, viteTagSnippetContent)
            })()
          }, 100)

          const viteTagSnippetContent = viteTagSnippetPrefix(config) + viteTagSnippetDev(
            tunnelConfig.frontendUrl !== ''
              ? tunnelConfig.frontendUrl
              : viteDevServerUrl, options.entrypointsDir, reactPlugin, options.themeHotReload
          )

          // Write vite-tag snippet for development server
          fs.writeFileSync(viteTagSnippetPath, viteTagSnippetContent)
        }
      })

      httpServer?.on('close', () => {
        tunnelClient?.stopTunnel()
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
        options.themeRoot,
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
                if (config.build.modulePreload !== false && config.build.modulePreload.polyfill) {
                  // Render preload tags for JS imports
                  tagsForEntry.push(preloadScriptTag(chunk.file, options.versionNumbers))
                }

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

      const viteTagSnippetContent = viteTagSnippetPrefix(config) + assetTags.join('\n') + '\n{% endif %}\n'

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

  // Support both 'entry' (new, strict parser) and snippetName (old, backward compat)
  const paramName = 'entry' // Fixed semantic name for new syntax

  const replaceChain = replacements
    .map(([from, to]) => `replace: '${from}/', '${to}/'`)
    .join(' | ')

  // Generate liquid that uses default filter for backward compatibility
  return `{% liquid
  assign ${paramName} = ${paramName} | default: ${snippetName}
  assign path = ${paramName}${replaceChain ? ' | ' + replaceChain : ''}
%}
`
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
const viteTagSnippetDev = (assetHost: string, entrypointsDir: string, reactPlugin: Plugin | undefined, themeHotReload: boolean): string =>
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
<script src="${assetHost}/@vite/client" type="module"></script>${!themeHotReload
  ? ''
  : `
<script id="${hotReloadScriptId}" src="${hotReloadScriptUrl}" type="module"></script>`}
{% if is_css == true %}
  <link rel="stylesheet" href="{{ file_url }}" crossorigin="anonymous">
{% else %}
  <script src="{{ file_url }}" type="module"></script>
{% endif %}
`

/**
 * Resolve the dev server URL from the server address and configuration.
 */
function resolveDevServerUrl (address: AddressInfo, config: ResolvedConfig): DevServerUrl {
  const configHmrProtocol = typeof config.server.hmr === 'object' ? config.server.hmr.protocol : null
  const clientProtocol = configHmrProtocol ? (configHmrProtocol === 'wss' ? 'https' : 'http') : null
  const serverProtocol = config.server.https ? 'https' : 'http'
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

function resolveTunnelConfig (options: Required<Options>): FrontendURLResult {
  let frontendPort = -1
  let frontendUrl = ''
  let usingLocalhost = false

  if (options.tunnel === false) {
    usingLocalhost = true
    return { frontendUrl, frontendPort, usingLocalhost }
  }

  if (options.tunnel === true) {
    return { frontendUrl, frontendPort, usingLocalhost }
  }

  const matches = options.tunnel.match(/(https:\/\/[^:]+):([0-9]+)/)
  if (matches === null) {
    throw new Error(`Invalid tunnel URL: ${options.tunnel}`)
  }
  frontendPort = Number(matches[2])
  frontendUrl = matches[1]
  return { frontendUrl, frontendPort, usingLocalhost }
}

/**
 * Poll the tunnel provider every 0.5 until an URL or error is returned.
 */
async function pollTunnelUrl (tunnelClient: TunnelClient): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    let retries = 0
    const pollTunnelStatus = async (): Promise<void> => {
      const result = tunnelClient.getTunnelStatus()
      debug(`Polling tunnel status for ${tunnelClient.provider} (attempt ${retries}): ${result.status}`)
      if (result.status === 'error') {
        return reject(result.message) // Changed AbortError to standard Error
      }
      if (result.status === 'connected') {
        resolve(result.url)
      } else {
        retries += 1
        startPolling()
      }
    }

    const startPolling = (): void => {
      setTimeout(() => {
        void pollTunnelStatus()
      }, 500)
    }

    void pollTunnelStatus()
  })
}
