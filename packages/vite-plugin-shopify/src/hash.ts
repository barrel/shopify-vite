import { Plugin } from 'vite'

/**
 * Temporary workaround for https://github.com/barrel/barrel-shopify/issues/25
 *
 */
export default function updateChunkHash (): Plugin {
  return {
    name: 'update-chunk-hash',
    apply: 'build',
    augmentChunkHash (chunkInfo) {
      if (chunkInfo.isEntry && Object.keys(chunkInfo.modules).length > 0) {
        // modify the hash by passing this value to hash.update
        return Date.now().toString()
      }
    }
  }
}
