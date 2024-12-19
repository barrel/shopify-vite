# vite-plugin-shopify

## 3.1.1

### Patch Changes

- Add Vite 6 support

## 3.1.0

### Minor Changes

- Add tunnel support via @shopify/plugin-cloudflare ([#154](https://github.com/barrel/shopify-vite/pull/154))

- Add crossorigin="anonymous" to development css links ([#126](https://github.com/barrel/shopify-vite/pull/126))

- Disable strict port so server will not exit when port is already used ([#122](https://github.com/barrel/shopify-vite/pull/122))

## 3.0.1

### Patch Changes

- Fix issue with build.manifest option

## 3.0.0

### Major Changes

Volt, a Vite plugin for Shopify development is an ESM-only package. To use it with [Vite 5](https://vitejs.dev/blog/announcing-vite5), we need
to add `"type": "module"` to the `package.json` of our projects OR change the extension of our Vite config file to `.mjs`/`.mts`.

- Vite 5 support ([#89](https://github.com/barrel/shopify-vite/pull/89))

## 2.2.1

### Patch Changes

- Add version numbers option. Thanks to @slavamak!

## 2.2.0

### Minor Changes

- Re-publish v2.1.2 as v2.2.0 for npm

## 2.1.2

### Patch Changes

- Fix html tags order (#95). Thanks @ysemennikov

## 2.1.1

### Patch Changes

- Fix ESM support ([#77](https://github.com/barrel/shopify-vite/pull/77)) by [@montalvomiguelo](https://github.com/montalvomiguelo)

## 2.1.0

### Minor Changes

- Add support for react and react-refresh ([#74](https://github.com/barrel/shopify-vite/pull/74)) by [@montalvomiguelo](https://github.com/montalvomiguelo)

## 2.0.2

### Patch Changes

- JSDocs ([#67](https://github.com/barrel/shopify-vite/pull/67)) by [@montalvomiguelo](https://github.com/montalvomiguelo)
- Rename Options interface ([#69](https://github.com/barrel/shopify-vite/pull/69)) by [@montalvomiguelo](https://github.com/montalvomiguelo)

## 2.0.1

### Patch Changes

- snippetFile option Fix ([#64](https://github.com/barrel/shopify-vite/pull/64)). Thanks [@slavamak](https://github.com/slavamak)!

## 2.0.0

### Major Changes

We have deprecated the `vite-plugin-shopify-modules` and `vite-plugin-shopify-theme-settings` packages from our NPM repository.
These packages are no longer necessary and do not provide any additional benefit, and their presence can cause additional complexity
and confusion.

- Deprecate legacy packages ([#62](https://github.com/barrel/shopify-vite/pull/62)) by [@montalvomiguelo](https://github.com/montalvomiguelo)
- Add snippetFile option ([#61](https://github.com/barrel/shopify-vite/pull/61)) by [@montalvomiguelo](https://github.com/montalvomiguelo)
- Clean up config hook ([#59](https://github.com/barrel/shopify-vite/pull/59)) by [@montalvomiguelo](https://github.com/montalvomiguelo)

> **Note**
> After removing "vite-plugin-shopify-modules" from your theme, you could manually configure the `@modules` alias in Vite to maintain
> compatibility with this alias in your code.

## 1.0.2

### Patch Changes

- Bugfix/server host ([#56](https://github.com/barrel/shopify-vite/pull/56)) by [@montalvomiguelo](https://github.com/montalvomiguelo)

## 1.0.1

### Patch Changes

- Shopify Vite Docs ([#48](https://github.com/barrel/shopify-vite/pull/48)) by [@montalvomiguelo](https://github.com/montalvomiguelo)

## 1.0.0

### Major Changes

- Update documentation of Shopify Vite Plugin. ([#47](https://github.com/barrel/barrel-shopify/pull/47)) by [@montalvomiguelo](https://github.com/montalvomiguelo)

## 0.0.13

### Patch Changes

- Remove redundant types ([#44](https://github.com/barrel/barrel-shopify/pull/44)) by [@montalvomiguelo](https://github.com/montalvomiguelo)
- Improve DX ([#45](https://github.com/barrel/barrel-shopify/pull/45)) by [@montalvomiguelo](https://github.com/montalvomiguelo)

## 0.0.12

### Patch Changes

- Normalize path separators to use POSIX. Resolves [#35](https://github.com/barrel/barrel-shopify/issues/35) ([#37](https://github.com/barrel/barrel-shopify/pull/37)) by [@montalvomiguelo](https://github.com/montalvomiguelo)

## 0.0.11

### Patch Changes

- Fix issue with empty vite-client.liquid snippet! ([#33](https://github.com/barrel/barrel-shopify/pull/33)) by [@montalvomiguelo](https://github.com/montalvomiguelo)

## 0.0.10

### Patch Changes

- Upgrade to Vite 4.0.4

## 0.0.9

### Patch Changes

- Upgrade to Vite 4.0.0
- Ensure entry file hashes are updated when imported chunks are modified

## 0.0.8

### Patch Changes

- Remove version query from Shopify assets to avoid double-loading when files are used as both entry points and imported chunks

## 0.0.7

### Patch Changes

- Remove query strings from shopify asset URLS in vite tag snippet

## 0.0.6

### Patch Changes

- Add support for preload_stylesheet parameter on vite-tag snippet
- Allow specifying entry file for vite-tag by absolute path (relative to root)

## 0.0.5

### Patch Changes

- feef172: Add "additionalEntrypoints" option and support for shorthand imports from vite-plugin-shopify-modules

## 0.0.4

### Patch Changes

- Fix error when restarting dev server

## 0.0.3

### Patch Changes

- Add style tag for style.css when build.cssCodeSplit is disabled

## 0.0.2

### Patch Changes

- Update config generated by plugin to improve alias and hot-reloading support
- Update Vite dependency to 3.0.0 release
- Add vite-client snippet

## 0.0.1

### Patch Changes

- Initial release
