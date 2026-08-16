// @ts-check

import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default defineConfig(
  {
    ignores: [
      'packages/**/dist/',
      'packages/**/assets/',
      'examples/**/assets/',
      'packages/**/__fixtures__/',
      'preset/templates/'
    ]
  },
  {
    languageOptions: {
      globals: {
        ...globals.es2023,
        ...globals.node
      }
    }
  },
  {
    files: ['**/*.{js,ts}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    files: ['eslint.config.js'],
    extends: [tseslint.configs.disableTypeChecked]
  }
)
