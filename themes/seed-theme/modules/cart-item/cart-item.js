class CartItemQuantity extends HTMLElement {
  constructor () {
    super()

    const input = this.querySelector('input[name="updates[]"]')
    const plusButton = this.querySelector('button[name="plus"]')
    const minusButton = this.querySelector('button[name="minus"]')

    input.addEventListener('change', () => {
      // Dispatch "change-quantity" event to notify shopify-cart module of changes
      input.dispatchEvent(new Event('change-quantity', { bubbles: true }))
    })

    plusButton.addEventListener('click', () => {
      // Increment input value and dispatch change-quantity event
      input.value = parseInt(input.value, 10) + parseInt(input.step, 10)
      input.dispatchEvent(new Event('change-quantity', { bubbles: true }))
    })

    minusButton.addEventListener('click', () => {
      // Decrement input value and dispatch change-quantity event
      input.value = parseInt(input.value, 10) - parseInt(input.step, 10)
      input.dispatchEvent(new Event('change-quantity', { bubbles: true }))
    })
  }
}

customElements.define('cart-item-quantity', CartItemQuantity)

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
