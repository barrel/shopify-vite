---
"vite-plugin-shopify": major
---

Shopify Vite Plugin is an ESM-only package. To use it with [Vite 5](https://vitejs.dev/blog/announcing-vite5), we need
to add `"type": "module"` to the `package.json`
of our projects OR change the extension of our Vite config file to `.mjs`/`.mts`.

- Updated Vite to v5 dbcab469330543b715f5520611d427482c9ca432
- Dropped cjs support 5bdbe456162ba2b630b6c227a53950b808803955
- Updated manifest.json path to .vite/manifest.json d4f2b3793a9d0c8c607467000518d8a83f04f6e1
- Updated https config 14181f2af01dda1462e888a9e09a9966342adf90
