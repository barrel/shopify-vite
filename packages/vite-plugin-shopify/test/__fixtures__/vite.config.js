import path from 'node:path'

/** @type {import('vite').UserConfig} */
export default {
  resolve: {
    alias: [
      {
        find: '~',
        replacement: path.posix.join(__dirname, 'frontend')
      },
      {
        find: '@',
        replacement: path.posix.join(__dirname, 'frontend')
      },
      {
        find: '@modules',
        replacement: path.posix.join(__dirname, 'modules')
      },
      {
        find: '~modules',
        replacement: path.posix.join(__dirname, 'modules')
      }
    ]
  }
}
