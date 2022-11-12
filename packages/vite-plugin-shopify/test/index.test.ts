import { describe, expect, it } from 'vitest'
import path from 'path'
import { build, normalizePath } from 'vite'
import shopify from '../src'
import fs from 'fs/promises'

describe('vite-plugin-shopify', () => {
  it('configures Vite', () => {
    const plugin = shopify({
      themeRoot: path.join(__dirname, '__fixtures__'),
      sourceCodeDir: path.join(__dirname, '__fixtures__', 'frontend')
    })[0]

    const config = plugin.config({}, { command: 'build', mode: 'production' })

    expect(config.base).toEqual('./')
    expect(config.publicDir).toEqual(false)
    expect(config.build.outDir).toEqual(path.join(__dirname, '__fixtures__', 'assets'))
    expect(config.build.assetsDir).toEqual('')
    expect(config.build.manifest).toEqual(true)
    expect(config.build.rollupOptions.input).toEqual([
      normalizePath(path.resolve(path.join(__dirname, '__fixtures__', 'frontend', 'entrypoints', 'theme.css'))),
      normalizePath(path.resolve(path.join(__dirname, '__fixtures__', 'frontend', 'entrypoints', 'theme.ts')))
    ])
  })

  it('builds out .liquid files', async () => {
    await build({
      logLevel: 'silent',
      plugins: [shopify({
        themeRoot: path.join(__dirname, '__fixtures__'),
        sourceCodeDir: path.join(__dirname, '__fixtures__', 'frontend')
      })]
    })

    const tagsHtml = await fs.readFile(path.join(__dirname, '__fixtures__', 'snippets', 'vite-tag.liquid'), { encoding: 'utf8' })
    const clientHtml = await fs.readFile(path.join(__dirname, '__fixtures__', 'snippets', 'vite-client.liquid'), { encoding: 'utf8' })

    expect(tagsHtml).toMatchSnapshot()
    expect(clientHtml).toMatchSnapshot()
  })
})
