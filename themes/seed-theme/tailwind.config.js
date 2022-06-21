const plugin = require('tailwindcss/plugin')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./**/*.{liquid,json}', './{frontend,modules}/**/*.js'],
  theme: {
    fontFamily: {
      sans: ['Helvetica Neue', ...defaultTheme.fontFamily.sans]
    },
    fontSize: {
      xs: ['14px', { lineHeight: '1' }],
      sm: ['15px', { lineHeight: '1' }],
      base: ['17px', { lineHeight: '1' }],
      lg: ['19px', { lineHeight: '1' }],
      xl: ['23px', { lineHeight: '1' }],
      '2xl': ['26px', { lineHeight: '1' }],
      '3xl': ['28px', { lineHeight: '1' }],
      '4xl': ['32px', { lineHeight: '1' }],
      '5xl': ['42px', { lineHeight: '1' }],
      '6xl': ['54px', { lineHeight: '1' }]
    },
    // NOTE: If these values change, update corresponding break_* variables in liquid snippets
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    extend: {
      // colors: {
      //   pink: '#e01883',
      //   navy: '#1e1647',
      //   cyan: '#51c8e7',
      //   'allergy-itch': '#67dad5',
      //   calming: '#44c6e8',
      //   'hip-joint': '#f9d13e',
      //   'skin-coat': '#f0b662',
      //   white: '#ffffff',
      //   error: '#e0181f',
      //   success: '#1fe018',
      //   placeholder: '#787391'
      // }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    plugin(({ addVariant }) => {
      addVariant('data-active-true', '&[data-active="true"]')
      addVariant('data-active-false', '&[data-active="false"]')
      addVariant('data-focus-true', '&[data-focus="true"]')
    })
  ]
}
