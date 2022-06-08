import { join, relative } from 'path'
import fs from 'fs'
import { projectRoot, root } from './config'
import type { Plugin, ResolvedConfig } from 'vite'
import { OutputChunk } from 'rollup'
import { ENTRYPOINT_TYPES_REGEX, CSS_EXTENSIONS_REGEX, CLIENT_SCRIPT_PATH } from './constants'
import { Input } from './types'
import { withoutExtension } from './utils'
import createDebugger from 'debug'

let config: ResolvedConfig

const debug = createDebugger('vite-plugin-shopify:html')

export default function VitePluginShopifyHtml (): Plugin {
  let entrypoints: Input

  return {
    name: 'vite-plugin-shopify-html',
    enforce: 'post',
    configResolved (resolvedConfig) {
      config = resolvedConfig
      entrypoints = config.build?.rollupOptions?.input as Input
      debug({ entrypoints })
    },
    configureServer (server) {
      writeSnippetFile(
        'vite-tag.liquid',
        viteTags(entrypoints)
      )

      writeSnippetFile(
        'vite-client.liquid',
        viteClient()
      )

      if (snippetFileExists('vite-legacy-tag.liquid')) {
        writeSnippetFile('vite-legacy-tag.liquid', '')
      }

      if (snippetFileExists('vite-legacy-polyfills.liquid')) {
        writeSnippetFile('vite-legacy-polyfills.liquid', '')
      }

      server.watcher.on('add', path => {
        if (!ENTRYPOINT_TYPES_REGEX.test(path)) {
          return
        }

        entrypoints[relative(root, path)] = path
        debug({ entrypoints })
        writeSnippetFile(
          'vite-tag.liquid',
          viteTags(entrypoints)
        )
      })

      server.watcher.on('unlink', path => {
        const { [relative(root, path)]: _, ...rest } = entrypoints
        entrypoints = rest
        debug({ entrypoints })
        writeSnippetFile(
          'vite-tag.liquid',
          viteTags(entrypoints)
        )
      })
    },
    generateBundle (options, bundle) {
      if (options.format === 'es') {
        const analyzedChunk: Map<OutputChunk, number> = new Map()
        const getImportedChunks = (
          chunk: OutputChunk,
          seen: Set<string> = new Set()
        ): OutputChunk[] => {
          const chunks: OutputChunk[] = []
          chunk.imports.forEach((file) => {
            const importee = bundle[file]
            if (importee?.type === 'chunk' && !seen.has(file)) {
              seen.add(file)

              chunks.push(...getImportedChunks(importee, seen))
              chunks.push(importee)
            }
          })
          return chunks
        }

        const getCssTagsForChunk = (
          chunk: OutputChunk,
          seen: Set<string> = new Set()
        ): string[] => {
          const tags: string[] = []
          if (!analyzedChunk.has(chunk)) {
            analyzedChunk.set(chunk, 1)
            chunk.imports.forEach((file) => {
              const importee = bundle[file]
              if (importee?.type === 'chunk') {
                tags.push(...getCssTagsForChunk(importee, seen))
              }
            })
          }

          chunk.viteMetadata.importedCss.forEach((file) => {
            if (!seen.has(file)) {
              seen.add(file)
              tags.push(makeLinkTag({
                rel: 'stylesheet',
                href: getAssetUrl(file)
              }))
            }
          })

          return tags
        }

        const viteTags = Object.values(bundle).map(chunk => {
          if (chunk.type === 'asset') {
            if (!config.build.cssCodeSplit && chunk.name === 'style.css') {
              return `{%- if vite-tag == '${chunk.name}' -%}\n  ${makeLinkTag({ rel: 'stylesheet', href: getAssetUrl(chunk.fileName) })}\n{%- endif -%}`
            }

            if (!CSS_EXTENSIONS_REGEX.test(chunk.name as string)) {
              return ''
            }

            const entrypoint = Object.keys(entrypoints).find(entrypoint =>
              CSS_EXTENSIONS_REGEX.test(entrypoint) &&
              withoutExtension(chunk.name as string) === entrypoint
            ) as string

            if (entrypoint === undefined) {
              return ''
            }

            return `{%- if vite-tag == '${entrypoint}' -%}\n  ${makeLinkTag({ rel: 'stylesheet', href: getAssetUrl(chunk.fileName) })}\n{%- endif -%}`
          }

          if (!chunk.isEntry) {
            return ''
          }

          if (CSS_EXTENSIONS_REGEX.test(chunk.name)) {
            return config.build.cssCodeSplit
              ? `{%- if vite-tag == '${chunk.name}' -%}\n  ${getCssTagsForChunk(chunk).join('\n  ')}\n{%- endif -%}`
              : ''
          }

          const imports = getImportedChunks(chunk)
          const assetTags = [
            makeScriptTag({ src: getAssetUrl(chunk.fileName), type: 'module', crossorigin: 'anonymous' }),
            ...imports.map(chunk => makeLinkTag({ href: getAssetUrl(chunk.fileName), rel: 'modulepreload', as: 'script', crossorigin: 'anonymous' }))
          ]

          assetTags.push(...getCssTagsForChunk(chunk))

          return `{%- if vite-tag == '${chunk.name}' -%}\n  ${assetTags.join('\n  ')}\n{%- endif -%}`
        }).filter(Boolean).join('\n\n')

        writeSnippetFile('vite-tag.liquid', viteTags)
        writeSnippetFile('vite-client.liquid', '')
      }

      if (options.format === 'system') {
        const viteLegacyTags = Object.keys(entrypoints).map(key => {
          const entrypoint = entrypoints[key]
          const chunk = Object.values(bundle).find(chunk =>
            chunk.type === 'chunk' &&
            chunk.isEntry &&
            chunk.facadeModuleId === entrypoint &&
            chunk.fileName.includes('-legacy')
          ) as OutputChunk | undefined

          if (chunk === undefined || CSS_EXTENSIONS_REGEX.test(key)) {
            return null
          }

          const legacyTag = makeScriptTag({ src: getAssetUrl(chunk.fileName), nomodule: 'nomodule' })

          return `{%- if vite-legacy-tag == '${key}' -%}\n  ${legacyTag}\n{%- endif -%}`
        }).filter(Boolean).join('\n\n')

        const polyfillId = '\0vite/legacy-polyfills'

        const polyfillChunk = Object.values(bundle).find(chunk =>
          chunk.type === 'chunk' &&
          chunk.isEntry &&
          chunk.facadeModuleId === polyfillId
        ) as OutputChunk | undefined

        if (polyfillChunk !== undefined) {
          const viteLegacyPolyfills = makeScriptTag({ src: getAssetUrl(polyfillChunk.fileName), nomodule: 'nomodule' })
          writeSnippetFile('vite-legacy-polyfills.liquid', viteLegacyPolyfills)
        }

        if (viteLegacyTags.length > 0) {
          writeSnippetFile('vite-legacy-tag.liquid', viteLegacyTags)
        }
      }
    }
  }
}

