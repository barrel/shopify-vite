export default definePreset({
  name: 'shopify-vite:theme',
  options: {
    base: true,
    tailwindcss: true
  },
  postInstall: ({ hl }) => [
    `Run the development server with ${hl('npm run dev')}`,
    `Edit your entry points in ${hl('frontend/entrypoints')}`,
    `Deploy your theme with ${hl('npm run deploy')}`
  ],
  handler: async (context) => {
    if (context.options.base) {
      await installVite()
    }

    if (context.options.tailwindcss) {
      await installTailwind()
    }
  }
})

async function installVite (): Promise<void> {
  await group({
    title: 'install Node dependencies',
    handler: async () => {
      await installPackages({
        title: 'install front-end dependencies',
        for: 'node',
        install: [
          'vite',
          'vite-plugin-shopify',
          'npm-run-all'
        ],
        dev: true
      })

      await editFiles({
        files: 'package.json',
        operations: [
          {
            type: 'edit-json',
            merge: {
              type: 'module',
              scripts: {
                dev: 'run-p -sr "shopify:dev -- {@}" "vite:dev" --',
                deploy: 'run-s "vite:build" "shopify:push -- {@}" --',
                'shopify:dev': 'shopify theme dev',
                'shopify:push': 'shopify theme push',
                'vite:dev': 'vite',
                'vite:build': 'vite build'
              }
            }
          }
        ],
        title: 'update package.json'
      })
    }
  })

  await group({
    title: 'extract Vite scaffolding',
    handler: async () => {
      await extractTemplates({
        title: 'extract templates',
        from: 'default',
        extractDotFiles: true
      })

      await editFiles({
        title: 'add vite-tag snippet',
        files: ['layout/*.liquid'],
        operations: [{
          type: 'add-line',
          match: /content_for_header/,
          position: 'before',
          lines: [
            '{%- liquid',
            '  render \'vite-tag\' with \'main.css\'',
            '  render \'vite-tag\' with \'main.js\'',
            '-%}'
          ]
        }]
      })
    }
  })
}

async function installTailwind (): Promise<void> {
  await installPackages({
    title: 'install Tailwind CSS',
    for: 'node',
    install: ['tailwindcss', 'autoprefixer', 'postcss'],
    dev: true
  })

  await group({
    title: 'extract Tailwind scaffolding',
    handler: async () => {
      await extractTemplates({
        title: 'extract Tailwind CSS config',
        from: 'tailwind'
      })

      await editFiles({
        title: 'remove placeholder CSS',
        files: 'frontend/entrypoints/main.css',
        operations: [
          { type: 'remove-line', match: /charset/ }
        ]
      })

      await editFiles({
        title: 'add Tailwind CSS imports',
        files: 'frontend/entrypoints/main.css',
        operations: [
          {
            skipIf: (content) => content.includes('tailwind'),
            type: 'add-line',
            lines: [
              '@tailwind base;',
              '@tailwind components;',
              '@tailwind utilities;'
            ],
            position: 'prepend'
          }
        ]
      })
    }
  })
}
