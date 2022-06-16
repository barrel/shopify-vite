import { Plugin } from 'vite'

import { VitePluginShopifyOptions, resolveOptions } from './options'
import assetsManifest from './assets-manifest'
import shopifyConfig from './config'
import shopifyHtml from './html'
import shopifyCssUrl from './css-url'

const vitePluginShopify = (options: VitePluginShopifyOptions = {}): Plugin[] => {
  const resolvedOptions = resolveOptions(options)

  const plugins = [
    // Apply plugin for generating manifest including CSS entries
    assetsManifest({ manifestFile: 'assets-manifest.json' }),
    //  Apply plugin for configuring Vite settings
    shopifyConfig(resolvedOptions),
    // Apply plugin for generating HTML asset tags through vite-tag snippet
    shopifyHtml(resolvedOptions),
    // Apply plugin for adjusting URLs in CSS to work on Shopify servers
    shopifyCssUrl()
  ]

  return plugins
}

export default vitePluginShopify
