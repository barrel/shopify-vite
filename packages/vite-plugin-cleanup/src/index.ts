import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import path from 'node:path'
import { Plugin, UserConfig, Manifest, ResolvedConfig, normalizePath } from 'vite'
import glob from 'fast-glob'

const getFilesInManifest = (manifest: Manifest): string[] => {
  if (!manifest) {
    return []
  }

  const filesListedInImports = new Set(
    Object.values(manifest).flatMap((block) => "imports" in block ? block.imports : [])
  )

  return Object.entries(manifest).flatMap(([key, block]) => {
    let file = ''

    if (key.startsWith('-') && filesListedInImports.has(key)) {
      file = block.file
    } else if (!key.startsWith('-')) {
      file = block.file
    }

    if (file) {
      const mapFile = `${file}.map`

      if (fs.existsSync(mapFile)) {
        return [file, mapFile]
      }

      return [file]
    }

    return []
  })
}

const shouldCleanUpSourceMaps = (resolvedConfig: ResolvedConfig, config: Config): boolean => {
  const { cleanUpSourceMaps = 'auto' } = config

  return cleanUpSourceMaps === 'auto' ? resolvedConfig.build.sourcemap === true : cleanUpSourceMaps
}

const unlinkIgnoreError = async (filePath: string): Promise<void> => {
  try {
    await fsPromises.unlink(filePath)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error
    }
  }
}

const cleanUpFiles = async (outDir: string, manifest: Manifest, cleanUpSourceMaps: boolean): Promise<void> => {
  const filesInManifest: string[] = getFilesInManifest(manifest)
  const sourceMapFiles: string[] = cleanUpSourceMaps ? glob.sync(path.join(outDir, '*.js.map')) : []

  const filesToCleanup = [
    ...filesInManifest.map(file => path.join(outDir, file)),
    ...sourceMapFiles
  ].map(normalizePath)

  await Promise.all(filesToCleanup.map(file => unlinkIgnoreError(file)))
}

export interface Config {
  /**
   * Whether the source map files should be cleaned up
   * @default 'auto'
   */
  cleanUpSourceMaps?: 'auto' | boolean
}

const cleanup = (config: Config = {}): Plugin => {
  let viteConfig: ResolvedConfig
  let buildStartFirstRun = true

  return {
    name: 'vite-plugin-cleanup',
    config(): UserConfig {
      // Enable manifest generation
      return {
        build: {
          manifest: true
        }
      }
    },
    configResolved(resolvedConfig: ResolvedConfig): void {
      viteConfig = resolvedConfig
    },
    buildStart: async () => {
      if (!viteConfig || process.env.NODE_ENV === 'development' || !process.env.VITE_WATCH || !buildStartFirstRun) {
        return
      }

      buildStartFirstRun = false
      const outDir = viteConfig.build.outDir
      const manifestFile = normalizePath(path.join(outDir, 'manifest.json'))

      if (!fs.existsSync(manifestFile)) {
        return
      }

      const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'))

      await cleanUpFiles(outDir, manifest, shouldCleanUpSourceMaps(viteConfig, config))
    },
  }
}

export default cleanup