class CartItemRemove extends HTMLElement {
  constructor () {
    super()

    const cart = this.closest('shopify-cart')
    const item = this.closest('cart-item')

    this.addEventListener('click', (event) => {
      event.preventDefault()
      cart.removeItem(item.dataset.key)
    })
  }
}

customElements.define('cart-item-remove', CartItemRemove)
