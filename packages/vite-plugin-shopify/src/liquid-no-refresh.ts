import { Plugin } from 'vite'
import createDebugger from 'debug'

const debug = createDebugger('vite-plugin-shopify:liquid-no-refresh')

export default function shopifyLiquidNoRefresh(): Plugin {
  return {
    name: 'vite-plugin-shopify:liquid-tailwind-refresh',
    handleHotUpdate(ctx) {
      if (ctx.file.endsWith('.liquid')) {
        debug(ctx.file)
        // Filter out the liquid module to prevent a full refresh
        return [...ctx.modules[0]?.importers ?? [], ...ctx.modules.slice(1)]
      }
    }
  }
}
