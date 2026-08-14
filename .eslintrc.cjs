module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2020: true
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
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
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/consistent-type-assertions": "off"
  }
}
