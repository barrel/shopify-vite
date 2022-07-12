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
  }

  get siblingProductGridSections () {
    const siblingSections = document.querySelectorAll(`#${this.parentElement.id} ~ .shopify-section`)
    const siblingProductGridSections = []

    Array.from(siblingSections).every((siblingSection, index) => {
      if (siblingSection.firstElementChild?.getAttribute('data-module') === 'product-grid') {
        siblingProductGridSections.push(siblingSection)

        return index < this.querySelectorAll('label').length
      }

      return false
    })

    return siblingProductGridSections
  }
}

customElements.define('product-grid-toggle', ProductGridToggle)
