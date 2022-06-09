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

export const KNOWN_ENTRYPOINT_TYPES = [
  'html',
  'jsx?',
  'tsx?',
  ...KNOWN_CSS_EXTENSIONS
]

export const ENTRYPOINT_TYPES_REGEX = new RegExp(
  `\\.(${KNOWN_ENTRYPOINT_TYPES.join('|')})(\\?.*)?$`
)

export const CSS_EXTENSIONS_REGEX = new RegExp(
  `\\.(${KNOWN_CSS_EXTENSIONS.join('|')})$`
)

export const CLIENT_SCRIPT_PATH = '@vite/client'

export const VITE_ASSET_RE = /^export default ["'](__VITE_ASSET.*)["']$/

export const publicAssetsURL = 'const publicAssetsURL = window.themeAssetsBaseUrl;'

export const buildAssetsURL = 'function buildAssetsURL(id) { return publicAssetsURL + id; }'
