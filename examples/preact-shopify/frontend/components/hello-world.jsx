import { signal } from '@preact/signals'
import viteLogo from '@/images/vite.svg'
import shopifyLogo from '@/images/shopify.svg'
import register from 'preact-custom-element'

function HelloWorld () {
  const count = signal(0)

  return (
    <>
      <div class="flex justify-center">
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} class="h-24" alt="Vite logo" />
        </a>
        <a href="https://shopify.dev/themes" target="_blank">
          <img src={shopifyLogo} class="h-24" alt="Shopify logo" />
        </a>
      </div>
      <h1 class="my-12 text-3xl">Vite + Shopify</h1>
      <div class="p-8">
        <button class="bg-gray-100 py-2 px-4 rounded inline-flex" onClick={() => count.value++}>
          count is {count}
        </button>
        <p class="my-4">
          Edit <code>components/hello-world.jsx</code> and save to test HMR
        </p>
      </div>
      <p>
        Click on the Vite and Shopify logos to learn more
      </p>
    </>
  )
}

customElements.get('hello-world') || register(HelloWorld, 'hello-world');
