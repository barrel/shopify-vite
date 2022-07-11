import { Plugin } from 'vite'

import { VitePluginShopifyOptions, resolveOptions } from './options'
import shopifyConfig from './config'
import shopifyHtml from './html'

const vitePluginShopify = (options: VitePluginShopifyOptions = {}): Plugin[] => {
  const resolvedOptions = resolveOptions(options)

  const plugins = [
    //  Apply plugin for configuring Vite settings
    shopifyConfig(resolvedOptions),
    // Apply plugin for generating HTML asset tags through vite-tag snippet
    shopifyHtml(resolvedOptions)
  ]

  return plugins
}

export default vitePluginShopify
