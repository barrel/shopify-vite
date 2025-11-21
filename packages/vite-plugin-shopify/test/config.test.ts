import { afterEach, describe, expect, it, vi } from 'vitest'
import { resolveOptions } from '../src/options'
import plugin from '../src/config'
import path from 'node:path'

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
    expect(config.build.rollupOptions.input).toEqual(['frontend/entrypoints/theme.js'])
    expect(config.build.manifest).toBe(true)
    expect(config.resolve.alias['~']).toMatch(path.resolve('frontend'))
    expect(config.resolve.alias['@']).toMatch(path.resolve('frontend'))
    expect(config.server.host).toBe('localhost')
    expect(config.server.https).toEqual(undefined)
    expect(config.server.port).toEqual(5173)
    expect(config.server.origin).toEqual('__shopify_vite_placeholder__')
    expect(config.server.hmr).toMatchObject({})
  })

  it('accepts a partial configuration', () => {
    const options = resolveOptions({ additionalEntrypoints: ['resources/js/*.js'] })
    const userConfig = plugin(options)
    const config = userConfig.config({
      server: {
        host: '0.0.0.0',
        port: 3000
      },
      publicDir: 'public'
    }, { command: 'serve', mode: 'development' })

    expect(config.server.host).toBe('0.0.0.0')
    expect(config.server.port).toEqual(3000)
    expect(config.publicDir).toEqual('public')
    expect(config.build.rollupOptions.input).toEqual(['frontend/entrypoints/theme.js', 'resources/js/foo.js'])
  })

  it('sets allowedHosts for dynamic tunnel', () => {
    const options = resolveOptions({ tunnel: true })
    const userConfig = plugin(options)
    const config = userConfig.config({}, { command: 'serve', mode: 'development' })

    expect(config.server.allowedHosts).toEqual(['.trycloudflare.com'])
  })

  it('sets allowedHosts for static tunnel URL', () => {
    const options = resolveOptions({ tunnel: 'https://my-tunnel.ngrok-free.app' })
    const userConfig = plugin(options)
    const config = userConfig.config({}, { command: 'serve', mode: 'development' })

    expect(config.server.allowedHosts).toEqual(['my-tunnel.ngrok-free.app'])
  })

  it('does not override user-defined allowedHosts', () => {
    const options = resolveOptions({ tunnel: true })
    const userConfig = plugin(options)

    const config = userConfig.config({
      server: {
        allowedHosts: ['my-custom-host.com']
      }
    }, { command: 'serve', mode: 'development' })

    expect(config.server.allowedHosts).toEqual(['my-custom-host.com'])
  })

  it('applies default CORS configuration when none is provided', () => {
    const options = resolveOptions({})
    const userConfig = plugin(options)
    const config = userConfig.config({}, { command: 'serve', mode: 'development' })
    const expectedCorsOrigin = [
      /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/,
      /\.myshopify\.com$/
    ]
    expect(config.server.cors.origin).toEqual(expectedCorsOrigin)
  })

  it('does not override user-defined CORS configuration (boolean)', () => {
    const options = resolveOptions({})
    const userConfig = plugin(options)
    const config = userConfig.config({
      server: {
        cors: false
      }
    }, { command: 'serve', mode: 'development' })
    expect(config.server.cors).toBe(false)
  })

  it('does not override user-defined CORS configuration (object)', () => {
    const options = resolveOptions({})
    const userConfig = plugin(options)
    const customCorsConfig = {
      origin: 'https://my-custom-origin.com'
    }
    const config = userConfig.config({
      server: {
        cors: customCorsConfig
      }
    }, { command: 'serve', mode: 'development' })
    expect(config.server.cors).toEqual(customCorsConfig)
  })
})

describe('resolveOptions', () => {
  it('handles a default configuration', () => {
    const options = resolveOptions({})

    expect(options.themeRoot).toBe('./')
    expect(options.sourceCodeDir).toBe('frontend')
    expect(options.entrypointsDir).toBe('frontend/entrypoints')
    expect(options.additionalEntrypoints).toEqual([])
    expect(options.snippetFile).toEqual('vite-tag.liquid')
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
        .mockReturnValueOnce(['frontend/entrypoints/theme.js'])
        // mock default entries + additional entries
        .mockReturnValueOnce(['frontend/entrypoints/theme.js', 'resources/js/foo.js'])
    }
  }
})
