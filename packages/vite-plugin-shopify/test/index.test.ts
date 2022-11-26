import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import path from 'path'
import { build } from 'vite'
import shopify from '../src'
import fs from 'fs/promises'

describe('vite-plugin-shopify', () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers()
  })

  afterEach(() => {
    // restoring date after each test run
    vi.restoreAllMocks()
  })

  it('builds out .liquid files for production', async () => {
    // mock current date
    const mockDate = new Date(2022, 0, 1)
    vi.setSystemTime(mockDate)

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
    const clientHtml = await fs.readFile(path.join(__dirname, '__fixtures__', 'snippets', 'vite-client.liquid'), { encoding: 'utf8' })

    expect(tagsHtml).toMatchSnapshot()
    expect(clientHtml).toMatchSnapshot()
  })
})
