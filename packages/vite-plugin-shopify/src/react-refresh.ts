import { Plugin } from 'vite'

export default function shopifyReactRefresh (): Plugin {
  const virtualModuleId = 'virtual:react-refresh'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'vite-plugin-shopify:react-refresh',
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
}
