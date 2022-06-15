import { promises as fs, existsSync } from 'fs'
import path from 'path'
import type { Plugin, ResolvedConfig } from 'vite'
// import createDebugger from 'debug'
import { throttle } from 'lodash'
import chokidar from 'chokidar'

import { VitePluginShopifyModulesOptions, resolveOptions } from './options'

// const debug = createDebugger('vite-plugin-shopify:modules')

export default function shopifyModules (options: VitePluginShopifyModulesOptions): Plugin {
  const resolvedOptions = resolveOptions(options)
  let _config: ResolvedConfig

  return {
    name: 'vite-plugin-shopify-modules',
    enforce: 'post',
    configResolved (config) {
      _config = config
    },
    buildStart: () => {
      const linkModulesCallback = throttle(() => {
        linkModules({ rootPath: process.cwd(), modulesDir: resolvedOptions.modulesDir })
      }, 500, { leading: true, trailing: false })

      linkModulesCallback()

      if (_config.command === 'serve') {
        // Watch for relevant file or directory changes to re-run script
        chokidar.watch([resolvedOptions.modulesDir, '(sections|snippets)/*.liquid'], {
          ignoreInitial: true,
          followSymlinks: false
        }).on('all', linkModulesCallback)
      }
    }
  }
}

// Check for module folders with corresponding liquid files and set up symlinks as needed
const linkModules = ({ modulesDir, rootPath }: { modulesDir: string, rootPath: string }): void => {
  const sectionsDir = path.resolve(rootPath, './sections')
  const snippetsDir = path.resolve(rootPath, './snippets')

  if (existsSync(modulesDir)) {
    fs.readdir(modulesDir)
      .then(
        async (modules: string[]) => await Promise.all(modules.flatMap((module) => [
          setupSectionSymlink(module, { modulesDir, sectionsDir }),
          setupSnippetSymlink(module, { modulesDir, snippetsDir })
        ])),
        (err) => { throw err }
      )
  }
}

// Set up symlink for module's liquid section file
const setupSectionSymlink = async (moduleName: string, pathConfig: { modulesDir: string, sectionsDir: string }): Promise<void> => {
  const moduleSectionPath = path.join(pathConfig.modulesDir, `${moduleName}/${moduleName}.section.liquid`)
  const themeSectionPath = path.join(pathConfig.sectionsDir, `${moduleName}.liquid`)

  return await setupSymlink(moduleSectionPath, themeSectionPath)
}

// Set up symlink for module's liquid snippet file
const setupSnippetSymlink = async (moduleName: string, pathConfig: { modulesDir: string, snippetsDir: string }): Promise<void> => {
  const moduleSnippetPath = path.join(pathConfig.modulesDir, `${moduleName}/${moduleName}.snippet.liquid`)
  const themeSnippetPath = path.join(pathConfig.snippetsDir, `${moduleName}.liquid`)

  return await setupSymlink(moduleSnippetPath, themeSnippetPath)
}

// Move liquid file from module path to theme path and generate symbolic link
const setupSymlink = async (modulePath: string, themePath: string): Promise<void> => {
  let modulePathStats

  try {
    modulePathStats = await fs.lstat(modulePath)
  } catch (e) {
    //
  }

  if (typeof modulePathStats === 'undefined') {
    if (existsSync(themePath)) {
      // If theme file exists but hasn't been linked, create symlink
      await fs.symlink(path.relative(path.dirname(modulePath), themePath), modulePath)
    }

    // If no existing file at module path, skip
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

  if (existsSync(themePath)) {
    // If theme path file already exists, log warning and skip
    console.warn(`WARNING: Conflicting liquid files found at ${modulePath} and ${themePath}.`)
    return
  }

  // Move liquid file to theme folder
  await fs.rename(modulePath, themePath)

  // Generate symlink from module path to theme path
  await fs.symlink(path.relative(path.dirname(modulePath), themePath), modulePath)
}
