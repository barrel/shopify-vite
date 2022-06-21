class ProductGridToggle extends HTMLElement {
  constructor () {
    super()

    const productGrid1 = this.parentElement.nextElementSibling
    const productGrid2 = productGrid1.nextElementSibling

    if (
      productGrid1.firstElementChild.getAttribute('data-module') !== 'product-grid' ||
      productGrid2.firstElementChild.getAttribute('data-module') !== 'product-grid'
    ) {
      // Stop initializing if module section is not followed by two product grid sections
      return
    }

    const toggleProductGridVisibility = (value) => {
      if (value === '1') {
        productGrid1.classList.remove('hidden')
        productGrid2.classList.add('hidden')
      } else {
        productGrid2.classList.remove('hidden')
        productGrid1.classList.add('hidden')
      }
    }

    // Toggle visibility based on radio button change event
    this.addEventListener('change', (event) => {
      toggleProductGridVisibility(event.target.value)
    })

    // Set initial state with first product grid visible
    toggleProductGridVisibility('1')
  }
}

customElements.define('product-grid-toggle', ProductGridToggle)
