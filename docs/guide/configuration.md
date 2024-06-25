# Configuration Reference

The following reference covers all supported configuration options in Volt - Shopify Vite Plugin.

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

## snippetFile

- **Type:** `string`
- **Default:** `"vite-tag.liquid"`

Specifies the file name of the snippet that loads your assets.

## versionNumbers

- **Type:** `boolean`
- **Default:** `false`

Specifies whether to append version numbers to your production-ready asset URLs in [`snippetFile`](/guide/configuration.html#snippetfile).
