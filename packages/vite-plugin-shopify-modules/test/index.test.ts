import modules from '../src/index'
import { describe, it, expect } from 'vitest'
import { existsSync, lstatSync } from 'fs'
import { build } from 'vite'
import path from 'path'

describe('vite-plugin-shopify:modules', () => {
  it('configures aliases to the modules directory', () => {
    expect(modules().config().resolve.alias).toEqual(
      expect.objectContaining({
        '@modules': path.resolve('modules'),
        '~modules': path.resolve('modules')
      })
    )
  })

  it('builds out symlinks from module files', async () => {
    await build({
      logLevel: 'silent',
      build: {
        outDir: path.join(__dirname, '__fixtures__', 'assets'),
        rollupOptions: {
          input: path.join(__dirname, '__fixtures__', 'main.js')
        }
      },
      plugins: [
        modules({
          themeRoot: path.join(__dirname, '__fixtures__'),
          modulesDir: path.join(__dirname, '__fixtures__', 'modules')
        })
      ]
    })

    expect(existsSync(path.join(__dirname, '__fixtures__', 'snippets', 'multirow.liquid'))).toEqual(true)
    expect(existsSync(path.join(__dirname, '__fixtures__', 'sections', 'multirow.liquid'))).toEqual(true)
    expect(lstatSync(path.join(__dirname, '__fixtures__', 'modules', 'multirow', 'multirow.section.liquid')).isSymbolicLink()).toEqual(true)
    expect(lstatSync(path.join(__dirname, '__fixtures__', 'modules', 'multirow', 'multirow.snippet.liquid')).isSymbolicLink()).toEqual(true)
    expect(lstatSync(path.join(__dirname, '__fixtures__', 'modules', 'collage', 'collage.section.liquid')).isSymbolicLink()).toEqual(true)
    expect(lstatSync(path.join(__dirname, '__fixtures__', 'modules', 'collage', 'collage.snippet.liquid')).isSymbolicLink()).toEqual(true)
  })
})
