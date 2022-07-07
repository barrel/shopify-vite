import { ProductForm } from '@shopify/theme-product-form'

class ProductFormElement extends HTMLElement {
  constructor () {
    super()

    const { productHandle } = this.dataset

    fetch(`/products/${productHandle}.js`)
      .then((response) => response.json())
      .then((productJson) => {
        new ProductForm(form, productJson)
      })

    this.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault()
      document.querySelector('shopify-cart').addItemFromForm(event.target)
    })
  }

  onOptionChange (event) {

  }

  onQuantityChange (event) {

  }

  onPropertyChange (event) {

  }

  onFormSubmit (event) {

  }
}

customElements.define('product-form', ProductFormElement)
