import { join, relative } from 'path'
import { normalizePath, mergeConfig } from 'vite'
import type { ConfigEnv, PluginOption, UserConfig } from 'vite'
import { Entrypoints } from './types'
import glob from 'fast-glob'
import { filterEntrypointsForRollup, outputOptions, projectRoot, root, sourceCodeDir } from './config'
import createDebugger from 'debug'
import ShopifyHtml from './html'

const debug = createDebugger('vite-plugin-shopify:config')

function config (config: UserConfig, env: ConfigEnv): UserConfig {
  const assetsDir = './'
  const outDir = relative(root, join(projectRoot, 'assets'))
  const sourcemap = env.command === 'build'
  const base = env.command === 'build' ? (config?.base ?? '/__THEME_BASE__/') : '/'
  const host = config?.server?.host ?? 'localhost'
  const port = config?.server?.port ?? 3000
  const https = config?.server?.https ?? false
  const socketProtocol = https === true ? 'wss' : 'ws'
  const protocol = https === true ? 'https:' : 'http:'
  const origin = `${protocol}//${host as string}:${port}`
  const alias = {
    '~': sourceCodeDir,
    '@': sourceCodeDir
  }

  const entrypoints: Entrypoints = glob
    .sync(`${normalizePath(root)}/**/*`, { onlyFiles: true })
    .map((filename) => [relative(root, filename), filename])

  debug({ root, host, https, protocol, socketProtocol, port, base, origin, entrypoints })

  return mergeConfig({
    root,
    base,
    publicDir: false,
    server: {
      host,
      https,
      port,
      origin,
      strictPort: true,
      hmr: {
        host,
        port,
        protocol: socketProtocol
      }
    },
    resolve: {
      alias
    },
    build: {
      sourcemap,
      emptyOutDir: false,
      assetsDir,
      manifest: true,
      outDir,
      rollupOptions: {
        input: Object.fromEntries(filterEntrypointsForRollup(entrypoints)),
        output: outputOptions(assetsDir)
      }
    }
  }, config)
}

export default function VitePluginShopify (): PluginOption[] {
  return [
    {
      name: 'vite-plugin-shopify',
      config
    },
    ShopifyHtml()
  ]
}
