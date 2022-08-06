import path from 'path'

export interface VitePluginShopifyOptions {
  themeRoot?: string
  entrypointsDir?: string
  additionalEntrypoints?: string[]
  sourceCodeDir?: string
}

export interface ResolvedVitePluginShopifyOptions {
  themeRoot: string
  entrypointsDir: string
  additionalEntrypoints: string[]
  sourceCodeDir: string
}

export const resolveOptions = (
  options: VitePluginShopifyOptions
): ResolvedVitePluginShopifyOptions => {
  const themeRoot = options.themeRoot !== undefined
    ? path.resolve(options.themeRoot)
    : process.cwd()
  // relative to themeRoot
  const sourceCodeDir = options.sourceCodeDir !== undefined
    ? path.join(themeRoot, options.sourceCodeDir)
    : path.join(themeRoot, 'frontend')
  // relative to sourceCodeDir
  const entrypointsDir = options.entrypointsDir !== undefined
    ? path.join(sourceCodeDir, options.entrypointsDir)
    : path.join(sourceCodeDir, 'entrypoints')
  const additionalEntrypoints = options.additionalEntrypoints ?? []

  return {
    themeRoot,
    sourceCodeDir,
    entrypointsDir,
    additionalEntrypoints
  }
}
