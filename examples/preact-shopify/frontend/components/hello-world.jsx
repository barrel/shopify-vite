import { signal } from '@preact/signals'
import viteLogo from '@/images/vite.svg'
import shopifyLogo from '@/images/shopify.svg'
import register from 'preact-custom-element'

function HelloWorld () {
  const count = signal(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://shopify.dev/themes" target="_blank">
          <img src={shopifyLogo} class="logo preact" alt="Shopify logo" />
        </a>
      </div>
      <h1>Vite + Shopify</h1>
      <div class="card">
        <button onClick={() => count.value++}>
          count is {count}
        </button>
        <p>
          Edit <code>components/hello-world.jsx</code> and save to test HMR
        </p>
      </div>
      <p class="read-the-docs">
        Click on the Vite and Shopify logos to learn more
      </p>
    </>
  )
}

register(HelloWorld, 'hello-world')
