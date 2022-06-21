import path from 'path'

export interface VitePluginShopifyOptions {
  themeRoot?: string
  entrypointsDir?: string
  sourceCodeDir?: string
}

export interface ResolvedVitePluginShopifyOptions {
  themeRoot: string
  entrypointsDir: string
  sourceCodeDir: string
}

export const resolveOptions = (
  options: VitePluginShopifyOptions
): ResolvedVitePluginShopifyOptions => {
  const themeRoot = typeof options.themeRoot !== 'undefined' ? path.normalize(options.themeRoot) : ''
  const sourceCodeDir = typeof options.sourceCodeDir !== 'undefined' ? path.normalize(options.sourceCodeDir) : 'frontend'
  const entrypointsDir = typeof options.entrypointsDir !== 'undefined' ? path.normalize(options.entrypointsDir) : path.join(sourceCodeDir, 'entrypoints')

  return {
    themeRoot,
    sourceCodeDir,
    entrypointsDir
  }
}
