import path from 'node:path'
import { Plugin, UserConfig, normalizePath, type Alias } from 'vite'
import glob from 'fast-glob'
import createDebugger from 'debug'

import type { Options } from './types'

const debug = createDebugger('vite-plugin-shopify:config')

// Plugin for setting necessary Vite config to support Shopify plugin functionality
export default function shopifyConfig (options: Required<Options>): Plugin {
  return {
    name: 'vite-plugin-shopify-config',
    config (config: UserConfig): UserConfig {
      const host = config.server?.host ?? 'localhost'
      const port = config.server?.port ?? 5173
      const https = config.server?.https
      const origin = config.server?.origin ?? '__shopify_vite_placeholder__'
      const defaultAliases: Record<string, string> = {
        '~': path.resolve(options.sourceCodeDir),
        '@': path.resolve(options.sourceCodeDir)
      }

      const input = glob.sync([
        normalizePath(path.join(options.entrypointsDir, '**/*')),
        ...options.additionalEntrypoints
      ], { onlyFiles: true })

      const generatedConfig: UserConfig = {
        // Use relative base path so to load imported assets from Shopify CDN
        base: config.base ?? './',
        // Do not use "public" directory
        publicDir: config.publicDir ?? false,
        build: {
          // Output files to "assets" directory
          outDir: config.build?.outDir ?? path.join(options.themeRoot, 'assets'),
          // Do not use subfolder for static assets
          assetsDir: config.build?.assetsDir ?? '',
          // Configure bundle entry points
          rollupOptions: {
            input: config.build?.rollupOptions?.input ?? input
          },
          // Output manifest file for backend integration
          manifest: typeof config.build?.manifest === 'string' ? config.build.manifest : true
        },
        resolve: {
          // Provide import alias to source code dir for convenience
          alias: (() => {
            const alias = config.resolve?.alias
            const defaultAliasEntries = Object.entries(defaultAliases).map(([find, replacement]) => ({
              find,
              replacement
            }))
            if (Array.isArray(alias)) {
              return [...(alias as Alias[]), ...defaultAliasEntries]
            }
            return { ...defaultAliases, ...alias }
          })()
        },
        server: {
          host,
          https,
          port,
          origin,
          hmr: config.server?.hmr === false
            ? false
            : {
                ...(config.server?.hmr === true ? {} : config.server?.hmr)
              },
          allowedHosts: config.server?.allowedHosts ?? [
            ...(typeof options.tunnel === 'string'
              ? (() => {
                  try {
                    return [new URL(options.tunnel).hostname]
                  } catch {
                    throw new Error(`Invalid tunnel URL: ${options.tunnel}`)
                  }
                })()
              : options.tunnel
                ? ['.trycloudflare.com']
                : [])
          ],
          cors: config.server?.cors ?? {
            origin: config.server?.origin ?? [
              /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/, // allows localhost (default)
              /\.myshopify\.com$/ // allows myshopify.com URLs
            ]
          }
        }
      }

      debug(generatedConfig)

      // Return partial config (recommended)
      // See: https://vitejs.dev/guide/api-plugin.html#config
      return generatedConfig
    }
  }
}
