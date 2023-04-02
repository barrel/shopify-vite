import { Plugin } from 'vite'

import { resolveOptions } from './options'
import type { Options } from './types'
import shopifyConfig from './config'
import shopifyHtml from './html'

const vitePluginShopify = (options: Options = {}): Plugin[] => {
  const resolvedOptions = resolveOptions(options)
  const virtualModuleId = 'virtual:react-refresh'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  const shopifyReactRefresh: Plugin = {
    name: 'vite-plugin-shopify:react-refresh', // required, will show up in warnings and errors
    resolveId (id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load (id) {
      if (id === resolvedVirtualModuleId) {
        return `
          import RefreshRuntime from '__shopify_vite_placeholder__/@react-refresh'
          RefreshRuntime.injectIntoGlobalHook(window)
          window.$RefreshReg$ = () => {}
          window.$RefreshSig$ = () => (type) => type
          window.__vite_plugin_react_preamble_installed__ = true
        `
      }
    }
  }

  const plugins = [
    // Apply plugin for configuring Vite settings
    shopifyConfig(resolvedOptions),
    // Apply plugin for generating HTML asset tags through vite-tag snippet
    shopifyHtml(resolvedOptions),
    // React refresh
    shopifyReactRefresh
  ]

  return plugins
}

export default vitePluginShopify
