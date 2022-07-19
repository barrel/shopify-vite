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
  }

  // Handle pagination link click
  onClickPaginationLink (event) {
    // Verify click event came from pagination link
    if (event.target.tagName === 'A' && event.target.closest('[data-pagination]')) {
      event.preventDefault()

      event.target.classList.add('hidden')

      event.target.closest('[data-pagination]').querySelector('[data-pagination-loading]').classList.remove('hidden')
      this.state.paginationLoading = true

      return this.loadSectionFromUrl(event.target.href, {
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
    // Verify change event came from collection filters
    if (event.target.closest('[data-module="collection-filters"]')) {
      // Generate new URL with filter query params
      const { origin, pathname } = window.location

      let path = pathname
      const tagFilters = []

      if (path[path.length - 1] === '/') {
        path = path.slice(0, path.length - 1)
      }

      if (pathname.includes('/filter_')) {
        path = path.slice(0, path.indexOf('/filter_'))
      }

      const params = new URLSearchParams(new FormData(event.target.closest('form')))

      for (const param of params) {
        const [name, value] = param

        if (!value) {
          params.delete(name)
        }

        if (name === 'tag-filter') {
          tagFilters.push(value)
        }
      }

      params.delete('tag-filter')

      let fullPath = path

      if (tagFilters.length) {
        fullPath += `/${tagFilters.join('+')}`
      }

      // Fetch new collection product grid section and update contents
      this.loadSectionFromUrl(`${origin}${fullPath}?${params}`, { replaceState: true })
    }
  }
}

customElements.define('collection-product-grid', CollectionProductGrid)
