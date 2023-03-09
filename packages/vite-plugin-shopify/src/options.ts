import path from 'node:path'
import { normalizePath } from 'vite'
import type { VitePluginShopifyOptions } from './types'

export const resolveOptions = (
  options: VitePluginShopifyOptions
): Required<VitePluginShopifyOptions> => {
  const themeRoot = options.themeRoot ?? './'
  const sourceCodeDir = options.sourceCodeDir ?? 'frontend'
  const entrypointsDir = options.entrypointsDir ?? normalizePath(path.join(sourceCodeDir, 'entrypoints'))
  const additionalEntrypoints = options.additionalEntrypoints ?? []
  const snippetFile = options.snippetFile ?? 'vite-tag.liquid'

  return {
    themeRoot,
    sourceCodeDir,
    entrypointsDir,
    additionalEntrypoints,
    snippetFile
  }
}
