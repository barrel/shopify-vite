import { promises as fs, existsSync } from 'node:fs'
import path from 'node:path'
import { Plugin } from 'vite'
import debounce from 'just-debounce'

import { VitePluginShopifyThemeSettingsOptions, resolveOptions } from './options'

export default function shopifyThemeSettings (options: VitePluginShopifyThemeSettingsOptions = {}): Plugin {
  const resolvedOptions = resolveOptions(options)

  return {
    name: 'vite-plugin-shopify-theme-settings',
    configureServer (server) {
      // Generate new settings_schema.json when starting development server
      void generateSettingsSchemaJson(resolvedOptions)

      server.watcher
        .add(resolvedOptions.schemaSourceDir)
        .on('all', debounce((_event: string, path: string) => {
          if (path.includes(resolvedOptions.schemaSourceDir)) {
            // Generate new settings_schema.json when source files change in development
            void generateSettingsSchemaJson(resolvedOptions)
          }
        }, 100))
    },
    async closeBundle () {
      // Generate new settings_schema.json when finishing production build
      await generateSettingsSchemaJson(resolvedOptions)
    }
  }
}

const generateSettingsSchemaJson = async (options: Required<VitePluginShopifyThemeSettingsOptions>): Promise<void> => {
  const { schemaSourceDir, themeRoot } = options

  function replaceSettingsSchemaValues<T> (key: string, value: T): T | string {
    if (typeof options.values[key] === 'string') {
      return options.values[key]
    }

    return value
  }

  if (existsSync(schemaSourceDir)) {
    const sourceFiles = await fs.readdir(schemaSourceDir)

    const schemaFragments = await Promise.all(
      sourceFiles.map(async (fileName) => JSON.parse(await fs.readFile(path.join(schemaSourceDir, fileName), 'utf-8')))
    )

    const settingsSchema = schemaFragments.reduce(
      (schema, fragment) => schema.concat(fragment),
      []
    )

    await fs.writeFile(
      path.join(themeRoot, 'config/settings_schema.json'),
      JSON.stringify(settingsSchema, replaceSettingsSchemaValues, '  ') + '\n'
    )
  }
}
