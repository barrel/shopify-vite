import DynamicSectionElement from '@/scripts/dynamic-section-element.js'

class CollectionProductGrid extends DynamicSectionElement {
  constructor () {
    super()

    this.state = {
      paginationLoading: false
    }

    this.addEventListener('change', this.onChangeFilter.bind(this))
    this.addEventListener('click', this.onClickFilterLink.bind(this))
    this.addEventListener('click', this.onClickPaginationLink.bind(this))

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

      this.loadSectionFromUrl(event.target.href, {
        appendToSlots: ['product-grid-items']
      }).then(() => {
        this.state.paginationLoading = false
      })
    }
  }

  // Handle filter link click
  onClickFilterLink (event) {
    if (event.target.tagName === 'A' && event.target.closest('[data-module="collection-filters"]')) {
      event.preventDefault()

      this.loadSectionFromUrl(event.target.href)
    }
  }

  // Handle filter input changes
  onChangeFilter (event) {
    console.log(event)
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

      // Fetch new collection product grid section and update contents
      this.loadSectionFromUrl(`${origin}${pathname}?${params}`, { replaceState: true })
    }
  }

  onLoadMoreScroll (changes) {
    changes.forEach((change) => {
      if (change.isIntersecting && !this.state.paginationLoading) {
        const paginationlink = this.querySelector('[data-pagination] a')

        if (paginationlink) {
          paginationlink.click()
        }
      }
    })
  }
}

customElements.define('collection-product-grid', CollectionProductGrid)
