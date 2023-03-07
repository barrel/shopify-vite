export interface VitePluginShopifyOptions {
  themeRoot?: string
  entrypointsDir?: string
  additionalEntrypoints?: string[]
  sourceCodeDir?: string
}

export type DevServerUrl = `${'http' | 'https'}://${string}:${number}`
