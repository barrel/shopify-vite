export default definePreset({
  name: 'theme',
  options: {
    // ...
  },
  postInstall: ({ hl }) => [
    `Run the development server with ${hl('npm run dev') as string}`,
    `Edit your entry points in ${hl('frontend/entrypoints') as string}`,
    `Build for production with ${hl('npm run build') as string}`
  ],
  handler: async () => {
    await group({
      title: 'install Node dependencies',
      handler: async () => {
        await installPackages({
          title: 'install front-end dependencies',
          for: 'node',
          install: [
            'vite',
            'vite-plugin-shopify'
          ]
        })

        await editFiles({
          files: 'package.json',
          operations: [
            { type: 'edit-json', merge: { scripts: { dev: 'vite', build: 'vite build' } } }
          ]
        })
      }
    })
    await extractTemplates()
    // ...
  }
})
