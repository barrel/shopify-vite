import path from 'path'

export interface VitePluginShopifyModulesOptions {
  modulesDir?: string
  themeRoot?: string
}

export interface ResolvedVitePluginShopifyModulesOptions {
  modulesDir: string
  themeRoot: string
}

export const resolveOptions = (
  options: VitePluginShopifyModulesOptions
): ResolvedVitePluginShopifyModulesOptions => ({
  modulesDir: typeof options.modulesDir !== 'undefined' ? path.normalize(options.modulesDir) : 'modules',
  themeRoot: typeof options.themeRoot !== 'undefined' ? path.normalize(options.themeRoot) : './'
})
