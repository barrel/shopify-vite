import DynamicSectionElement from '@/scripts/dynamic-section-element'

/**
 * ProductGridToggle wraps multiple product grids and enables toggling between them
 */
class ProductGridToggle extends DynamicSectionElement {
  constructor () {
    super()

    // Save reference to product grid container elements
    this.productGrids = this.querySelectorAll('[data-slot^="product-grid-toggle"]')

    // Toggle active grid based on button click
    this.addEventListener('click', (event) => {
      if (event.target.tagName === 'BUTTON' && event.target.dataset.toggle) {
        this.toggleProductGrid(parseInt(event.target.dataset.toggle, 10))
      }
    })

    // Toggle active grid based on theme customizer position
    this.parentElement.addEventListener('shopify:block:select', (event) => {
      const selectedIndex = [...event.target.parentElement.children].indexOf(event.target)
      this.toggleProductGrid(selectedIndex)
    })

    // Load additional tabs if deferred from initial liquid render
    if (this.hasAttribute('defer-additional-tabs')) {
      this.renderAdditionalTabs()
    }
  }

  toggleProductGrid (selectedIndex = 0) {
    this.productGrids.forEach((productGrid, index) => {
      if (index === selectedIndex) {
        productGrid.classList.remove('hidden')
        productGrid.querySelector('slider-base')?.embla?.reInit()
      } else {
        productGrid.classList.add('hidden')
      }
    })
    this.querySelector('button[data-toggle].active').classList.remove('active')
    this.querySelector(`button[data-toggle="${selectedIndex}"]`).classList.add('active')
  }

  renderAdditionalTabs () {
    const params = new URLSearchParams({
      view: 'ajax',
      section_id: this.parentElement.id.slice('shopify-section-'.length)
    })
    fetch(`${window.location.pathname}?${params}`)
      .then((response) => response.text())
      .then((responseText) => {
        const newSectionEl = new DOMParser()
          .parseFromString(responseText, 'text/html')

        this.replaceContent(newSectionEl, {
          onlySlots: ['product-grid-toggle-2', 'product-grid-toggle-3']
        })
      })
  }
}

customElements.define('product-grid-toggle', ProductGridToggle)
