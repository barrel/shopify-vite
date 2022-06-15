import path from 'path'

export interface VitePluginShopifyOptions {
  entrypointsDir?: string
  themeRoot?: string
}

export interface ResolvedVitePluginShopifyOptions {
  entrypointsDir: string
  themeRoot: string
}

export const resolveOptions = (
  options: VitePluginShopifyOptions
): ResolvedVitePluginShopifyOptions => ({
  entrypointsDir: typeof options.entrypointsDir !== 'undefined' ? path.normalize(options.entrypointsDir) : 'frontend/entrypoints',
  themeRoot: typeof options.themeRoot !== 'undefined' ? path.normalize(options.themeRoot) : '.'
})
