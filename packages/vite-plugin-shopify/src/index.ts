import { Plugin } from 'vite'

import { resolveOptions } from './options'
import type { Options } from './types'
import shopifyConfig from './config'
import shopifyHtml from './html'
import shopifyLiquidNoRefresh from './liquid-no-refresh'
import shopifyReactRefresh from './react-refresh'

const vitePluginShopify = (options: Options = {}): Plugin[] => {
  const resolvedOptions = resolveOptions(options)

  const plugins = [
    // Apply plugin for configuring Vite settings
    shopifyConfig(resolvedOptions),
    // Apply plugin for generating HTML asset tags through vite-tag snippet
    shopifyHtml(resolvedOptions),
    // Apply plugin for preventing full page refresh on liquid file changes
    shopifyLiquidNoRefresh(),
    // React refresh
    shopifyReactRefresh()
  ]

  return plugins
}

export default vitePluginShopify
