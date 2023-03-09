export interface VitePluginShopifyOptions {
  themeRoot?: string
  entrypointsDir?: string
  additionalEntrypoints?: string[]
  sourceCodeDir?: string
  snippetFile?: LiquidFile
}

export type DevServerUrl = `${'http' | 'https'}://${string}:${number}`

export type LiquidFile = `${string}.liquid`
