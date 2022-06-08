export function withoutExtension (filename: string): string {
  const lastIndex = filename.lastIndexOf('.')
  return lastIndex > -1 ? filename.substr(0, lastIndex) : filename
}
