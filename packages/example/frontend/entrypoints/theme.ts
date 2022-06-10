import 'vite/modulepreload-polyfill'

import('lodash-es')
  .then(({ default: _ }) => {
    console.log(_.join(['Vite', '⚡️', 'Shopify'], ' '))
  })
  .catch(error => console.log(error))
