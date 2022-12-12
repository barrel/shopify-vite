import path from 'path'

import { getPackage } from './package'

export interface VitePluginShopifyThemeSettingsOptions {
  schemaSourceDir?: string
  themeRoot?: string
  values?: {
    [key: string]: string
  }
}

export interface ResolvedVitePluginShopifyThemeSettingsOptions {
  schemaSourceDir: string
  themeRoot: string
  values: {
    [key: string]: string
  }
}

export const resolveOptions = (
  options: VitePluginShopifyThemeSettingsOptions
): ResolvedVitePluginShopifyThemeSettingsOptions => {
  // Load values from package.json
  const pkg = getPackage()
  // Get initial replacement values from user-provided options
  const values = typeof options.values !== 'undefined' ? options.values : {}

  // Fill in theme_info replacement values with package.json values if not specified in plugin options
  if (typeof values.theme_name !== 'string') {
    values.theme_name = pkg.name
  }
  if (typeof values.theme_version !== 'string') {
    values.theme_version = pkg.version
  }
  if (typeof values.theme_author !== 'string' && typeof pkg.author === 'string') {
    values.theme_author = pkg.author
  }

  return {
    schemaSourceDir: typeof options.schemaSourceDir !== 'undefined' ? path.normalize(options.schemaSourceDir) : 'config/src',
    themeRoot: typeof options.themeRoot !== 'undefined' ? path.normalize(options.themeRoot) : './',
    values
  }
}
