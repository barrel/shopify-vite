import path from 'node:path'
import { Plugin, UserConfig, normalizePath } from 'vite'
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
          alias: Array.isArray(config.resolve?.alias)
            ? [
                ...(config.resolve?.alias ?? []),
                ...Object.keys(defaultAliases).map(alias => ({
                  find: alias,
                  replacement: defaultAliases[alias]
                }))
              ]
            : {
                ...defaultAliases,
                ...config.resolve?.alias
              }
        },
        server: {
          host,
          https,
          port,
          origin,
          hmr: config.server?.hmr === false
            ? false
            : {
                ...(typeof host === 'string' && { host }),
                ...(config.server?.hmr === true ? {} : config.server?.hmr)
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
