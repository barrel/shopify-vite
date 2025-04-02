export interface Options {
  /**
   * Root path to your Shopify theme directory.
   *
   * @default './'
   */
  themeRoot?: string

  /**
   * Front-end entry points directory.
   *
   * @default 'frontend/entrypoints'
   */
  entrypointsDir?: string

  /**
   * Additional files to use as entry points (accepts an array of file paths or glob patterns).
   *
   * @default []
   */
  additionalEntrypoints?: string[]

  /**
   * Front-end source code directory.
   *
   * @default 'frontend'
   */
  sourceCodeDir?: string

  /**
   * Specifies the file name of the snippet that loads your assets.
   *
   * @default 'vite-tag.liquid'
   */
  snippetFile?: string

  /**
   * Specifies whether to append version numbers to your production-ready asset URLs in {@link snippetFile}.
   *
   * @default false
   */
  versionNumbers?: boolean

  /**
   * Enables the creation of Cloudflare tunnels during dev, allowing previews from any device.
   *
   * @default false
   */
  tunnel?: boolean | string

  /**
   * Specifies whether to use the {@link https://www.npmjs.com/package/@shopify/theme-hot-reload @shopify/theme-hot-reload} script to enable hot reloading.
   */
  themeHotReload?: boolean
}

export type DevServerUrl = `${'http' | 'https'}://${string}:${number}`

export interface FrontendURLResult {
  frontendUrl: string
  frontendPort: number
  usingLocalhost: boolean
}
