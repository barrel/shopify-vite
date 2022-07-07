import * as _ from 'lodash'

class Cart extends HTMLElement {
  constructor () {
    super()

    // Bind update method so it can be passed as callback argument
    this._updateContents = this._updateContents.bind(this)

    const onChangeQuantity = _.debounce(() => {
      this.updateFromForm(this.querySelector('form'))
    }, 250, { leading: false, trailing: true })

    // Use debounced event handler to update cart quanties
    this.addEventListener('change-quantity', onChangeQuantity)
  }

  // Add item to cart using HTML form data
  addItemFromForm (form) {
    const formData = new FormData(form)
    formData.append('sections', 'cart')

    fetch('/cart/add.js', {
      method: 'POST',
      body: formData
    }).then(this._updateContents)
  }

  // Update items in cart using HTML form data
  updateFromForm (form) {
    const formData = new FormData(form)
    formData.append('sections', 'cart')

    fetch('/cart/update.js', {
      method: 'POST',
      body: formData
    }).then(this._updateContents)
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
        sections: 'cart'
      })
    }).then(this._updateContents)
  }

  // Update cart contents by inserting new HTML from cart API's "sections" response
  _updateContents (cartResponse) {
    cartResponse.json().then(({ sections }) => {
      this.innerHTML = new DOMParser()
        .parseFromString(sections.cart, 'text/html')
        .querySelector('shopify-cart').innerHTML
    })
  }
}

customElements.define('shopify-cart', Cart)
