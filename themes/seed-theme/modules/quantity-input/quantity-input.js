class QuantityInput extends HTMLElement {
  constructor () {
    super()

    const input = this.querySelector('input[type="number"]')
    const plusButton = this.querySelector('button[name="plus"]')
    const minusButton = this.querySelector('button[name="minus"]')
    const min = parseInt(input.getAttribute('min'), 10)

    input.addEventListener('change', () => {
      // Dispatch "change-quantity" event
      input.dispatchEvent(new Event('change-quantity', { bubbles: true }))
    })

    plusButton.addEventListener('click', () => {
      // Increment input value and dispatch change-quantity event
      input.value = parseInt(input.value, 10) + parseInt(input.step, 10)
      input.dispatchEvent(new Event('change-quantity', { bubbles: true }))
    })

    minusButton.addEventListener('click', () => {
      // Decrement input value and dispatch change-quantity event
      input.value = Math.max(parseInt(input.value, 10) - parseInt(input.step, 10), min)
      input.dispatchEvent(new Event('change-quantity', { bubbles: true }))
    })
  }
}

customElements.define('quantity-input', QuantityInput)
