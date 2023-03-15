export default definePreset({
	name: 'theme',
	options: {
		// ...
	},
	handler: async() => {
		await extractTemplates()
		// ...
	},
})
