export interface VitePluginShopifyModulesOptions {
  modulesDir?: string
  themeRoot?: string
}

export const resolveOptions = (
  options: VitePluginShopifyModulesOptions
): Required<VitePluginShopifyModulesOptions> => ({
  modulesDir: options.modulesDir ?? 'modules',
  themeRoot: options.themeRoot ?? './'
})
