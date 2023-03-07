import { describe, it, expect } from 'vitest'
import path from 'path'
import fs from 'fs/promises'
import html from '../src/html'
import { resolveOptions } from '../src/options'
import { createServer } from 'vite'

describe('vite-plugin-shopify:html', () => {
  it('builds out .liquid files for development', async () => {
    const options = resolveOptions({
      themeRoot: 'test/__fixtures__',
      sourceCodeDir: 'test/__fixtures__/frontend'
    })

    const { configureServer } = html(options)

    const viteServer = await (
      await createServer({
        logLevel: 'silent'
      })
    ).listen()

    configureServer(viteServer)

    const tagsHtml = await fs.readFile(path.join(__dirname, '__fixtures__', 'snippets', 'vite-tag.liquid'), { encoding: 'utf8' })

    await viteServer.close()

    expect(tagsHtml).toMatchSnapshot()
  })
})
