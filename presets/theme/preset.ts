export default definePreset({
  name: 'theme',
  options: {
    // ...
  },
  postInstall: ({ hl }) => [
    `Run the development server with ${hl('npm run dev')}`,
    `Edit your entry points in ${hl('frontend/entrypoints')}`,
    `Build for production with ${hl('npm run build')}`
  ],
  handler: async (context) => {
    await installVite()
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
          'vite-plugin-shopify'
        ],
        dev: true
      })

      await editFiles({
        files: 'package.json',
        operations: [
          { type: 'edit-json', merge: { scripts: { dev: 'vite', build: 'vite build' } } }
        ],
        title: 'update package.json'
      })

      await editFiles({
        title: 'update .gitignore',
        files: '.gitignore',
        operations: [{ type: 'add-line', position: 'prepend', lines: 'node_modules' }]
      })

      await editFiles({
        title: 'add vite-tag snippet',
        files: 'layout/theme.liquid',
        operations: [{
          type: 'add-line',
          match: /content_for_header/,
          position: 'before',
          lines: [
            '{%- render \'vite-tag\' with \'theme.css\' -%}',
            '{%- render \'vite-tag\' with \'theme.js\' -%}',
            ''
          ]
        }]
      })
    }
  })

  await group({
    title: 'extract Vite scaffolding',
    handler: async () => {
      await extractTemplates({
        title: 'extract templates',
        from: 'default'
      })
    }
  })
}
