# Configuration Reference

The following reference covers all supported configuration options in Volt, a Vite plugin for Shopify development.

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

## tunnel

- **Type:** `boolean | string`
- **Default:** `false`

Enables the creation of Cloudflare tunnels during dev, allowing previews from any device.

## themeHotReload

- **Type:** `boolean`
- **Default:** `true`

Specifies whether to use the [@shopify/theme-hot-reload](https://www.npmjs.com/package/@shopify/theme-hot-reload) script to enable hot reloading for the theme.

## snippetAttributes

- **Type:** `boolean`
- **Default:** `false`

Enables the snippet to accept custom attribute parameters for generated HTML tags. When enabled, the generated snippet accepts the following Liquid parameters:

- `script_attrs` - Attributes added to `<script>` tags
- `preload_attrs` - Attributes added to modulepreload `<link>` tags
- `style_attrs` - Attributes added to stylesheet `<link>` tags

:::tip
When enabled, CSS uses raw `<link rel="stylesheet">` tags instead of Shopify's `stylesheet_tag` filter.
:::

### Usage Example

```liquid
{% render 'vite-tag', entry: 'theme.js', script_attrs: 'defer data-turbo-track="reload"' %}
{% render 'vite-tag', entry: 'theme.css', style_attrs: 'media="print"' %}
```
