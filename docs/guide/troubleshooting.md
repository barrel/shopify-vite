# Troubleshooting

If the suggestions here don't work, please try posting questions on [GitHub Discussions](https://github.com/barrel/shopify-vite/discussions).

## How to launch the Shopify and Vite servers in parallel? {#launch-shopify-vite}

You can use [`concurrently`](https://github.com/open-cli-tools/concurrently) or [`npm-run-all`](https://github.com/mysticatea/npm-run-all) and [script commands](https://docs.npmjs.com/cli/v8/using-npm/scripts) to launch Vite and Shopify servers in parallel.

::: code-group

```json [package.json]
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "vite", // [!code --]
    "build": "vite build", // [!code --]
    "dev": "run-p -sr vite:dev shopify:dev", // [!code ++]
    "build": "vite build", // [!code ++]
    "vite:dev": "vite", // [!code ++]
    "shopify:dev": "shopify theme dev --store $npm_package_config_store" // [!code ++]
  },
  "devDependencies": {
    "npm-run-all": "^4.1.5", // [!code ++]
    "vite": "^4.2.1",
    "vite-plugin-shopify": "^2.0.2"
  }, // [!code ++]
  "config": { // [!code ++]
    "store": "my-shop.myshopify.com" // [!code ++]
  }
}
```

:::
