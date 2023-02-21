# Getting Started

## Overview

Shopify Vite Plugin is a project that aims to integrate [Vite](https://vitejs.dev/) as seemlessly as possible
with [Shopify themes](https://shopify.dev/docs/themes) to optimize your theme development experience.

## Installation

Add `vite` and `vite-plugin-shopify` to your project's `devDependencies`:

```bash
# npm
npm i -D vite vite-plugin-shopify

# pnpm
pnpm add -D vite vite-plugin-shopify

# Yarn
yarn add -D vite vite-plugin-shopify
```

## Usage

Next, create a `vite.config.js` file in your project root directory and add the `shopify` plugin:

```js
import shopify from 'vite-plugin-shopify'

export default {
  plugins: [
    // Plugin options are not required (defaults shown)
    shopify({
      // Path to Shopify theme directory (location of snippets, sections, templates, etc.)
      themeRoot: './',
      // Path to front-end source code path
      sourceCodeDir: 'frontend',
      // Path to front-end entry points path
      entrypointsDir: 'frontend/entrypoints',
      // Additional files to use as entry points (accepts an array of file paths or glob patterns)
      additionalEntrypoints: [],
    }),
  ],
}
```

Create an entry point file (these may be JavaScript or CSS files) and place it in your `entrypointsDir` directory.

Finally, insert the script or stylesheet into the desired location of your theme by passing in a relative path from the entrypoints directory to the `vite-tag` liquid snippet. For example, given an entry point file located at `frontend/entrypoints/theme.ts`:

```liquid
{% render 'vite-tag' with 'theme.ts' %}
```

The `vite-tag` snippet will automatically inject the Vite client to enable Hot Module Replacement during dev.

::: warning
The `vite-tag` snippet file will be
auto-generated and inserted into your theme's snippets folder each time you
run the Vite development server or initiate a production build.
:::

## Development & Deployment

To start development, run the `vite` CLI command. In development, the `vite-tag` snippet will output a module script tag or stylesheet link tag which loads the desired entry point file from the Vite development server. In production, the snippet will output a tag to load the compiled asset from Shopify's CDN, along with additional script and link tags for any imported modules.

```liquid
<!-- HTML output from vite-tag snippet (development) -->
<script src="http://localhost:5173/theme.ts" type="module"></script>

<!-- HTML output from vite-tag snippet (production) -->
<link rel="stylesheet" href="{{ 'theme.4d95c99b.css' | asset_url }}">
<script src="{{ 'theme.3b623fca.js' | asset_url }}" type="module" crossorigin="anonymous"></script>
<link href="{{ 'lodash.13b0d649.js' | asset_url }}" rel="modulepreload" as="script" crossorigin="anonymous">
```

We recommend adding [script commands](https://docs.npmjs.com/cli/v8/using-npm/scripts) to your project's `package.json` file to integrate the Vite server with the [Shopify CLI](https://shopify.dev/themes/tools/cli).

The following example provides a `start` command to run the Vite and Shopify servers in parallel, and a `deploy` command to compile assets for production and push the theme code to your Shopify store.

```json
"scripts": {
  "start": "run-p vite:serve shopify:serve",
  "deploy": "run-s vite:build shopify:push",
  "vite:serve": "vite",
  "vite:build": "vite build",
  "shopify:serve": "shopify theme serve",
  "shopify:push": "shopify theme push"
}
```

::: info
The above example depends on the [npm-run-all](https://www.npmjs.com/package/npm-run-all) package being installed to your project._
:::
