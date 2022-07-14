import _ from 'lodash'

import DynamicSectionElement from '@/scripts/dynamic-section-element'
import { getRecentlyViewed } from '../../frontend/scripts/recently-viewed'

class RecentlyViewedProducts extends DynamicSectionElement {
  constructor () {
    super()

    this.onScrollIntoView = this.onScrollIntoView.bind(this)

    this.state = {
      loaded: false
    }

    const observer = new IntersectionObserver(this.onScrollIntoView)
    observer.observe(this)
  }

  onScrollIntoView (entries) {
    if (!entries[0].isIntersecting || this.state.loaded) {
      return
    }

    this.state.loaded = true

    // Load list of recently viewed product handles from cookie
    const recentlyViewed = getRecentlyViewed()
    // Generate search query to load each product by its handle
    const query = recentlyViewed
      .filter((handle) => handle !== this.dataset.handle)
      .map((handle) => `handle:${handle}`).join(' OR ')

    // Request search results using product-grid view to render product grid containing queried products
    return fetch(`/search?view=product-grid&type=product&q=${query}`)
      .then((response) => response.text())
      .then((responseText) => {
        const newSectionEl = new DOMParser().parseFromString(responseText, 'text/html')

        // Sort product cards based on sequence of handles in recently viewed products list
        const sortedProductCards = _.sortBy(
          newSectionEl.querySelectorAll('[data-handle]'),
          (a, b) => recentlyViewed.indexOf(a?.dataset.handle) - recentlyViewed.indexOf(b?.dataset.handle)
        )

        // Re-order product card DOM nodes based on sorted order
        sortedProductCards.forEach((productCard) => {
          const productLink = productCard.querySelector('a')
          productLink.href = productLink.href.split('?')[0]
          productCard.parentElement.appendChild(productCard)
        })

        // Replace slots with newly-rendered content
        this.replaceContent(newSectionEl)

        // Remove "hidden" class to reveal module after products have been loaded
        this.querySelector('.hidden').classList.remove('hidden')
      })
  }
}

customElements.define('recently-viewed-products', RecentlyViewedProducts)

export default RecentlyViewedProducts
