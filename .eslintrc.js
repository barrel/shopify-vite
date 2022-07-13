const path = require('path')

module.exports = {
  root: true,
  extends: ['standard-with-typescript'],
  parserOptions: {
    project: path.resolve(__dirname, './tsconfig.json')
  },
  ignorePatterns: [
    'dist'
  ]
}
