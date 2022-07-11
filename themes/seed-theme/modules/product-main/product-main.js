import DynamicSectionElement from '@/scripts/dynamic-section-element.js'

class ProductMain extends DynamicSectionElement {
  constructor () {
    super()

    // Replace dynamic product content when changing variant options
    this.addEventListener('change-variant', (event) => {
      const { origin, pathname } = window.location
      const params = new URLSearchParams({
        variant: event.detail.id
      })

      this.loadSectionFromUrl(`${origin}${pathname}?${params}`, { replaceState: true })
    })
  }
}

customElements.define('product-main', ProductMain)
