import { afterEach, describe, expect, it, vi } from 'vitest'
import { resolveOptions } from '../src/options'
import plugin from '../src/config'
import path from 'path'

describe('vite-plugin-shopify:config', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('handles a default configuration', () => {
    const options = resolveOptions({})
    const userConfig = plugin(options)
    const config = userConfig.config({}, { command: 'serve', mode: 'development' })

    expect(config.base).toBe('./')
    expect(config.publicDir).toEqual(false)
    expect(config.build.outDir).toBe('assets')
    expect(config.build.assetsDir).toBe('')
    expect(config.build.rollupOptions.input).toEqual(['frontend/entrypoints/app.js'])
    expect(config.build.manifest).toBe(true)
    expect(config.resolve.alias['~']).toMatch(path.resolve('frontend'))
    expect(config.resolve.alias['@']).toMatch(path.resolve('frontend'))
    expect(config.server.host).toBe('localhost')
    expect(config.server.https).toEqual(false)
    expect(config.server.port).toEqual(5173)
    expect(config.server.origin).toEqual('__shopify_vite_placeholder__')
    expect(config.server.strictPort).toEqual(true)
    expect(config.server.hmr.host).toEqual('localhost')
    expect(config.server.hmr.port).toEqual(5173)
    expect(config.server.hmr.protocol).toEqual('ws')
  })

  it('accepts a partial configuration', () => {
    const options = resolveOptions({ additionalEntrypoints: ['resources/js/*.js'] })
    const userConfig = plugin(options)
    const config = userConfig.config({
      server: {
        port: 3000
      },
      build: {
        sourcemap: true
      }
    }, { command: 'serve', mode: 'development' })

    expect(config.server.port).toEqual(3000)
    expect(config.build.sourcemap).toBe(true)
    expect(config.build.rollupOptions.input).toEqual(['frontend/entrypoints/app.js', 'resources/js/app.js'])
  })
})

describe('resolveOptions', () => {
  it('handles a default configuration', () => {
    const options = resolveOptions({})

    expect(options.themeRoot).toBe('./')
    expect(options.sourceCodeDir).toBe('frontend')
    expect(options.entrypointsDir).toBe('frontend/entrypoints')
    expect(options.additionalEntrypoints).toEqual([])
  })

  it('accepts a partial configuration', () => {
    const options = resolveOptions({
      themeRoot: 'shopify',
      sourceCodeDir: 'src'
    })

    expect(options.themeRoot).toBe('shopify')
    expect(options.sourceCodeDir).toBe('src')
    expect(options.entrypointsDir).toBe('src/entrypoints')
  })
})

vi.mock('fast-glob', () => {
  return {
    default: {
      sync: vi.fn()
        // mock default entries
        .mockReturnValueOnce(['frontend/entrypoints/app.js'])
        // mock default entries + additional entries
        .mockReturnValueOnce(['frontend/entrypoints/app.js'])
        .mockReturnValueOnce(['resources/js/app.js'])
    }
  }
})
