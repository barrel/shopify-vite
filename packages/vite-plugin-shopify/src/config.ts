import path from 'path'
import { Plugin, UserConfig, ConfigEnv, mergeConfig } from 'vite'
import glob from 'fast-glob'
import createDebugger from 'debug'

import { ResolvedVitePluginShopifyOptions } from './options'

const debug = createDebugger('vite-plugin-shopify:config')

// Plugin for setting necessary Vite config to support Shopify plugin functionality
export default function shopifyConfig (options: ResolvedVitePluginShopifyOptions): Plugin {
  return {
    name: 'vite-plugin-shopify-config',
    config (config: UserConfig, env: ConfigEnv): UserConfig {
      const host = config.server?.host ?? 'localhost'
      const port = config.server?.port ?? 5173
      const https = config?.server?.https
      const protocol = https === true ? 'https:' : 'http:'
      const origin = `${protocol}//${host as string}:${port}`
      const sourcemap = env.command === 'build'
      const socketProtocol = https === true ? 'wss' : 'ws'

      debug({ host, port, https, protocol, origin, sourcemap, socketProtocol })

      const generatedConfig: UserConfig = {
        // Use the entrypoints directory as root to serve assets
        root: options.entrypointsDir,
        // Use relative base path so to load imported assets from Shopify CDN
        base: './',
        // Do not use "public" directory
        publicDir: false,
        build: {
          // Output files to "assets" directory
          outDir: path.join(options.themeRoot, 'assets'),
          // Do not use subfolder for static assets
          assetsDir: '',
          // Don't clear the assets directory of the theme by default
          emptyOutDir: false,
          // Configure bundle entry points
          rollupOptions: {
            input: glob.sync(path.join(options.entrypointsDir, '**/*'), { onlyFiles: true })
          },
          // Output manifest file for backend integration
          manifest: true,
          // Generate production source maps
          sourcemap
        },
        resolve: {
          // Provide import alias to source code dir for convenience
          alias: {
            '~': options.sourceCodeDir,
            '@': options.sourceCodeDir
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

      return mergeConfig(generatedConfig, config)
    }
  }
}
