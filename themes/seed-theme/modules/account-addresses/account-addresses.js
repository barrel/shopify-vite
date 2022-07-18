class AccountAddresses extends HTMLElement {
  toggleForm (key) {
    this.querySelectorAll('account-address-form').forEach((addressForm) => {
      addressForm.classList.add('hidden')
    })
    this.querySelector(`#address-${key}`).classList.remove('hidden')
  }
}

customElements.define('account-addresses', AccountAddresses)
