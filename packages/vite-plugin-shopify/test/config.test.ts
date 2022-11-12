import { describe, expect, it } from 'vitest'
import { resolveOptions } from '../src/options'

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
