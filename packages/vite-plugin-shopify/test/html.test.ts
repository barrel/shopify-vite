import { describe, it, expect, vi } from 'vitest'
import http from 'node:http'
import path from 'node:path'
import fs from 'fs/promises'
import html from '../src/html'
import { resolveOptions } from '../src/options'
import { createServer, Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import startTunnel from '@shopify/plugin-cloudflare/hooks/tunnel'
import { ok } from '@shopify/cli-kit/node/result'

vi.mock('@shopify/plugin-cloudflare/hooks/tunnel')

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

    // Fakes for the @vitejs/plugin-react plugin
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

  it('builds out .liquid files for development with a cloudflare tunnel url', async () => {
    const mockHttpServer = {
      once: vi.fn((_, callback) => {
        callback()
      }),
      on: vi.fn((_, callback) => {
        callback()
      }),
      address: vi.fn().mockReturnValue({ port: 5173 })
    } as unknown as http.Server

    const mockConfig: Partial<ResolvedConfig> = {
      server: {} as any,
      plugins: [],
      resolve: {
        alias: [
          {
            find: '@',
            replacement: 'test/__fixtures__/frontend'
          }
        ]
      } as any,
      logger: {
        info: vi.fn()
      } as any
    }

    const mockViteDevServer = vi.mocked<ViteDevServer>({
      httpServer: mockHttpServer,
      config: mockConfig
    } as ViteDevServer)

    const mockResult = {
      status: 'connected',
      url: 'https://example.trycloudflare.com'
    }

    const mockTunnelClient = {
      getTunnelStatus: vi.fn().mockReturnValue(mockResult),
      stopTunnel: vi.fn(),
      provider: 'cloudflare',
      port: 5173
    }

    vi.mocked(startTunnel).mockResolvedValue(
      ok(mockTunnelClient)
    )

    const options = resolveOptions({
      themeRoot: 'test/__fixtures__',
      sourceCodeDir: 'test/__fixtures__/frontend',
      tunnel: true
    })

    vi.useFakeTimers()

    const { configureServer } = html(options)

    if (typeof configureServer === 'function') void configureServer(mockViteDevServer)

    vi.advanceTimersByTime(100)

    const tagsHtml = await fs.readFile(path.join(__dirname, '__fixtures__', 'snippets', 'vite-tag.liquid'), { encoding: 'utf8' })

    expect(tagsHtml).toMatchSnapshot()

    vi.useRealTimers()
  })
})
