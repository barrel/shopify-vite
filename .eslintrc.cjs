module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: 'standard-with-typescript',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      './tsconfig.eslint.json',
      './packages/*/tsconfig.json',
      './examples/*/tsconfig.json',
      './preset/tsconfig.json'
    ]
  },
  "rules": {
    "@typescript-eslint/strict-boolean-expressions": "warn"
  }
}
