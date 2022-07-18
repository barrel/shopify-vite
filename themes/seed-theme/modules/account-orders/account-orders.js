import DynamicSectionElement from '@/scripts/dynamic-section-element.js'

class AccountOrders extends DynamicSectionElement {
  constructor () {
    super()

    this.addEventListener('click', (event) => {
      if (event.target.tagName === 'A' && event.target.closest('[data-pagination]')) {
        event.preventDefault()

        this.loadSectionFromUrl(event.target.href, { replaceState: true })
      }
    })
  }
}

customElements.define('account-orders', AccountOrders)
