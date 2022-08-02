class ProductGridToggle extends HTMLElement {
  constructor () {
    super()

    const toggleProductGridVisibility = (value) => {
      const selectedIndex = parseInt(value) - 1

      this.siblingProductGridSections.forEach((siblingSection, index) => {
        if (index === selectedIndex) {
          siblingSection.classList.remove('hidden')
        } else {
          siblingSection.classList.add('hidden')
        }
      })
    }

    // Toggle visibility based on radio button change event
    this.addEventListener('change', (event) => {
      toggleProductGridVisibility(event.target.value)
    })

    // Set initial state with first product grid visible
    toggleProductGridVisibility('1')

    this.parentElement.addEventListener('shopify:block:select', (event) => {
      const index = [...event.target.parentElement.children].indexOf(event.target)
      console.log({ event, index })
      toggleProductGridVisibility(`${index + 1}`)
      const checkbox = event.target.querySelector('input')

      if (!checkbox.checked) {
        checkbox.checked = true
      }
    })
  }

  get siblingProductGridSections () {
    return this.parentElement.querySelectorAll('[data-module="product-grid"]')
  }
}

customElements.define('product-grid-toggle', ProductGridToggle)
