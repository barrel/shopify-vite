# vite-plugin-shopify

`vite-plugin-shopify` aims to integrate Vite as seamlessly as possible with Shopify themes to optimize your theme development experience.

## Features

- ⚡️ [Everything Vite provides](https://vitejs.dev/guide/features.html), plus:
- 🤖 Automatic entrypoint detection
- 🏷 Smart tag generation to load your scripts and styles
- 🌎 Full support for assets served from Shopify's CDN
- 👌 Zero-Config
- 🔩 Extensible

## Install

```bash
npm i vite-plugin-shopify -D

# yarn
yarn add vite-plugin-shopify -D

# pnpm
pnpm add vite-plugin-shopify -D
```

## Usage

Add the `vite-plugin-shopify` to your `vite.config.js` file and configure it:

```js
import shopify from 'vite-plugin-shopify'

export default {
  plugins: [
    /* Plugin options are not required, defaults shown */
    shopify({
      // Root path to your Shopify theme directory (location of snippets, sections, templates, etc.)
      themeRoot: './',
      // Front-end source code directory
      sourceCodeDir: 'frontend',
      // Front-end entry points directory
      entrypointsDir: 'frontend/entrypoints',
      // Additional files to use as entry points (accepts an array of file paths or glob patterns)
      additionalEntrypoints: [],
      // Specifies the file name of the snippet that loads your assets
      snippetFile: 'vite-tag.liquid',
     // Specifies whether to append version numbers to your production-ready asset URLs in `snippetFile`
      versionNumbers: false
    })
  ]
}
```

The Shopify Vite Plugin does not require you to specify the entry points for your theme. By default, it treats JavaScript and CSS files (including preprocessed
languages such as TypeScript, JSX, TSX, and Sass) within the `frontend/entrypoints` folder in the root of your project as entry points for Vite.

```
/
└── frontend/
    └── entrypoints/
        ├── theme.scss
        └── theme.ts
```

### Adding scripts and styles to your theme

The Shopify Vite Plugin generates a `vite-tag` snippet which includes `<script>` and `<link>` tags, and all the liquid logic needed
to load your assets.

With your Vite entry points configured, you only need to reference them with the `vite-tag` snippet that you add to the `<head>` of your theme's layout:

```liquid
{% liquid
  # Relative to entrypointsDir
  render 'vite-tag' with 'theme.scss'
  render 'vite-tag' with 'theme.ts'
%}
```

During development, the `vite-tag` will load your assets from the Vite development server and inject the Vite client to enable Hot Module Replacement.
In build mode, the snippet will load your compiled and versioned assets, including any imported CSS, and use the `asset_url` filter to serve your assets
from the Shopify content delivery network (CDN).

#### Loading `additionalEntrypoints`

```liquid
{% liquid
  # Relative to sourceCodeDir
  render 'vite-tag' with '@/foo.ts'
  render 'vite-tag' with '~/foo.ts'
%}
```

```liquid
{% liquid
  # Relative to project root
  render 'vite-tag' with '/bar.ts' # leading slash is required
%}
```

#### Preloading stylesheets

You can pass the `preload_stylesheet` variable to the `vite-tag` snippet to enable the `preload` parameter of the `stylesheet_tag` filter. Use it sparingly. For example, consider preloading only render-blocking stylesheets.
[Learn more](https://shopify.dev/themes/best-practices/performance#use-resource-hints-to-preload-key-resources).

```liquid
{% render 'vite-tag' with 'theme.scss', preload_stylesheet: true %}
```

### Import aliases

For convenience, `~/` and `@/` are aliased to your `frontend` folder, which simplifies imports:

```js
import App from '@/components/App.vue'
import '@/styles/my_styles.css'
```

## Example

See the [vite-shopify-example](https://github.com/barrel/barrel-shopify/tree/main/examples/vite-shopify-example) theme for a basic demonstration of `vite-plugin-shopify` usage.

## Bugs

Please create an issue if you found any bugs, to help us improve this project!

## Thanks

We would like to specifically thank the following projects, for inspiring us and helping guide the implementation for this plugin by example:

- [vite_ruby](https://github.com/ElMassimo/vite_ruby)
- [laravel-vite](https://github.com/innocenzi/laravel-vite)
- [Laravel Vite Plugin](https://github.com/laravel/vite-plugin)
