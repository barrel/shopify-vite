import path from 'path'
import { Plugin, UserConfig, mergeConfig } from 'vite'
import glob from 'fast-glob'
import normalize from 'normalize-path'
import createDebugger from 'debug'

import { ResolvedVitePluginShopifyOptions } from './options'

const debug = createDebugger('vite-plugin-shopify:config')

// Plugin for setting necessary Vite config to support Shopify plugin functionality
export default function shopifyConfig (options: ResolvedVitePluginShopifyOptions): Plugin {
  return {
    name: 'vite-plugin-shopify-config',
    config (config: UserConfig): UserConfig {
      const host = config.server?.host ?? 'localhost'
      const port = config.server?.port ?? 5173
      const https = config.server?.https
      const protocol = https === true ? 'https:' : 'http:'
      const origin = `${protocol}//${host as string}:${port}`
      const socketProtocol = https === true ? 'wss' : 'ws'

      let input = glob.sync(normalize(path.join(options.entrypointsDir, '**/*')), { onlyFiles: true })

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
            host: host as string,
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
