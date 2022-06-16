import path from 'path'

export interface VitePluginShopifyModulesOptions {
  modulesDir?: string
}

export interface ResolvedVitePluginShopifyModulesOptions {
  modulesDir: string
}

export const resolveOptions = (
  options: VitePluginShopifyModulesOptions
): ResolvedVitePluginShopifyModulesOptions => ({
  modulesDir: typeof options.modulesDir !== 'undefined' ? path.normalize(options.modulesDir) : 'modules'
})
