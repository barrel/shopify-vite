# vite-plugin-cleanup

Automatically cleanup built files in assets folder

```js
// vite.config.js
import cleanup from 'vite-plugin-cleanup'

export default {
  plugins: [
    cleanup()
  ]
}
```

## Configuration

### cleanUpSourceMaps

Type: `'auto' | boolean`

Default: 'auto'

Whether the source map files `*.js.map` should be cleaned up or not.

## Acknowledgements

This plugin is based on the ideas from the following project

* [vite-plugin-shopify-clean](https://www.npmjs.com/package/@by-association-only/vite-plugin-shopify-clean)