import { describe, expect, it } from 'vitest'
import path from 'path'
import { build } from 'vite'
import shopify from '../src'
import fs from 'fs/promises'

describe('vite-plugin-shopify', () => {
  it('builds out .liquid files for production', async () => {
    await build({
      logLevel: 'silent',
      plugins: [
        shopify({
          themeRoot: path.join(__dirname, '__fixtures__'),
          sourceCodeDir: path.join(__dirname, '__fixtures__', 'frontend')
        })
      ]
    })

    const tagsHtml = await fs.readFile(path.join(__dirname, '__fixtures__', 'snippets', 'vite-tag.liquid'), { encoding: 'utf8' })

    expect(tagsHtml).toMatchSnapshot()
  })
})
