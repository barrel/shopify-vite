import path from 'node:path'
import { normalizePath } from 'vite'
import type { Options } from './types'

export const resolveOptions = (
  options: Options
): Required<Options> => {
  const themeRoot = options.themeRoot ?? './'
  const sourceCodeDir = options.sourceCodeDir ?? 'frontend'
  const entrypointsDir = options.entrypointsDir ?? normalizePath(path.join(sourceCodeDir, 'entrypoints'))
  const additionalEntrypoints = options.additionalEntrypoints ?? []
  const snippetFile = options.snippetFile ?? 'vite-tag.liquid'
  const versionNumbers = options.versionNumbers ?? false

  return {
    themeRoot,
    sourceCodeDir,
    entrypointsDir,
    additionalEntrypoints,
    snippetFile,
    versionNumbers
  }
}
