class AccountAddressSummary extends HTMLElement {
  constructor () {
    super()

    this.querySelector('form').addEventListener('submit', (event) => {
      if (!confirm(this.dataset.deleteConfirm)) {
        event.preventDefault()
      }
    })
  }
}

customElements.define('account-address-summary', AccountAddressSummary)
