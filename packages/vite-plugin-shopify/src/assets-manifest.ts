// NOTE: Once https://github.com/vitejs/vite/pull/6649 has been released, we can remove this and use the built-in manifest option.
// Source: https://gist.github.com/SilverMira/206f7b352ed771ae5bb30de707284c42

/* eslint-disable */

import path from 'path'
import { normalizePath } from 'vite'

export default function AssetsManifestPlugin ({ manifestFile }) {
  manifestFile = manifestFile ?? 'manifest-assets.json'
  const manifest = {}
  let outputCount
  let config
  return {
    name: 'vite-assets-manifest-plugin',
    configResolved (resolvedConfig) {
      config = resolvedConfig
    },
    buildStart () {
      outputCount = 0
    },
    generateBundle ({ format }, bundle) {
      function getChunkName (chunk) {
        if (chunk.facadeModuleId) {
          let name = normalizePath(
            path.relative(config.root, chunk.facadeModuleId)
          )
          if (format === 'system' && !chunk.name.includes('-legacy')) {
            const ext = path.extname(name)
            name = name.slice(0, -ext.length) + '-legacy' + ext
          }
          return name.replace(/\0/g, '')
        } else {
          return '_' + path.basename(chunk.fileName)
        }
      }
      function getInternalImports (imports) {
        const filteredImports = []
        for (const file of imports) {
          if (bundle[file] === undefined) {
            continue
          }
          filteredImports.push(getChunkName(bundle[file]))
        }
        return filteredImports
      }
      function createChunk (chunk) {
        const manifestChunk = {
          file: chunk.fileName
        }
        if (chunk.facadeModuleId) {
          manifestChunk.src = getChunkName(chunk)
        }
        if (chunk.isEntry) {
          manifestChunk.isEntry = true
        }
        if (chunk.isDynamicEntry) {
          manifestChunk.isDynamicEntry = true
        }
        if (chunk.imports.length) {
          const internalImports = getInternalImports(chunk.imports)
          if (internalImports.length > 0) {
            manifestChunk.imports = internalImports
          }
        }
        if (chunk.dynamicImports.length) {
          const internalImports = getInternalImports(chunk.dynamicImports)
          if (internalImports.length > 0) {
            manifestChunk.dynamicImports = internalImports
          }
        }
        // @ts-expect-error
        if (chunk.viteMetadata.importedCss.size) {
          // @ts-expect-error
          manifestChunk.css = [...chunk.viteMetadata.importedCss]
        }
        // @ts-expect-error
        if (chunk.viteMetadata.importedAssets.size) {
          // @ts-expect-error
          manifestChunk.assets = [...chunk.viteMetadata.importedAssets]
        }
        return manifestChunk
      }
      for (const file in bundle) {
        const chunk = bundle[file]
        if (chunk.type === 'chunk') {
          manifest[getChunkName(chunk)] = createChunk(chunk)
        }
      }
      outputCount++
      const output = config.build.rollupOptions?.output
      const outputLength = Array.isArray(output) ? output.length : 1
      if (outputCount >= outputLength) {
        this.emitFile({
          fileName: manifestFile,
          type: 'asset',
          source: JSON.stringify(manifest, null, 2)
        })
      }
    }
  }
}
