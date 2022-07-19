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
      colors: {
        blue: '#0080A3',
        'light-blue': '#BAEEF6',
        orange: '#FF6720',
        cream: '#FFDDC0',
        charcoal: '#63666A',
        'light-grey': '#AFAFAF',
        dove: '#D9D9D9',
        offwhite: '#F3F3F3'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    plugin(({ addVariant }) => {
      // "no-js" variant to be used for progressively-enhanced functionality
      addVariant('no-js', 'html.no-js &')
      addVariant('cart-loading', 'shopify-cart[data-loading="true"] &')
    })
  ],
  safelist: [
    'grecaptcha-badge',
    'shopify-challenge__container',
    'shopify-challenge__message',
    'shopify-challenge__button',
    'shopify-payment-button__button',
    'shopify-payment-button__button--unbranded',
    'shopify-policy__container',
    'shopify-policy__title',
    'shopify-policy__body'
  ]
}
