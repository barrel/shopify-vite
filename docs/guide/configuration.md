# Configuration Reference

The following reference covers all supported configuration options in Shopify Vite Plugin.

::: code-group
```js [vite.config.js]
import shopify from 'vite-plugin-shopify'

export default {
  plugins: [
    shopify({
      // your configuration options here...
    })
  ]
}
```
:::

## themeRoot

- **Type:** `string`
- **Default:** `"./"`

Root path to your Shopify theme directory.

## sourceCodeDir

- **Type:** `string`
- **Default:** `"frontend"`

Front-end source code directory.

## entrypointsDir

- **Type:** `string`
- **Default:** `"frontend/entrypoints"`

Front-end entry points directory.

## additionalEntrypoints

- **Type:** `string[]`
- **Default:** `[]`

Additional files to use as entry points (accepts an array of file paths or glob patterns).

__Example:__

```js
{
  additionalEntrypoints: [
    'frontend/foo.ts', // relative to sourceCodeDir
    'bar.ts', // relative to themeRoot
    'resources/**/*.{ts,js}'
  ]
}
```
