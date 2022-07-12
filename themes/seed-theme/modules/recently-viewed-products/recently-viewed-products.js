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

    const recentlyViewed = getRecentlyViewed()
    const query = recentlyViewed
      .filter((handle) => handle !== this.dataset.handle)
      .map((handle) => `handle:${handle}`).join(' OR ')

    return fetch(`/search?view=product-grid&type=product&q=${query}`)
      .then((response) => response.text())
      .then((responseText) => {
        const newSectionEl = new DOMParser().parseFromString(responseText, 'text/html')

        const cards = _.sortBy(newSectionEl.querySelectorAll('[data-handle]'), (a, b) => {
          return recentlyViewed.indexOf(a?.dataset.handle) - recentlyViewed.indexOf(b?.dataset.handle)
        })

        cards.forEach((productCard) => {
          const productLink = productCard.querySelector('a')
          productLink.href = productLink.href.split('?')[0]
          productCard.parentElement.appendChild(productCard)
        })

        this.replaceContent(newSectionEl)
        this.querySelector('.hidden').classList.remove('hidden')
      })
  }
}

customElements.define('recently-viewed-products', RecentlyViewedProducts)

export default RecentlyViewedProducts
