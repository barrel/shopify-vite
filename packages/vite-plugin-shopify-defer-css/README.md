# vite-plugin-shopify-defer-css

Defer loading non-critical stylesheets to improve the performance of your online store. [Learn more](https://web.dev/articles/defer-non-critical-css).

## Usage

```js
// vite.config.js
import deferCss from 'vite-plugin-shopify-defer-css'

export default {
  plugins: [
    /* Plugin options are not required, defaults shown */
    deferCss({
      // Root path to your Shopify theme directory (location of snippets, sections, templates, etc.)
      themeRoot: './',
      // Front-end source code directory
      sourceCodeDir: 'frontend',
      // Front-end entry points directory
      entrypointsDir: 'frontend/entrypoints',
      // Specifies the file name of the snippet that loads your assets
      snippetFile: 'defer-css.liquid',
    }),
  ]
}
```

```liquid
{% liquid
  # theme.liquid

  # Include the generated `defer-css` snippet to load your deferred stylesheets
  # The `fetchpriority` parameter is optional and defaults to `low`.
  render 'defer-css' with 'deferred.scss', fetchpriority: 'low'
%}
```
