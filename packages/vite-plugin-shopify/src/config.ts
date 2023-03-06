import path from 'node:path'
import { Plugin, UserConfig, mergeConfig, normalizePath } from 'vite'
import glob from 'fast-glob'
import createDebugger from 'debug'

import type { VitePluginShopifyOptions } from './types'

const debug = createDebugger('vite-plugin-shopify:config')

// Plugin for setting necessary Vite config to support Shopify plugin functionality
export default function shopifyConfig (options: Required<VitePluginShopifyOptions>): Plugin {
  return {
    name: 'vite-plugin-shopify-config',
    config (config: UserConfig): UserConfig {
      const host = config.server?.host ?? 'localhost'
      const port = config.server?.port ?? 5173
      const https = config.server?.https ?? false
      const origin = config.server?.origin ?? '__shopify_vite_placeholder__'
      const socketProtocol = https === false ? 'ws' : 'wss'

      let input = glob.sync(normalizePath(path.join(options.entrypointsDir, '**/*')), { onlyFiles: true })

      options.additionalEntrypoints.forEach((globPattern) => {
        input = input.concat(glob.sync(globPattern, { onlyFiles: true }))
      })

      const generatedConfig: UserConfig = {
        // Use relative base path so to load imported assets from Shopify CDN
        base: './',
        // Do not use "public" directory
        publicDir: false,
        build: {
          // Output files to "assets" directory
          outDir: path.join(options.themeRoot, 'assets'),
          // Do not use subfolder for static assets
          assetsDir: '',
          // Configure bundle entry points
          rollupOptions: { input },
          // Output manifest file for backend integration
          manifest: true
        },
        resolve: {
          // Provide import alias to source code dir for convenience
          alias: {
            '~': path.resolve(options.sourceCodeDir),
            '@': path.resolve(options.sourceCodeDir)
          }
        },
        server: {
          host,
          https,
          port,
          origin,
          strictPort: true,
          hmr: {
            host: typeof host === 'string' ? host : undefined,
            port,
            protocol: socketProtocol
          }
        }
      }

      debug(generatedConfig)

      return mergeConfig(generatedConfig, config)
    }
  }
}
