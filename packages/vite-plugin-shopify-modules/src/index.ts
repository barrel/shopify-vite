import { promises as fs, existsSync } from 'fs'
import path from 'path'
import { Plugin, ResolvedConfig } from 'vite'
import chokidar from 'chokidar'
import glob from 'fast-glob'
import createDebugger from 'debug'

import { VitePluginShopifyModulesOptions, ResolvedVitePluginShopifyModulesOptions, resolveOptions } from './options'

const debug = createDebugger('vite-plugin-shopify:modules')

export default function shopifyModules (options: VitePluginShopifyModulesOptions = {}): Plugin {
  const resolvedOptions = resolveOptions(options)
  let _config: ResolvedConfig

  return {
    name: 'vite-plugin-shopify-modules',
    enforce: 'post',
    config () {
      return {
        resolve: {
          alias: {
            '@modules': path.resolve(resolvedOptions.modulesDir),
            '~modules': path.resolve(resolvedOptions.modulesDir)
          }
        }
      }
    },
    configResolved (config) {
      _config = config
    },
    resolveId: async (id) => {
      // Check if path is within modules directory
      if (!path.relative(path.resolve(resolvedOptions.modulesDir), id).includes('..')) {
        try {
          const fileStat = await fs.stat(id)

          // Check if path refers to folder instead of file
          if (fileStat.isDirectory()) {
            // Check if module script file exists matching folder name
            const results = await glob(`${id}/${path.basename(id)}.{js,jsx,ts,tsx}`, { onlyFiles: true })

            // Resolve to actual file path instead of module shorthand
            if (results.length > 0) {
              return results[0]
            }

            // No file matches the folder name
            return null
          }
        } catch (e) {
          // The dirctory does not exist
          return null
        }
      }
      return null
    },
    buildStart: async () => {
      const modulePaths = await glob(`${resolvedOptions.modulesDir}/**/*.{section,snippet}.liquid`)

      // Link modules on build start
      await Promise.all(modulePaths.map(async (modulePath) => {
        return await linkModule(modulePath, resolvedOptions)
      }))

      if (_config.command === 'serve') {
        // Watch for relevant file or directory changes to re-run script
        chokidar.watch([resolvedOptions.modulesDir, '(sections|snippets)/*.liquid'], {
          ignoreInitial: true,
          followSymlinks: false
        }).on('all', (event, path) => debug({ path }))
      }
    }
  }
}

// Check for module folders with corresponding liquid files and set up symlinks as needed
const linkModule = async (modulePath: string, { modulesDir, themeRoot }: ResolvedVitePluginShopifyModulesOptions): Promise<void> => {
  const themeFilePath = getThemeFilePath(modulePath, { modulesDir, themeRoot })
  return await setupSymlink(modulePath, themeFilePath)
}

const getThemeFilePath = (modulePath: string, { modulesDir, themeRoot }: ResolvedVitePluginShopifyModulesOptions): string => {
  const rootPath = path.resolve(themeRoot)
  const sectionsDir = path.resolve(rootPath, './sections')
  const snippetsDir = path.resolve(rootPath, './snippets')
  const fileName = path.basename(modulePath)

  if (fileName.includes('.section.liquid')) {
    const moduleName = fileName.replace(/\.section/, '')
    return path.join(sectionsDir, `${moduleName}`)
  }

  const moduleName = fileName.replace(/\.snippet/, '')
  return path.join(snippetsDir, `${moduleName}`)
}

// Move liquid file from module path to theme path and generate symbolic link
const setupSymlink = async (modulePath: string, themePath: string): Promise<void> => {
  let modulePathStats

  debug({ modulePath, themePath })

  try {
    modulePathStats = await fs.lstat(modulePath)
  } catch (e) {
    //
  }

  if (typeof modulePathStats === 'undefined') {
    // If no existing file at module path, skip
    return
  }

  if (existsSync(themePath)) {
    if (!modulePathStats.isSymbolicLink()) {
      // If theme file exists but hasn't been linked, create symlink
      await fs.unlink(modulePath)
      await fs.symlink(path.relative(path.dirname(modulePath), themePath), modulePath)
    }

    // If theme path file already exists, skip
    return
  }

  if (modulePathStats.isSymbolicLink()) {
    if (!existsSync(themePath)) {
      // If symlink exists without target file, delete it
      await fs.unlink(modulePath)
    }

    // If module path file is already a symlink, skip
    return
  }

  // Move liquid file to theme folder
  await fs.rename(modulePath, themePath)

  // Generate symlink from module path to theme path
  await fs.symlink(path.relative(path.dirname(modulePath), themePath), modulePath)
}
