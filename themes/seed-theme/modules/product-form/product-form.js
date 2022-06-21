class ProductForm extends HTMLElement {
  constructor () {
    super()

    this.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault()
      document.querySelector('shopify-cart').addItemFromForm(event.target)
    })
  }
}

customElements.define('product-form', ProductForm)
