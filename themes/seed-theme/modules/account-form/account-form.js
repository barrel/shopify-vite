class AccountRecoverLink extends HTMLElement {
  constructor () {
    super()

    const form = this.closest('form')

    this.querySelector('a').addEventListener('click', (event) => {
      event.preventDefault()
      form.classList.add('hidden')
      form.nextElementSibling.classList.remove('hidden')
    })
  }
}

customElements.define('account-recover-link', AccountRecoverLink)

class AccountRecoverCancelLink extends HTMLElement {
  constructor () {
    super()

    const form = this.closest('form')

    this.querySelector('a').addEventListener('click', (event) => {
      event.preventDefault()
      form.classList.add('hidden')
      form.previousElementSibling.classList.remove('hidden')
    })
  }
}

customElements.define('account-recover-cancel-link', AccountRecoverCancelLink)
