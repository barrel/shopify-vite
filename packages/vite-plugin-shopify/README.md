# vite-plugin-shopify

`vite-plugin-shopify` aims to integrate Vite as seamlessly as possible with Shopify themes to optimize your theme development experience.

## Features

- ⚡️ [Everything Vite provides](https://vitejs.dev/guide/features.html), plus:
- 🤖 Automatic entrypoint detection
- 🏷 Smart generation of `script` and `link` tags for entrypoints
- 🌎 Full support for assets served from Shopify CDN
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

```ts
import viteShopify from "vite-plugin-shopify";

export default {
  plugins: [
    /* Plugin options are not required, defaults shown */
    viteShopify({
      // Root path to your Shopify theme directory (location of snippets, sections, templates, etc.)
      themeRoot: "./",
      // Front-end source code directory
      sourceCodeDir: "frontend",
      // Front-end entry points directory
      entrypointsDir: "frontend/entrypoints",
      // Additional files to use as entry points (accepts an array of file paths or glob patterns)
      additionalEntrypoints: []
    })
  ]
};
```

You can customize this file as needed. Check Vite's [plugins](https://vitejs.dev/plugins/) and [config reference](https://vitejs.dev/config/) for more info.

### Project structure

The Shopify Vite Plugin treats JavaScript and CSS files in the entrypoints directory (`frontend/entrypoints` by default) as entry points for Vite. You can organize the rest of your frontend code however you'd like. For example:

```bash
theme/frontend
  ├── entrypoints
  │   │ # Vite entry point files
  │   │── theme.ts
  │   └── theme.scss
  │ # Additional frontend source files to be imported from entrypoints
  │── components
  │   └── App.vue
  │── stylesheets
  │   └── my_styles.css
  └── images
      └── logo.svg
```

### Adding scripts and styles to your theme

With your Vite entry points configured, you only need to reference them with the auto-generated `vite-tag` snippet that you add to the `<head>` of your theme's layout:

```liquid
{% liquid
  render 'vite-tag' with 'theme.scss'
  render 'vite-tag' with 'theme.ts'
%}
```

The Vite Shopify Plugin will generate new versions of the `vite-tag` snippet during development and on each production build.

- In development mode, your assets are served from the Vite development server.
- In development mode, the `vite-tag` snippet will inject the Vite client to enable Hot Module Replacement.
- In production mode, the `asset_url` filter is used to load assets from the Shopify CDN.
- In production mode, the `vite-tag` snippet will automatically render separate tags for loading stylesheets and preloading imported JS chunks.
- Script tags are generated with a `type="module"` and `crossorigin` attributes like Vite does by default.

  ```txt
  {% render 'vite-tag' with 'theme.ts' %}

  # HTML output (development)
  <script src="http://localhost:5173/@vite/client" type="module"></script>
  <script src="http://localhost:5173/theme.ts" type="module"></script>

  # HTML output (production)
  <link rel="stylesheet" href="{{ 'theme.4d95c99b.css' | asset_url }}">
  <script src="{{ 'theme.3b623fca.js' | asset_url | split: '?' | first }}" type="module" crossorigin="anonymous"></script>
  <link href="{{ 'lodash.13b0d649.js' | asset_url | split: '?' | first }}" rel="modulepreload" as="script" crossorigin="anonymous">
  ```

#### Loading `additionalEntrypoints`

```liquid
{% liquid
  # Relative to sourceCodeDir
  render 'vite-tag' with '@/foo.ts'
  render 'vite-tag' with '~/foo.ts'

  # Relative to themeRoot
  render 'vite-tag' with '/resources/bar.ts' # leading slash is required
%}
```

#### Preloading stylesheets

```liquid
{% render 'vite-tag' with 'theme.scss', preload_stylesheet: true %}
```

The `preload_stylesheet` parameter will enable the `preload` parameter of the `stylesheet_tag` filter, use it sparingly e.g. consider preloading only render-blocking stylesheets. [Learn more](https://shopify.dev/themes/best-practices/performance#use-resource-hints-to-preload-key-resources)

### Import aliases

For convenience, `~/` and `@/` are aliased to your `frontend` folder, which simplifies imports:

```ts
import App from "@/components/App.vue";
import "@/styles/my_styles.css";
```

## Example

See the [vite-shopify-example](https://github.com/barrel/barrel-shopify/tree/main/themes/vite-shopify-example) theme for a basic demonstration of `vite-plugin-shopify` usage.

## Bugs

Please create an issue if you found any bugs, to help us improve this project!

## Thanks

We would like to specifically thank the following projects, for inspiring us and helping guide the implementation for this plugin by example:

- [vite_ruby](https://github.com/ElMassimo/vite_ruby)
- [laravel-vite](https://github.com/innocenzi/laravel-vite)
- [Laravel Vite Plugin](https://github.com/laravel/vite-plugin)
