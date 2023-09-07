import { Plugin, ViteDevServer } from 'vite'
import colors from 'picocolors'
import path from 'node:path'
import picomatch from 'picomatch'

// https://github.com/vitejs/vite/blob/03b323d39cafe2baabef74e6051a9640add82590/packages/vite/src/node/server/hmr.ts
function getShortName (file: string, root: string): string {
  return file.startsWith(root + '/') ? path.posix.relative(root, file) : file
}

const debounce = <T extends (...args: any[]) => void>(callback: T, time: number): (...args: Parameters<T>) => void => {
  let timer: ReturnType<typeof setTimeout> | null
  return (...args: Parameters<T>) => {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      callback.apply(null, args)
    }, time)
  }
}

/** Plugin configuration */
export interface Config {
  /**
   * Whether the page should be reloaded regardless of which file is modified.
   * @default false
   */
  always?: boolean

  /**
   * How many milliseconds to wait before reloading the page after a file change.
   * @default 25
   */
  delay?: number

  /**
   * Whether to log when a file change triggered a page reload
   * @default true
   */
  log?: boolean

  /**
    * File paths will be resolved against this directory.
    *
    * @default process.cwd()
    * @internal
    */
  root?: string
}

/**
 * Allows to automatically reload the page when a watched file changes.
 */
const pageReload = (
  paths: string | string[],
  config: Config = {}
): Plugin => ({
  name: 'vite-plugin-page-reload',

  apply: 'serve',

  // NOTE: When on, treat strings in .watch() and .add() as literal paths, even if they resemble globs.
  config: () => ({ server: { watch: { disableGlobbing: false } } }),

  configureServer ({ watcher, ws, config: { root: rootDir, logger } }: ViteDevServer) {
    const { root = rootDir, log = true, delay = 25, always = false } = config

    const shouldReload = picomatch(paths)

    const reload = (path: string): void => {
      if (!shouldReload(path)) return
      ws.send({ type: 'full-reload', path: always ? '*' : path })
      if (log) {
        logger.info(
          colors.green(`page reload ${colors.dim(getShortName(path, root))}`),
          { clear: true, timestamp: true }
        )
      }
    }

    const debouncedReload = debounce(reload, delay)

    // Ensure Vite keeps track of the files and triggers HMR as needed.
    watcher.add(paths)

    // Do a full page reload if any of the watched files changes.
    watcher.on('add', debouncedReload)
    watcher.on('change', debouncedReload)
  }
})

export default pageReload
