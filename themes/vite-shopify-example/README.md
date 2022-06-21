# vite-shopify-example

This is a barebones example theme demonstrating the usage of `vite-plugin-shopify`.

- Run `npm install` or `pnpm install` to download and set up dependencies
- Run `npm run dev` to start the Vite development server and render the `snippets/vite-tag.snippet` file for development mode.
- In a separate command line instance, run `shopify theme serve` to start the Shopify CLI server and test the storefront. (You should see a blank page with a gradient background, and `Vite ⚡️ Shopify` will be output to the JS console.)
- To test the production mode, stop the `dev` script from running and run `npm run build` instead. Vite will generate bundled static files to the `assets` directory, and `snippets/vite-tag.snippet` will be replaced with production code. Reload the page on the Shopify CLI server to validate the production output.
