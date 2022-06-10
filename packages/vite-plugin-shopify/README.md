# vite-plugin-shopify

Shopify Vite is a project that aims to integrate Vite as seamlessly as possible with Shopify themes for a best-in-class developer experience.

## Features

* ⚡️ [Everything Vite provides](https://vitejs.dev/guide/features.html), plus:
* 🤖 Automatic entrypoint detection
* 🏷 Smart generation of `script` and `link` tags for entrypoints
* 🌎 Dynamic public base path set to the `assets` folder of a theme
* 👌 Zero-Config

## Install

```bash
npm i vite-plugin-shopify -D

# yarn
yarn add vite-plugin-shopify -D

# pnp
pnpm add vite-plugin-shopify -D

```

## Usage

Add `Shopify` plugin to vite.config.js / vite.config.ts

```ts
// vite.config.js / vite.config.ts
import { Shopify } from 'vite-plugin-shopify'

export default {
  plugins: [
    Shopify()
  ]
}
```

* You can customize this file as needed, check Vite's [plugins](https://vitejs.dev/plugins/) and [config reference](https://vitejs.dev/config/) for more info.

Place your code under `frontend/entrypoints`

```bash
frontend
  ├── entrypoints:
  │   # only Vite entry files here
  │   │── theme.ts
  │   └── theme.scss
  │── components:
  │   └── App.vue
  │── stylesheets:
  │   └── my_styles.css
  └── images:
      └── logo.svg
```

* Only script and CSS files are supported as entrypoints.

In your `<head>` element add this

```liquid
{%- render 'vite-client' -%}
```

* `vite-plugin-shopify` will generate `vite-client.liquid`.
* This will add a `<script>` tag to include the ViteJS HMR client.
* They will only render if the dev server is running.

Then add this snippet (in your `<head>` element too) to load your scripts:

```liquid
{%- render 'vite-tag' with 'theme.ts' -%}
```

* `vite-plugin-shopify` will generate `vite-tag.liquid`.
* This snippet includes the tag for the entrypoint given as a parameter.
* All script tags are generated with a `type="module"` and `crossorigin` attributes just like ViteJS does by default.
* In production mode, asset URLs will use the `asset_url` filter
* In production mode, the `vite-tag` snippet will automatically inject tags for styles or entries imported within a script.
* When running the development server, these tags are omitted, as Vite will load the dependencies.
* Example output:

```txt
# production mode
{%- if vite-tag == 'theme.ts' -%}
  <script src="{{ 'theme.3b623fca.js' | asset_url }}" type="module" crossorigin="anonymous"></script>
  <link href="{{ 'lodash.13b0d649.js' | asset_url }}" rel="modulepreload" as="script" crossorigin="anonymous">
  <link rel="stylesheet" href="{{ 'theme.4d95c99b.css' | asset_url }}">
{%- endif -%}

# development mode
{%- if vite-tag == 'theme.ts' -%}
  <script src="http://localhost:3000/theme.js" type="module"></script>
{%- endif -%}
```

Then add this script (in your `<head>` element too) to expose the URL of the `assets` folder of the theme

```html
<script>
  window.themeAssetsBaseUrl = `{{ 't.js' | asset_url | split: 't.js' | first }}`;
</script>
```

* In production mode, JS-imported asset URLs and CSS `url()` references will be adjusted to respect this base url.

For convenience, `~/` and `@/` are aliased to your `frontend` folder, which simplifies imports:

```ts
import App from '@/components/App.vue'
import '@/styles/my_styles.css'
```

## Example

See the example folder.

## To-Do

- [ ] Unit tests

## Bugs

Please create an issue if you found any bugs, to help me improve this project!

## Thanks

We would like to specifically thank the following projects, for the inspiration and help in regards to the creation of vite-plugin-shopify:

* [vite_ruby](https://github.com/ElMassimo/vite_ruby)
* [laravel-vite](https://github.com/innocenzi/laravel-vite)
* [nuxt.js](https://github.com/nuxt/framework)
