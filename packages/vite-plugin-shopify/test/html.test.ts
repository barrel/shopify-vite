import { describe, it, expect } from 'vitest'
import path from 'node:path'
import fs from 'fs/promises'
import html from '../src/html'
import { resolveOptions } from '../src/options'
import { createServer, Plugin } from 'vite'

describe('vite-plugin-shopify:html', () => {
  it('builds out .liquid files for development', async () => {
    const options = resolveOptions({
      themeRoot: 'test/__fixtures__',
      sourceCodeDir: 'test/__fixtures__/frontend'
    })

    const { configureServer } = html(options)

    const viteServer = await (
      await createServer({
        logLevel: 'silent',
        configFile: path.join(__dirname, '__fixtures__', 'vite.config.js')
      })
    ).listen()

    configureServer(viteServer)

    viteServer.httpServer?.emit('listening')

    const tagsHtml = await fs.readFile(path.join(__dirname, '__fixtures__', 'snippets', 'vite-tag.liquid'), { encoding: 'utf8' })

    await viteServer.close()

    expect(tagsHtml).toMatchSnapshot()
  })

  it('builds out .liquid files for development with the react refresh script', async () => {
    const options = resolveOptions({
      themeRoot: 'test/__fixtures__',
      sourceCodeDir: 'test/__fixtures__/frontend'
    })

    const { configureServer } = html(options)

    // Fakes for the vite-plugin-react plugin
    const plugins: Plugin[] = [
      // https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/src/index.ts#L104
      {
        name: 'vite:react-babel'
      },
      // https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/src/index.ts#L269
      {
        name: 'vite:react-refresh'
      }
    ]

    const viteServer = await (
      await createServer({
        logLevel: 'silent',
        configFile: path.join(__dirname, '__fixtures__', 'vite.config.js'),
        plugins
      })
    ).listen()

    configureServer(viteServer)

    viteServer.httpServer?.emit('listening')

    const tagsHtml = await fs.readFile(path.join(__dirname, '__fixtures__', 'snippets', 'vite-tag.liquid'), { encoding: 'utf8' })

    await viteServer.close()

    expect(tagsHtml).toMatchSnapshot()
  })
})