function writeSnippetFile (filename: string, content: string): void {
  return fs.writeFileSync(join(projectRoot, 'snippets', filename), content)
}

function viteClient (): string {
  return makeScriptTag({ src: getAssetUrl(CLIENT_SCRIPT_PATH), type: 'module' })
}

function viteTags (entrypoints: Input): string {
  return `${Object.keys(entrypoints)
    .map(viteTag)
    .join('\n\n')}`
}

function viteTag (entrypoint: string): string {
  return `{%- if vite-tag == '${entrypoint}' -%}\n  ${CSS_EXTENSIONS_REGEX.test(entrypoint)
      ? makeLinkTag({ href: getAssetUrl(entrypoint), rel: 'stylesheet' })
      : makeScriptTag({ src: getAssetUrl(entrypoint), type: 'module' })}\n{%- endif -%}`
}

function makeHtmlAttributes (attributes: Record<string, string>): string {
  if (attributes === undefined) {
    return ''
  }

  const keys = Object.keys(attributes)

  return keys.reduce((result, key) => {
    result += ` ${key}="${attributes[key]}"`
    return result
  }, '')
}

function makeLinkTag (attributes: Record<string, string>): string {
  return `<link${makeHtmlAttributes(attributes)}>`
}

function makeScriptTag (attributes: Record<string, string>): string {
  return `<script${makeHtmlAttributes(attributes)}></script>`
}

function getAssetUrl (asset: string): string {
  if (config.command === 'serve') {
    const protocol = config?.server?.https === true ? 'https:' : 'http:'
    const host = config?.server?.host as string
    const port = config?.server?.port as number

    return `${protocol}//${host}:${port.toString()}/${asset}`
  }

  return `{{ '${asset}' | asset_url }}`
}

function snippetFileExists (filename: string): boolean {
  return fs.existsSync(join(projectRoot, 'snippets', filename))
}
