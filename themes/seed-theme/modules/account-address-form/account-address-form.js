import { AddressForm as addressForm } from '@shopify/theme-addresses'

import './account-address-form.css'

class AccountAddressForm extends HTMLElement {
  constructor () {
    super()

    // Initialize form with @shopify/theme-addresses
    this.addressForm = addressForm(
      this.querySelector('form [data-address="root"]'),
      'en',
      { shippingCountriesOnly: true }
    )

    // Hide form after clicking "cancel"
    this.addEventListener('click', (event) => {
      if (event.target.getAttribute('type') === 'reset') {
        this.classList.add('hidden')
        setTimeout(() => {
          // Re-populate default values after form reset
          this.querySelectorAll('[data-default]').forEach((selectWithDefault) => {
            selectWithDefault.value = selectWithDefault.dataset.default
          })
        })
      }
    })
  }
}

customElements.define('account-address-form', AccountAddressForm)
