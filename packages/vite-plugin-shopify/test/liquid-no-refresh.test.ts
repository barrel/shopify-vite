import { describe, it, expect, vi } from 'vitest'
import { ModuleNode, HmrContext, ViteDevServer } from 'vite'
import shopifyLiquidNoRefresh from '../src/liquid-no-refresh'

describe('vite-plugin-shopify:liquid-no-refresh', () => {
  it('filters out liquid module from hot update with CSS module importers', () => {
    const plugin = shopifyLiquidNoRefresh()

    // Create mock CSS module that imports the liquid file
    const cssModule = {
      id: '/path/to/style.module.css',
      file: '/path/to/style.module.css',
      importers: new Set()
    } as ModuleNode

    // Create mock liquid module
    const liquidModule = {
      id: '/path/to/template.liquid',
      file: '/path/to/template.liquid',
      importers: new Set([cssModule])
    } as ModuleNode

    // Mock context for handleHotUpdate
    const mockServer = {
      config: {},
      pluginContainer: {},
      moduleGraph: {
        getModulesByFile: () => []
      }
    } as unknown as ViteDevServer

    const ctx: HmrContext = {
      file: '/path/to/template.liquid',
      modules: [liquidModule, cssModule],
      read: vi.fn(),
      timestamp: Date.now(),
      server: mockServer
    }

    const handler = (plugin.handleHotUpdate as any).handler || plugin.handleHotUpdate
    const result = handler(ctx)

    // Should return the importers of the first module and the remaining modules
    expect(result).toEqual([...liquidModule.importers, cssModule])
  })

  it('returns original modules for non-liquid files', () => {
    const plugin = shopifyLiquidNoRefresh()

    const module = {
      id: '/path/to/script.js',
      file: '/path/to/script.js'
    } as ModuleNode

    const mockServer = {
      config: {},
      pluginContainer: {},
      moduleGraph: {
        getModulesByFile: () => []
      }
    } as unknown as ViteDevServer

    const ctx: HmrContext = {
      file: '/path/to/script.js',
      modules: [module],
      read: vi.fn(),
      timestamp: Date.now(),
      server: mockServer
    }

    const handler = (plugin.handleHotUpdate as any).handler || plugin.handleHotUpdate
    const result = handler(ctx)

    // Should be undefined for non-liquid files (default behavior)
    expect(result).toBeUndefined()
  })
})
