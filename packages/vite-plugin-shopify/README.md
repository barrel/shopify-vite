# vite-plugin-shopify

`vite-plugin-shopify` aims to integrate Vite as seamlessly as possible with Shopify themes for a best-in-class developer experience.

## Features

- ⚡️ [Everything Vite provides](https://vitejs.dev/guide/features.html), plus:
- 🤖 Automatic entrypoint detection
- 🏷 Smart generation of `script` and `link` tags for entrypoints
- 🌎 Full support for assets served from Shopify CDN
- 👌 Zero-Config

## Install

```bash
npm i vite-plugin-shopify -D

# yarn
yarn add vite-plugin-shopify -D

# pnpm
pnpm add vite-plugin-shopify -D
```

## Usage

### Vite Plugin

Add the `shopify` plugin to `vite.config.js` / `vite.config.ts`:

```ts
import viteShopify from "vite-plugin-shopify";

export default {
  plugins: [
    /* Plugin options are not required, defaults shown */
    viteShopify({
      // Root path to your Shopify theme directory (location of snippets, sections, templates, etc.)
      themeRoot: process.cwd(),
      // Front-end source code directory (relative to themeRoot)
      sourceCodeDir: "frontend",
      // Front-end entry points directory (relative to sourceCodeDir)
      entrypointsDir: "entrypoints"
    })
  ]
};
```

You can customize this file as needed. Check Vite's [plugins](https://vitejs.dev/plugins/) and [config reference](https://vitejs.dev/config/) for more info.

### File structure

The Shopify Vite plugin treats each script and stylesheet in the entrypoints directory (`frontend/entrypoints` by default) as an input for the Vite build. You can organize the rest of your frontend code however you'd like. For example:

```bash
frontend
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

- Only script and stylesheet files are supported as entrypoints.
- You can customize where `vite-plugin-shopify` loads entrypoints by specifying a value for the `entrypointsDir` plugin option.

### Adding scripts and styles to your theme

In your `<head>` element add this

```liquid
{%- render 'vite-client' -%}
```

* `vite-plugin-shopify` will generate `vite-client.liquid`.
* This will add a `<script>` tag to load the ViteJS HMR client.
* This will only render if the dev server is running.

Then render the `vite-tag` snippet (in your `<head>` element too) to insert tags for loading assets from a given entrypoint file:

```liquid
{% render 'vite-tag' with 'theme.ts' %}
```

- `vite-plugin-shopify` will generate new versions of `vite-tag.liquid` during development and on each production build.
- The `vite-tag` snippet will render HTML tags to load the provided entrypoint.
- Script tags are generated with a `type="module"` and `crossorigin` attributes like Vite does by default.
- In production mode, the `asset_url` filter is used to load resources from the Shopify CDN.
- In production mode, the `vite-tag` snippet will automatically render separate tags for loading stylesheets and preloading imported JS chunks.
- When running the development server, these tags are omitted, as Vite will load the dependencies as separate modules.

```txt
{% render 'vite-tag' with 'theme.ts' %}

# HTML output (development)
<script src="http://localhost:5173/theme.ts" type="module"></script>

# HTML output (production)
<link rel="stylesheet" href="{{ 'theme.4d95c99b.css' | asset_url }}">
<script src="{{ 'theme.3b623fca.js' | asset_url }}" type="module" crossorigin="anonymous"></script>
<link href="{{ 'lodash.13b0d649.js' | asset_url }}" rel="modulepreload" as="script" crossorigin="anonymous">
```

- In development mode, assets are loaded from the Vite development server host.
- In production mode, assets are loaded from the Shopify CDN using the `asset_url` filter and a relative base path.

For convenience, `~/` and `@/` are aliased to your `frontend` folder, which simplifies imports:

```ts
import App from "@/components/App.vue";
import "@/styles/my_styles.css";
```

## Example

See the [vite-shopify-example](../vite-shopify-example/) theme for a basic demonstration of `vite-plugin-shopify` usage.

## To-Do

- [ ] Unit tests

## Bugs

Please create an issue if you found any bugs, to help us improve this project!

## Thanks

We would like to specifically thank the following projects, for inspiring us and helping guide the implementation for this plugin by example:

- [vite_ruby](https://github.com/ElMassimo/vite_ruby)
- [laravel-vite](https://github.com/innocenzi/laravel-vite)
- [nuxt.js](https://github.com/nuxt/framework)
