import path from 'path'
import { Plugin, UserConfig } from 'vite'
import glob from 'fast-glob'

import { ResolvedVitePluginShopifyOptions } from './options'

// Plugin for setting necessary Vite config to support Shopify plugin functionality
export default function shopifyConfig (options: ResolvedVitePluginShopifyOptions): Plugin {
  const sourceCodeDir = path.resolve(options.sourceCodeDir)

  return {
    name: 'vite-plugin-shopify-config',
    config () {
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
          // Clear output directory before each build
          emptyOutDir: true,
          // Configure bundle entry points
          rollupOptions: {
            input: glob.sync(path.join(options.entrypointsDir, '**/*'), { onlyFiles: true })
          },
          // Output manifest file for backend integration
          manifest: true
        },
        resolve: {
          // Provide import alias to source code dir for convenience
          alias: {
            '~': sourceCodeDir,
            '@': sourceCodeDir
          }
        },
        server: {
          host: true
        }
      }

      return generatedConfig
    }
  }
}
