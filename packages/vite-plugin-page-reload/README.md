# vite-plugin-page-reload

Automatically reload the page when watched files change during development with Vite.

```js
// vite.config.js
import pageReload from 'vite-plugin-page-reload'

export default {
  plugins: [
    pageReload('/tmp/theme.update')
  ]
}
```

## Configuration

### paths

Type: `string | string[]`

File paths (or globs) to watch for changes. The page will reload when any of these files change.


### always

Type: `boolean`

Default: `true`

Reload the page regardless of the modified file.

### delay

Type: `number`

Default: `25`

Milliseconds to wait before reloading after a change.

### log

Type: `boolean`

Default: `true`

Log file change-triggered reloads.

### root

Type: `string`

Default: `process.cwd()`

Resolve paths against this directory.

## Acknowledgements

This plugin is based on the ideas from the following projects and extends their functionality with the addition of a debounce function:

* [vite-plugin-live-reload](https://github.com/arnoson/vite-plugin-live-reload)
* [vite-plugin-full-reload](https://github.com/ElMassimo/vite-plugin-full-reload/)
