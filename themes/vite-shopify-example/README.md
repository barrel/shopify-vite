# Getting Started

## Prerequisites

* [Node.js (latest LTS version)](https://nodejs.org/en/)
* [pnpm](https://pnpm.io/)
* [Shopify CLI v2.17+](https://shopify.dev/themes/tools/cli)

## Directory Structure

```bash
└── project
    ├── assets
    ├── config
    ├── frontend
    │   └── entrypoints
    │       └── # only Vite entry files here
    ├── layout
    ├── locales
    ├── sections
    ├── snippets
    └── templates
        └── customers
```

Look at [vite-plugin-shopify](https://github.com/barrel/barrel-shopify/tree/main/packages/vite-plugin-shopify) to learn more.

## Setup

```bash
# Make sure to install the dependencies
pnpm install
```

## Development Server
```bash
# Start the development server on http://localhost:5173
pnpm dev
```

> **Note**: This server is not your theme server. Its sole purpose is to serve assets, such as scripts or stylesheets. You still need to use the Shopify CLI for themes.

```bash
# Authenticate with Shopify CLI
shopify login --store johns-apparel.myshopify.com

# Serve your theme
shopify theme serve
```

## Production

```bash
# Build your CSS and JavaScript assets for production
pnpm build
```

```bash
# Upload your local theme files to Shopify
shopify theme push
```

Checkout [Build Shopify themes](https://shopify.dev/themes) for more information.
