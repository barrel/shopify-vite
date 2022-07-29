import { promises as fs, existsSync } from 'fs'
import path from 'path'
import { Plugin } from 'vite'
import { throttle } from 'lodash'

import { VitePluginShopifyThemeSettingsOptions, ResolvedVitePluginShopifyThemeSettingsOptions, resolveOptions } from './options'

export default function shopifyThemeSettings (options: VitePluginShopifyThemeSettingsOptions = {}): Plugin {
  const resolvedOptions = resolveOptions(options)

  // Create throttled function for generating settings_schema.json
  const generateSettingsSchemaJsonFn = throttle(
    generateSettingsSchemaJson.bind(null, resolvedOptions),
    500,
    { leading: true, trailing: false }
  )

  return {
    name: 'vite-plugin-shopify-theme-settings',
    async configureServer (server) {
      // Generate new settings_schema.json when starting development server
      void generateSettingsSchemaJsonFn()

      server.watcher
        .add(resolvedOptions.schemaSourceDir)
        .on('all', (eventName, eventPath) => {
          if (eventPath.includes(resolvedOptions.schemaSourceDir)) {
            // Generate new settings_schema.json when source files change in development
            void generateSettingsSchemaJsonFn()
          }
        })
    },
    async closeBundle () {
      // Generate new settings_schema.json when finishing production build
      void generateSettingsSchemaJsonFn()
    }
  }
}

const generateSettingsSchemaJson = async (options: ResolvedVitePluginShopifyThemeSettingsOptions): Promise<void> => {
  const { schemaSourceDir, themeRoot } = options

  function replaceSettingsSchemaValues<T> (key: string, value: T): T | string {
    if (typeof options.values[key] === 'string') {
      return options.values[key]
    }

    return value
  }

  if (existsSync(schemaSourceDir)) {
    const sourceFiles = await fs.readdir(schemaSourceDir)

    const settingsSchema = await Promise.all(
      sourceFiles.map(async (fileName) => JSON.parse(await fs.readFile(path.join(schemaSourceDir, fileName), 'utf-8')))
    )

    await fs.writeFile(
      path.join(themeRoot, 'config/settings_schema.json'),
      JSON.stringify(settingsSchema, replaceSettingsSchemaValues, '  ') + '\n'
    )
  }
}
