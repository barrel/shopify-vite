export const KNOWN_CSS_EXTENSIONS = [
  'css',
  'less',
  'sass',
  'scss',
  'styl',
  'stylus',
  'pcss',
  'postcss'
]

export const CSS_EXTENSIONS_REGEX = new RegExp(
  `\\.(${KNOWN_CSS_EXTENSIONS.join('|')})(\\?.+)?$`
)

// https://github.com/Shopify/cli/blob/ef425e97dd46cc27ca1f71a5fd8dc7b190c99047/packages/theme/src/cli/utilities/theme-environment/hot-reload/server.ts#L357-L358
export const hotReloadScriptId = 'hot-reload-client'
export const hotReloadScriptUrl = 'https://unpkg.com/@shopify/theme-hot-reload'
