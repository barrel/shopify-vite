import 'vite/modulepreload-polyfill'
import viteLogo from '@/images/vite.svg'
import shopifyLogo from '@/images/shopify.svg'
import { setupCounter } from '@/components/counter'

const element: HTMLDivElement = document.createElement('div')
element.className = 'app'
element.innerHTML = `
  <a href="https://vitejs.dev" target="_blank">
    <img src="${viteLogo as string}" class="logo" alt="Vite logo" />
  </a>
  <a href="https://shopify.dev/themes" target="_blank">
    <img src="${shopifyLogo as string}" class="logo vanilla" alt="Shopify logo" />
  </a>
  <h1>Hello Vite!</h1>
  <div class="card">
    <button id="counter" type="button"></button>
  </div>
  <p class="read-the-docs">
    Click on the Vite logo to learn more
  </p>
`
document.body.appendChild(element)
setupCounter(document.querySelector('#counter'))

import('@/components/icon-bag').then(({ default: iconBag }) => {
  document.body.appendChild(iconBag)
}).catch(error => console.error(error))
