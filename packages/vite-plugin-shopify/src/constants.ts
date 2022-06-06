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
