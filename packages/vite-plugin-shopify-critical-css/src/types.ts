export type Page = {
  /** URI of the page */
  uri: string,
  /** Template of the page */
  template: string
}

export type Config = {
  /**
   * Root path to your Shopify theme directory.
   *
   * @default './'
   */
  themeRoot?: string,
  /**
   * Specifies the file name of the snippet that loads your assets.
   *
   * @default 'critical-css.liquid'
   */
  snippetFile?: string
  /** Base Shopify store url */
  baseUrl?: string,
  /** Pages url with template name for generating critical css */
  pages?: Page[],
  /**
   * Width of the target viewport
   * 
   * @default: 1200
   * */
  width?: number,
  /**
   * Height of the target viewport
   * @default: 1200
   * */
  height?: number,
  /** Configuration option for penthouse */
  penthouse?: Partial<PenthouseConfig>
}