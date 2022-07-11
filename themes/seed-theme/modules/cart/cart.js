import * as _ from 'lodash'

import DynamicSectionElement from '@/scripts/dynamic-section-element.js'

class Cart extends DynamicSectionElement {
  constructor () {
    super()

    // Bind update method so it can be passed as callback argument
    this.onCartUpdate = this.onCartUpdate.bind(this)

    // Use debounced event handler to update cart quanties
    this.addEventListener('change-quantity', _.debounce(() => {
      this.updateFromForm(this.querySelector('form'))
    }, 250, { leading: false, trailing: true }))
  }

  openDrawer () {
    this.classList.add('open')
  }

  closeDrawer () {
    this.classList.remove('open')
  }

  // Add item to cart using HTML form data
  addItemFromForm (form) {
    const formData = new FormData(form)
    formData.append('sections', 'site-header,cart')
    formData.append('sections_url', window.location.pathname)

    fetch('/cart/add.js', {
      method: 'POST',
      body: formData
    }).then(this.onCartUpdate)
  }

  // Update items in cart using HTML form data
  updateFromForm (form) {
    const formData = new FormData(form)
    formData.append('sections', 'site-header,cart')
    formData.append('sections_url', window.location.pathname)

    fetch('/cart/update.js', {
      method: 'POST',
      body: formData
    }).then(this.onCartUpdate)
  }

  // Remove an item from cart using line item key
  removeItem (key) {
    fetch('/cart/update.js', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        updates: { [key]: 0 },
        sections: 'site-header,cart',
        sections_url: window.location.pathname
      })
    }).then(this.onCartUpdate)
  }

  // Handle cart API response and update sections with dynamic content
  onCartUpdate (cartResponse) {
    cartResponse.json().then(({ sections }) => {
      // Replace content for re-rendered cart section
      const newCartEl = new DOMParser()
        .parseFromString(sections.cart, 'text/html')
      this.replaceContent(newCartEl)

      // Replace content for re-rendered site-header section
      const newSiteHeaderEl = new DOMParser()
        .parseFromString(sections['site-header'], 'text/html')
      document.querySelector('site-header')
        .replaceContent(newSiteHeaderEl)

      this.openDrawer()
    })
  }
}

customElements.define('shopify-cart', Cart)
