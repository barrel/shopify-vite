import path from 'node:path'
import { normalizePath } from 'vite'

export interface VitePluginShopifyOptions {
  themeRoot?: string
  entrypointsDir?: string
  additionalEntrypoints?: string[]
  sourceCodeDir?: string
}

export const resolveOptions = (
  options: VitePluginShopifyOptions
): Required<VitePluginShopifyOptions> => {
  const themeRoot = options.themeRoot ?? './'
  const sourceCodeDir = options.sourceCodeDir ?? 'frontend'
  const entrypointsDir = options.entrypointsDir ?? normalizePath(path.join(sourceCodeDir, 'entrypoints'))
  const additionalEntrypoints = options.additionalEntrypoints ?? []

  return {
    themeRoot,
    sourceCodeDir,
    entrypointsDir,
    additionalEntrypoints
  }
}
