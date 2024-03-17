import path from 'node:path'
import { normalizePath } from 'vite'
import type { Config } from './types'

export const resolveConfig = (
  options: Config
): Required<Config> => {
  const themeRoot = options.themeRoot ?? './'
  const snippetFile = options.snippetFile ?? 'critical-css.liquid'
  const baseUrl = options.baseUrl ?? ''
  const pages = options.pages ?? []
  const width = options.width ?? 1200
  const height = options.height ?? 1200
  const penthouse = options.penthouse ?? {}

  return {
    themeRoot,
    snippetFile,
    baseUrl,
    pages,
    width,
    height,
    penthouse
  }
}
