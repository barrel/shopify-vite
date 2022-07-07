class CollectionProductGrid extends HTMLElement {
  constructor () {
    super()

    this.state = {
      paginationLoading: false
    }

    this.addEventListener('click', this.onClickPaginationLink.bind(this))
    this.addEventListener('click', this.onClickFilterLink.bind(this))
    this.addEventListener('change', this.onChangeFilter.bind(this))

    this.loadMoreObserver = new IntersectionObserver(this.onLoadMoreScroll.bind(this))

    this.loadMoreObserver.observe(this.querySelector('[data-pagination]'))
  }

  // Handle pagination link click
  onClickPaginationLink (event) {
    // Verify click event came from pagination link
    if (event.target.tagName === 'A' && event.target.closest('[data-pagination]')) {
      event.preventDefault()

      event.target.classList.add('hidden')

      event.target.closest('[data-pagination]').querySelector('[data-pagination-loading]').classList.remove('hidden')
      this.state.paginationLoading = true

      fetch(`${event.target.href}&sections=collection-product-grid`)
        .then((response) => this.update(response, true))
    }
  }

  // Handle pagination link click
  onClickFilterLink (event) {
    if (event.target.tagName === 'A' && event.target.closest('collection-filters')) {
      event.preventDefault()

      fetch(`${event.target.href}&sections=collection-product-grid`)
        .then(this.update.bind(this))
    }
  }

  // Handle filter input changes
  onChangeFilter (event) {
    // Verify change event came from collection filters
    if (event.target.closest('[data-module="collection-filters"]')) {
      // Generate new URL with filter query params
      const { origin, pathname } = window.location
      const params = new URLSearchParams(new FormData(event.target.closest('form')))

      for (const param of params) {
        const [name, value] = param

        if (!value) {
          params.delete(name)
        }
      }

      const newUrl = `${origin}${pathname}?${params}`

      // Fetch new collection product grid section and update contents
      fetch(`${newUrl}&sections=collection-product-grid`)
        .then(this.update.bind(this))
        .then(() => {
          window.history.replaceState(null, null, newUrl)
        })
    }
  }

  onLoadMoreScroll (changes) {
    changes.forEach((change) => {
      if (change.isIntersecting && !this.state.paginationLoading) {
        const paginationlink = this.querySelector('[data-pagination] a')

        if (paginationlink) {
          this.querySelector('[data-pagination] a').click()
        }
      }
    })
  }

  // Update section with newly-rendered content
  update (response, appendProducts = false) {
    response.json().then((sections) => {
      const { 'collection-product-grid': newSectionHtml } = sections
      const newSection = new DOMParser().parseFromString(newSectionHtml, 'text/html')

      // Update product grid
      if (appendProducts) {
        // Append newly-loaded products to existing product grid
        this.querySelector('[data-module="product-grid"] > div').insertAdjacentHTML(
          'beforeend',
          newSection.querySelector('[data-module="product-grid"] > div').innerHTML
        )
      } else {
        // Replace product grid with new contents
        this.querySelector('[data-module="product-grid"] > div').innerHTML =
          newSection.querySelector('[data-module="product-grid"] > div').innerHTML
      }

      // Update collection filters
      this.querySelector('collection-filters')
        .update(newSection.querySelector('collection-filters'))

      // Update pagination section
      this.querySelector('[data-pagination]').innerHTML =
        newSection.querySelector('[data-pagination]').innerHTML

      this.state.paginationLoading = false
    })
  }
}

customElements.define('collection-product-grid', CollectionProductGrid)
