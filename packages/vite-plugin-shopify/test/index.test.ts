import { describe, expect, it, vi } from 'vitest'
import path from 'node:path'
import { build, normalizePath } from 'vite'
import shopify from '../src'
import fs from 'node:fs/promises'

describe('vite-plugin-shopify', () => {
  it('builds out .liquid files for production', async () => {
    await build({
      logLevel: 'silent',
      plugins: [
        shopify({
          themeRoot: path.join(__dirname, '__fixtures__'),
          sourceCodeDir: path.join(__dirname, '__fixtures__', 'frontend'),
          additionalEntrypoints: [
            normalizePath(path.join(__dirname, '__fixtures__', 'resources', 'js', 'foo.js'))
          ],
          snippetFile: 'vite-tag.liquid'
        })
      ],
      resolve: {
        alias: {
          '@@': normalizePath(path.resolve(path.join(__dirname, '__fixtures__', 'resources', 'js')))
        }
      }
    })

    const tagsHtml = await fs.readFile(path.join(__dirname, '__fixtures__', 'snippets', 'vite-tag.liquid'), { encoding: 'utf8' })

    expect(tagsHtml).toMatchSnapshot()
  })
})

vi.mock('fast-glob', () => {
  return {
    default: {
      sync: vi.fn()
        // mock entries
        .mockReturnValueOnce([
          path.join(__dirname, '__fixtures__', 'resources', 'js', 'foo.js'),
          path.join(__dirname, '__fixtures__', 'frontend', 'entrypoints', 'theme.css'),
          path.join(__dirname, '__fixtures__', 'frontend', 'entrypoints', 'theme.ts')
        ])
    }
  }
})
