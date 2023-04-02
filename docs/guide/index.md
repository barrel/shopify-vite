# Getting Started

## Overview

Shopify Vite Plugin is a project that aims to integrate [Vite](https://vitejs.dev/) as seamlessly
as possible with [Shopify themes](https://shopify.dev/docs/themes) to optimize your theme development experience by
providing sensible built-in configurations that should work for the majority of themes and a
snippet to load your assets for development and production.

## Installation in an existing theme

### Installing Node

You must ensure that Node.js (16+) and NPM are installed before running Vite and the Shopify plugin:

```bash
node -v
npm -v
```

You can easily install the latest version of Node and NPM using simple graphical
installers from [the official Node website](https://nodejs.org/en/download/).

### Installing Vite and the Shopify Vite Plugin

First, create a `package.json` file with `npm init -y` in the root of your theme's directory structure.

Next, install Vite and the Shopify plugin via NPM.

```bash
npm i -D vite vite-plugin-shopify
```

Finally, adjust your `package.json` by adding the following [scripts](https://docs.npmjs.com/cli/v9/using-npm/scripts):

```
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1", // [!code --]
    "dev": "vite dev", // [!code ++]
    "build": "vite build" // [!code ++]
  },
  "keywords": [],
  "author": "",
```

### Configure Vite

Create a `vite.config.js` file in your project root directory and add the Shopify plugin. You are free to customize this
file based on your needs; check Vite's [plugins](https://vitejs.dev/plugins/) and [config reference](https://vitejs.dev/config/) for more info.

```js
import shopify from 'vite-plugin-shopify'

export default {
  plugins: [
    shopify()
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

::: tip
Read the [Configuration Reference](/guide/configuration) of the Shopify Vite Plugin for a full overview of all supported configuration options.
:::

### Loading your Scripts and Styles

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

During development, the `vite-tag` snippet will load your assets from the Vite development server and inject the Vite client to enable Hot Module Replacement.
In build mode, the snippet will load your compiled and versioned assets, including any imported CSS, and use the `asset_url` filter to serve your assets
from the Shopify content delivery network (CDN).

### Loading `additionalEntrypoints`

::: code-group

```liquid [theme.liquid]
{% liquid
  # Relative to sourceCodeDir
  render 'vite-tag' with '@/foo.ts'
  render 'vite-tag' with '~/foo.ts'

  # Relative to project root
  render 'vite-tag' with '/bar.ts' # leading slash is required
%}
```

```js [vite.config.js]
import shopify from 'vite-plugin-shopify'

export default {
  plugins: [
    shopify({
      additionalEntrypoints: [
        'frontend/foo.ts', // Relative to sourceCodeDir
        'bar.ts' // Relative to project root
      ]
    })
  ]
}
```
:::

## Running Vite

There are two ways you can run Vite. You may run the development server via the `dev` command, which is useful while developing locally.
The development server will automatically detect changes to your files and instantly reflect them in any open browser windows.

Or, running the `build` command will version and bundle your application's assets and get them ready for you to deploy to production:

```bash
# Run the Vite development server...
npm run dev

# Build and version the assets for production...
npm run build
```

::: tip
We recommend adding scripts to your project's package.json file to [launch the Shopify and Vite servers in parallel](/guide/troubleshooting#launch-shopify-vite).
:::

## Working with JavaScript

### Aliases

For convenience, `~/` and `@/` are aliased to your `sourceCodeDir` folder, which simplifies imports:

```js
import App from '@/components/App.vue'
import '@/styles/my_styles.css'
```

### React

If you would like to build your front-end using the [React](https://react.dev/) framework, then you will also need to install the [@vitejs/plugin-react](https://www.npmjs.com/package/@vitejs/plugin-react) plugin:

```bash
npm i -D @vitejs/plugin-react
```

You may then include the plugin in your `vite.config.js` configuration file:

```js
import { defineConfig } from 'vite'
import shopify from 'vite-plugin-shopify'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    shopify(),
    react()
  ]
})
```

You will need to ensure that any files containing JSX have a `.jsx` or `.tsx` extension.

During development, the `vite-tag` snippet will include [the react refresh script](https://github.com/vitejs/vite/issues/1984#issuecomment-778289660).

## Working with Stylesheets

You can learn more about Vite's CSS support within the [Vite documentation](https://vitejs.dev/guide/features.html#css). If you are using PostCSS plugins such as [Tailwind](https://tailwindcss.com/), you may create
a `postcss.config.js` file in the root of your project and Vite will automatically apply it:

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

### Preloading Stylesheets

You can pass the `preload_stylesheet` variable to the `vite-tag` snippet to enable the `preload` parameter of the `stylesheet_tag` filter. Use it sparingly. For example, consider preloading only render-blocking stylesheets.
[Learn more](https://shopify.dev/themes/best-practices/performance#use-resource-hints-to-preload-key-resources).

```liquid
{% render 'vite-tag' with 'theme.scss', preload_stylesheet: true %}
```

## Advanced Customization

Out of the box, the Shopify Vite Plugin uses sensible conventions to help you add Vite with zero configuration to existing Shopify themes; however,
sometimes you may need to customize the Plugin's behavior.

Every configuration option is described in the [Configuration Reference](/guide/configuration).
