import { describe, it, expect } from 'vitest'
import path from 'path'
import fs from 'fs/promises'
import html from '../src/html'
import { resolveOptions } from '../src/options'

describe('vite-plugin-shopify:html', () => {
  it('builds out .liquid files for development', async () => {
    const options = resolveOptions({
      themeRoot: 'test/__fixtures__',
      sourceCodeDir: 'test/__fixtures__/frontend'
    })

    const { configureServer } = html(options)

    configureServer({
      config: {
        resolve: {
          alias: [
            {
              find: '~',
              replacement: path.posix.join(__dirname, '__fixtures__', 'frontend')
            },
            {
              find: '@',
              replacement: path.posix.join(__dirname, '__fixtures__', 'frontend')
            }
          ]
        }
      }
    })

    const tagsHtml = await fs.readFile(path.join(__dirname, '__fixtures__', 'snippets', 'vite-tag.liquid'), { encoding: 'utf8' })
    const clientHtml = await fs.readFile(path.join(__dirname, '__fixtures__', 'snippets', 'vite-client.liquid'), { encoding: 'utf8' })

    expect(tagsHtml).toMatchSnapshot()
    expect(clientHtml).toMatchSnapshot()
  })
})
