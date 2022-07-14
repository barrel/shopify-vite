import _ from 'lodash'
// import { ProductForm } from '@shopify/theme-product-form'

class ProductFormElement extends HTMLElement {
  constructor () {
    super()

    if (this.dataset.variants) {
      this.variants = JSON.parse(this.dataset.variants)
    }

    const formEl = this.querySelector('form')

    formEl.addEventListener('change', (event) => {
      if (event.target.closest('[data-option]')) {
        this.onOptionChange(event)
      }
    })

    formEl.addEventListener('submit', (event) => {
      event.preventDefault()
      document.querySelector('shopify-cart').addItemFromForm(event.target)
    })
  }

  onOptionChange (event) {
    const formEl = this.querySelector('form')

    const option1 = formEl.querySelector('[data-option="1"] input[type="radio"]:checked')
    const option2 = formEl.querySelector('[data-option="2"] input[type="radio"]:checked')
    const option3 = formEl.querySelector('[data-option="3"] input[type="radio"]:checked')

    const matchingVariant = _.find(this.variants, {
      option1: option1?.value || null,
      option2: option2?.value || null,
      option3: option3?.value || null
    })

    this.querySelector('input[name="id"]').value = matchingVariant.id

    this.dispatchEvent(new CustomEvent('change-variant', {
      detail: { id: matchingVariant.id },
      bubbles: true
    }))
  }
}

customElements.define('product-form', ProductFormElement)
