module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-mixins'),
    require('postcss-flexbugs-fixes'),
    require('tailwindcss/nesting'),
    require('tailwindcss'),
    require('postcss-preset-env')({ stage: 1, features: { 'nesting-rules': false } })
  ]
}
