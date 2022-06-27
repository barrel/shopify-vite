# vite-plugin-shopify-theme-settings

This plugin adds features to make it easier to manage the JSON schema files for Shopify Theme Settings.

## Features

- Maintain schema for individual Theme Settings sections in separate files instead of one large JSON file
- Automatically populate "theme_info" attributes such as theme name and version with current values from your theme's package.json or manually-specified values

## Install

```bash
npm i vite-plugin-shopify-theme-settings -D

# yarn
yarn add vite-plugin-shopify-theme-settings -D

# pnp
pnpm add vite-plugin-shopify-theme-settings -D
```

## Usage

Add `shopifyThemeSettings` plugin to vite.config.js / vite.config.ts:

```ts
// vite.config.js / vite.config.ts
import { shopifyThemeSettings } from "vite-plugin-shopify-theme-settings";

export default {
  plugins: [
    // Default options shown:
    shopifyThemeSettings({
      themeRoot: "./",
      schemaSourceDir: "config/src",
      values: {}
    })
  ]
};
```

- Create a `src` directory under your theme's `config` folder to hold the source files for `settings_schema.json` (or specify a different `schemaSourceDir` in the plugin options).
- Create a JSON file for each section of your theme settings. Sections will be ordered alphabetically, so you can prepend the filenames with a number to determine the correct sequence.
- Make sure that your schema source directory is listed in your theme's `.shopifyignore` file to avoid errors when pushing code to Shopify.
