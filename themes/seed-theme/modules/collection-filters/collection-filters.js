class CollectionFilters extends HTMLElement {
  constructor () {
    super()

    this.query = {}

    this.addEventListener('change', (event) => {
      const formData = new FormData(this.querySelector('form'))
      console.log(formData)
    })

    const formData = new URLSearchParams(new FormData(this.querySelector('form')))
    console.log(formData.toString())
  }
}

customElements.define('collection-filters', CollectionFilters)
